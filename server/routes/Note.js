const express = require("express");

const {
  upload,
  imageUpload,
  uploadNote,
  scanNotesToPdf,
  getNotes,
  deleteNote,
} = require("../controllers/Note");

const protect = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getNotes);

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadNote
);

router.post(
  "/scan-to-pdf",
  protect,
  imageUpload.array("images", 20),
  scanNotesToPdf
);

router.delete("/:id", protect, deleteNote);

module.exports = router;