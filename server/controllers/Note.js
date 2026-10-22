const Note = require("../models/Notes");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed."));
  },
});

// Upload a note
const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file.",
      });
    }

    const title =
      (req.body.title || "").trim() 
      req.file.originalname.replace(/\.[^/.]+$/, "");

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cramify/notes",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(req.file.buffer).pipe(stream);
    });

    const note = await Note.create({
      user: req.user,
      title,
      originalName: req.file.originalname,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      message: "Note uploaded successfully.",
      note,
    });
  } catch (error) {
    console.error("Upload note error:", error);

    res.status(500).json({
      message: "Failed to upload note.",
    });
  }
};

// Get all notes for the logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: "Failed to fetch notes.",
    });
  }
};

// Delete a note
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

    res.status(200).json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: "Failed to delete note.",
    });
  }
};

module.exports = {
  upload,
  uploadNote,
  getNotes,
  deleteNote,
};