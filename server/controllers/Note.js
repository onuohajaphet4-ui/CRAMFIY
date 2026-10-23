const Note = require("../models/Notes");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");
const PDFDocument = require("pdfkit");
const libre = require("libreoffice-convert");

libre.convertAsync = require("util").promisify(libre.convert);

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed."));
  },
});

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 20,
  },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only JPG, JPEG, and PNG images are supported."));
  },
});

const textToPdf = (text) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(12).text(text || " ", {
      width: 495,
      lineGap: 4,
    });

    doc.end();
  });

const uploadBufferToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const publicName = originalName.replace(/\.[^/.]+$/, "");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cramify/notes",
       resource_type: "image",
        public_id: `${Date.now()}-${publicName}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });

const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file.",
      });
    }

    let fileBuffer = req.file.buffer;
    let fileType = req.file.mimetype;
    let originalName = req.file.originalname;

    const extension = originalName.split(".").pop().toLowerCase();

    if (extension === "txt") {
      fileBuffer = await textToPdf(
        req.file.buffer.toString("utf8")
      );

      fileType = "application/pdf";
      originalName = originalName.replace(/\.txt$/i, "") + ".pdf";
    } else if (["doc", "docx"].includes(extension)) {
      fileBuffer = await libre.convertAsync(
        req.file.buffer,
        ".pdf",
        undefined
      );

      fileType = "application/pdf";
      originalName = originalName.replace(/\.(doc|docx)$/i, "") + ".pdf";
    }

    const title =
      (req.body.title || "").trim() 
      originalName.replace(/\.[^/.]+$/, "");

    const result = await uploadBufferToCloudinary(
      fileBuffer,
      originalName
    );

    const note = await Note.create({
      user: req.user,
      title,
      originalName,
      fileUrl: result.secure_url,
      fileType,
      size: fileBuffer.length,
      scanned: false,
    });

    return res.status(201).json({
      message: ["txt", "doc", "docx"].includes(extension)
        ? "File converted to PDF and uploaded successfully."
        : "Note uploaded successfully.",
      note,
    });
  } catch (error) {
    console.error("Upload note error:", error);

    return res.status(500).json({
      message: "Failed to convert or upload note. Please try again.",
    });
  }
};

const scanNotesToPdf = async (req, res) => {
  try {
    const images = req.files || [];

    if (!images.length) {
      return res.status(400).json({
        message: "Please capture or select at least one image.",
      });
    }

    const title =
      (req.body.title || "").trim() || "Scanned Notes";
      const safeTitle =
      title
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .slice(0, 100)
        .trim() || "Scanned Notes";

    const pdfBuffer = await new Promise((resolve, reject) => {
      const pdf = new PDFDocument({
        autoFirstPage: false,
        compress: true,
      });

      const chunks = [];

      pdf.on("data", (chunk) => chunks.push(chunk));
      pdf.on("end", () => resolve(Buffer.concat(chunks)));
      pdf.on("error", reject);

      try {
        for (const image of images) {
          const dimensions = pdf.openImage(image.buffer);

          const pageWidth = 595.28;
          const pageHeight = 841.89;
          const padding = 24;

          const availableWidth = pageWidth - padding * 2;
          const availableHeight = pageHeight - padding * 2;

          const scale = Math.min(
            availableWidth / dimensions.width,
            availableHeight / dimensions.height
          );

          const width = dimensions.width * scale;
          const height = dimensions.height * scale;

          pdf.addPage({
            size: "A4",
            margin: 0,
          });

          pdf.image(
            image.buffer,
            (pageWidth - width) / 2,
            (pageHeight - height) / 2,
            { width, height }
          );
        }

        pdf.end();
      } catch (error) {
        reject(error);
      }
    });

    const originalName = `${safeTitle}.pdf`;

    const result = await uploadBufferToCloudinary(
      pdfBuffer,
      originalName
    );

    const note = await Note.create({
      user: req.user,
      title: safeTitle,
      originalName,
      fileUrl: result.secure_url,
      fileType: "application/pdf",
      size: pdfBuffer.length,
      scanned: true,
    });

    return res.status(201).json({
      message: "Scanned pages converted to PDF and saved successfully.",
      note,
    });
  } catch (error) {
    console.error("Scan notes to PDF error:", error);

    return res.status(500).json({
      message: "Failed to create the PDF. Please try again.",
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({
      createdAt: -1,
    });

    return res.status(200).json(notes);
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      message: "Failed to fetch notes.",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      message: "Failed to delete note.",
    });
  }
};

module.exports = {
  upload,
  imageUpload,
  uploadNote,
  scanNotesToPdf,
  getNotes,
  deleteNote,
};