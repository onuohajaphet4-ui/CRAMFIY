import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Camera,
  FileText,
  Search,
  Trash2,
  BookOpen,
  FileCheck,
  ScanLine,
  X,
  ImagePlus,
  ArrowUp,
  ArrowDown,
  RotateCw,
  LoaderCircle,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";

import "./Note.css";
import "./ScanNote.css";

const API_URL = "https://cramfiy-1.onrender.com/api/notes";

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";

  const mb = bytes / (1024 * 1024);

  return mb >= 1
    ? `${mb.toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function Notes() {
  const fileInputRef = useRef(null);
  const scanCameraRef = useRef(null);
  const scanGalleryRef = useRef(null);

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanImages, setScanImages] = useState([]);
  const [scanTitle, setScanTitle] = useState("");
  const [savingScan, setSavingScan] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const mapNote = (note) => ({
    id: note._id,
    name: note.title || note.originalName || "Untitled note",
    type: note.fileType || "",
    size: formatFileSize(note.size),
    date: new Date(note.createdAt || Date.now()).toLocaleDateString(),
    scanned: note.scanned === true,
    fileUrl: note.fileUrl,
  });

  const fetchNotes = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notes.");
      }

      setNotes(data.map(mapNote));
    } catch (error) {
      console.error("Fetch notes error:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Upload existing files
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const token = getToken();

    if (!token) {
      alert("Please log in before uploading notes.");
      return;
    }

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "title",
          file.name.replace(/\.[^/.]+$/, "")
        );

        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Upload failed.");
        }

        setNotes((prev) => [mapNote(data.note), ...prev]);
      } catch (error) {
        console.error("Note upload error:", error);
        alert(`Couldn't upload ${file.name}: ${error.message}`);
      }
    }
  };

  // Open and close scanner
  const openScanner = () => {
    setScanImages([]);
    setScanTitle("");
    setScannerOpen(true);
  };

  const closeScanner = () => {
    if (savingScan) return;

    scanImages.forEach((image) => URL.revokeObjectURL(image.preview));

    setScanImages([]);
    setScanTitle("");
    setScannerOpen(false);
  };

  // Add scanned images
  const addScanImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert("Please select JPG, JPEG, or PNG images.");
    }

    setScanImages((prev) => {
      const remaining = 20 - prev.length;

      if (remaining <= 0) {
        alert("You can add up to 20 pages per PDF.");
        return prev;
      }
      const selected = validFiles.slice(0, remaining);

      if (selected.length < validFiles.length) {
        alert("A PDF can contain a maximum of 20 pages.");
      }

      return [
        ...prev,
        ...selected.map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          rotation: 0,
        })),
      ];
    });
  };

  const removeScanImage = (id) => {
    setScanImages((prev) => {
      const removed = prev.find((image) => image.id === id);

      if (removed) URL.revokeObjectURL(removed.preview);

      return prev.filter((image) => image.id !== id);
    });
  };

  const moveScanImage = (index, direction) => {
    setScanImages((prev) => {
      const next = [...prev];
      const target = index + direction;

      if (target < 0 || target >= next.length) return prev;

      [next[index], next[target]] = [next[target], next[index]];

      return next;
    });
  };

  const rotateScanImage = (id) => {
    setScanImages((prev) =>
      prev.map((image) =>
        image.id === id
          ? { ...image, rotation: (image.rotation + 90) % 360 }
          : image
      )
    );
  };

  const awaitRotateImage = async (image) => {
    if (!image.rotation) return image.file;

    const bitmap = await createImageBitmap(image.file);
    const sideways = image.rotation === 90 || image.rotation === 270;

    const canvas = document.createElement("canvas");
    canvas.width = sideways ? bitmap.height : bitmap.width;
    canvas.height = sideways ? bitmap.width : bitmap.height;

    const context = canvas.getContext("2d");

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((image.rotation * Math.PI) / 180);
    context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

    bitmap.close();

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Image rotation failed.")),
        "image/jpeg",
        0.92
      );
    });

    return new File(
      [blob],
      image.file.name.replace(/\.[^/.]+$/, "") + ".jpg",
      { type: "image/jpeg" }
    );
  };

  // Save scanned images as a PDF
  const saveScannedNotes = async () => {
    if (!scanImages.length) {
      alert("Capture or select at least one page first.");
      return;
    }

    const token = getToken();

    if (!token) {
      alert("Please log in before saving notes.");
      return;
    }

    setSavingScan(true);

    try {
      const formData = new FormData();
      formData.append("title", scanTitle.trim() || "Scanned Notes");

      for (const image of scanImages) {
        const file = await awaitRotateImage(image);
        formData.append("images", file);
      }

      const response = await fetch(`${API_URL}/scan-to-pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Couldn't create PDF.");
      }

      setNotes((prev) => [mapNote(data.note), ...prev]);

      scanImages.forEach((image) => URL.revokeObjectURL(image.preview));

      setScanImages([]);
      setScanTitle("");
      setScannerOpen(false);

      alert("Your scanned PDF has been saved to My Notes.");
    } catch (error) {
      console.error("Scan upload error:", error);
      alert(error.message || "Couldn't save your scanned notes.");
    } finally {
      setSavingScan(false);
    }
  };

  

  // VIEW PDF
  const viewNote = (note) => {
    console.log("PDF URL:", note.fileUrl);
    if (!note.fileUrl) {
      alert("This note has no saved file URL.");
      return;
    }

    if (!note.type.includes("pdf") && !note.scanned) {
      alert("Preview is currently available for PDF notes. Download this file to open it in a compatible app.");
      return;
    }

    setViewingNote(note);
  };
  // DOWNLOAD FILE
  const downloadNote = async (note) => {
    if (!note.fileUrl) {
      alert("This note has no saved file URL.");
      return;
    }

    setDownloadingId(note.id);

    try {
      const response = await fetch(note.fileUrl);

      if (!response.ok) {
        throw new Error("The file could not be downloaded.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const extension = note.scanned || note.type.includes("pdf")
        ? ".pdf"
        : note.type.includes("wordprocessingml")
          ? ".docx"
          : note.type.includes("msword")
            ? ".doc"
            : note.type.includes("text/plain")
              ? ".txt"
              : "";

      const safeName = note.name.replace(/[<>:"/\\|?*]/g, "_");

      link.href = objectUrl;
      link.download = safeName.toLowerCase().endsWith(extension) || !extension
        ? safeName
        : `${safeName}${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download error:", error);

      // Fallback: open the hosted file if cross-origin downloading is blocked.
      window.open(note.fileUrl, "_blank", "noopener,noreferrer");
      alert("If the download did not start, the file has been opened in a new tab. Use your browser's download option.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    const token = getToken();

    if (!token) {
      alert("Please log in again.");
      return;
    }

    if (!window.confirm("Delete this note from your library?")) return;

    try {
      const response = await fetch(`https://cramfiy-1.onrender.com/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note.");
      }

      setNotes((prev) => prev.filter((note) => note.id !== id));

      if (viewingNote?.id === id) {
        setViewingNote(null);
      }
    } catch (error) {
      console.error("Delete note error:", error);
      alert(error.message || "Couldn't delete note.");
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-page">
      <section className="notes-top">
        <div>
          <p className="notes-eyebrow">YOUR STUDY LIBRARY</p>
          <h1>My Notes</h1>
          <p className="notes-subtitle">
            Keep your study materials organized and ready to learn.
          </p>
        </div>

        <div className="notes-header-buttons">
          <button className="secondary-note-btn" onClick={openScanner}>
            <Camera size={18} />
            Snap a Note
          </button>

          <button
            className="primary-note-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            Upload Notes
          </button>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        multiple
        hidden
        onChange={handleFileSelect}
      />

      <input
        ref={scanCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={addScanImages}
      />

      <input
        ref={scanGalleryRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        hidden
        onChange={addScanImages}
      />

      <section className="note-feature-grid">
        <div className="scan-card">
          <div className="scan-card-content">
            <div className="feature-icon scan-icon">
              <ScanLine size={25} />
            </div>

            <p className="feature-small-title">SCAN YOUR NOTES</p>
            <h2>Turn your pages into one PDF</h2>
            <p>
              Photograph handwritten notes or select pictures
              and save every page together in your library.
            </p>

            <button className="scan-card-button" onClick={openScanner}>
              <Camera size={17} />
              Scan a Note
            </button>
          </div>

          <div className="scan-decoration">
            <FileText size={80} />
          </div>
        </div>

        <div className="quick-card">
          <div className="feature-icon">
            <BookOpen size={23} />
          </div>

          <p className="feature-small-title">READY TO LEARN?</p>
          <h2>Bring your notes together</h2>
          <p>
            Upload your existing study materials and keep
            everything in one place.
          </p>

          <button
            className="quick-upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={17} />
            Add Notes
          </button>
        </div>
      </section>

      <section className="notes-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={19} />
          </div>
          <div>
            <span>Total Notes</span>
            <strong>{notes.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileCheck size={19} />
          </div>
          <div>
            <span>PDF Notes</span>
            <strong>
              {notes.filter(
                (note) =>
                  note.type?.includes("pdf") || note.scanned
              ).length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Camera size={19} />
          </div>
          <div>
            <span>Scanned</span>
            <strong>{notes.filter((note) => note.scanned).length}</strong>
          </div>
        </div>
      </section>

      <section className="recent-notes">
        <div className="recent-header">
          <div>
            <p className="notes-eyebrow">YOUR LIBRARY</p>
            <h2>Recent Notes</h2>
          </div>
          {notes.length > 0 && (
            <div className="notes-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="notes-empty">
            <div className="empty-note-icon">
              <FileText size={34} />
            </div>
            <h3>Your study library is empty</h3>
            <p>
              Upload your first note or snap physical pages to
              start building your study library.
            </p>

            <div className="empty-buttons">
              <button
                className="primary-note-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={17} />
                Upload Note
              </button>

              <button
                className="secondary-note-btn"
                onClick={openScanner}
              >
                <Camera size={17} />
                Snap Note
              </button>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="no-search-results">
            <Search size={30} />
            <h3>No notes found</h3>
            <p>Try searching for a different note name.</p>
          </div>
        ) : (
          <div className="notes-list">
            {filteredNotes.map((note) => {
              const isPdf =
                note.scanned || note.type?.includes("pdf");

              return (
                <div className="note-row" key={note.id}>
                  <div className="note-file-icon">
                    {note.scanned ? (
                      <Camera size={23} />
                    ) : (
                      <FileText size={23} />
                    )}
                  </div>

                  <div className="note-details">
                    <h3>{note.name}</h3>
                    <p>
                      {note.scanned ? "Scanned PDF" : "Uploaded file"}{" "}
                      • {note.size} • {note.date}
                    </p>
                  </div>

                  <span className="note-type">
                    {isPdf ? "PDF" : "FILE"}
                  </span>

                  <div className="note-actions">
                    {isPdf && (
                      <button
                        className="note-menu"
                        onClick={() => viewNote(note)}
                        title="View PDF"
                        aria-label={`View ${note.name}`}
                      >
                        <Eye size={18} />
                      </button>
                    )}

                    <button
                      className="note-menu"
                      onClick={() => downloadNote(note)}
                      title="Download file"
                      aria-label={`Download ${note.name}`}
                      disabled={downloadingId === note.id}
                    >
                      {downloadingId === note.id ? (
                        <LoaderCircle
                          size={18}
                          className="scanner-spin"
                        />
                      ) : (
                        <Download size={18} />
                      )}
                    </button>

                    <button
                      className="note-menu"
                      onClick={() => deleteNote(note.id)}
                      title="Delete note"
                      aria-label={`Delete ${note.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {viewingNote && (
        <div
          className="pdf-viewer-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingNote(null);
            }
          }}
        >
          <section
            className="pdf-viewer-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Viewing ${viewingNote.name}`}
          >
            <header className="pdf-viewer-header">
              <div>
                <p className="notes-eyebrow">CRAMIFY PDF VIEWER</p>
                <h2>{viewingNote.name}</h2>
              </div>

              <div className="pdf-viewer-actions">
                <button
                  className="secondary-note-btn"
                  onClick={() => downloadNote(viewingNote)}
                  disabled={downloadingId === viewingNote.id}
                >
                  <Download size={17} />
                  Download
                </button>

                <button
                  className="note-menu"
                  onClick={() =>
                    window.open(
                      viewingNote.fileUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  title="Open PDF in new tab"
                  aria-label="Open PDF in new tab"
                >
                  <ExternalLink size={19} />
                </button>

                <button
                  className="note-menu"
                  onClick={() => setViewingNote(null)}
                  title="Close viewer"
                  aria-label="Close PDF viewer"
                >
                  <X size={22} />
                </button>
              </div>
            </header>

            <div className="pdf-viewer-content">
              
             <iframe
  key={viewingNote.id}
  src={`${viewingNote.fileUrl}#toolbar=1&navpanes=0`}
  title={viewingNote.name}
  className="pdf-viewer-frame"
  width="100%"
  height="600"
  style={{ border: "none" }}
/>
            </div>
          </section>
        </div>
      )}

      {scannerOpen && (
        <div className="scanner-overlay">
          <section className="scanner-modal">
            <header className="scanner-header">
              <div>
                <p className="notes-eyebrow">CRAMIFY SCANNER</p>
                <h2>Scan your notes</h2>
                <p>Capture pages, arrange them, then save as one PDF.</p>
              </div>

              <button
                className="scanner-close"
                onClick={closeScanner}
                disabled={savingScan}
                aria-label="Close scanner"
              >
                <X size={22} />
              </button>
            </header>

            <div className="scanner-actions">
              <button
                className="primary-note-btn"
                onClick={() => scanCameraRef.current?.click()}
                disabled={savingScan || scanImages.length >= 20}
              >
                <Camera size={18} />
                Take Photo
              </button>

              <button
                className="secondary-note-btn"
                onClick={() => scanGalleryRef.current?.click()}
                disabled={savingScan || scanImages.length >= 20}
              >
                <ImagePlus size={18} />
                Choose Pictures
              </button>
            </div>

            <p className="scanner-hint">
              {scanImages.length} of 20 pages selected. Images are
              arranged in the order shown below.
            </p>

            {scanImages.length === 0 ? (
              <div className="scanner-empty">
                <ScanLine size={42} />
                <h3>Your pages will appear here</h3>
                <p>Take a photo or choose images from your gallery.</p>
              </div>
            ) : (
              <div className="scanner-pages">
                {scanImages.map((image, index) => (
                  <article className="scanner-page" key={image.id}>
                    <div className="scanner-preview">
                      <img
                        src={image.preview}
                        alt={`Scanned page ${index + 1}`}
                        style={{
                          transform: `rotate(${image.rotation}deg)`,
                        }}
                      />
                      <span>Page {index + 1}</span>
                    </div>

                    <div className="scanner-page-actions">
                      <button
                        onClick={() => moveScanImage(index, -1)}
                        disabled={index === 0 || savingScan}
                        title="Move page up"
                      >
                        <ArrowUp size={17} />
                      </button>

                      <button
                        onClick={() => moveScanImage(index, 1)}
                        disabled={
                          index === scanImages.length - 1 || savingScan
                        }
                        title="Move page down"
                      >
                        <ArrowDown size={17} />
                      </button>

                      <button
                        onClick={() => rotateScanImage(image.id)}
                        disabled={savingScan}
                        title="Rotate page"
                      >
                        <RotateCw size={17} />
                      </button>

                      <button
                        onClick={() => removeScanImage(image.id)}
                        disabled={savingScan}
                        title="Remove page"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <label className="scanner-title-label">
              PDF title
              <input
                type="text"
                value={scanTitle}
                onChange={(event) => setScanTitle(event.target.value)}
                placeholder="e.g. Biology - Cell Structure"
                maxLength={100}
                disabled={savingScan}
              />
            </label>

            <footer className="scanner-footer">
              <button
                className="secondary-note-btn"
                onClick={closeScanner}
                disabled={savingScan}
              >
                Cancel
              </button>

              <button
                className="primary-note-btn"
                onClick={saveScannedNotes}
                disabled={savingScan || scanImages.length === 0}
              >
                {savingScan ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="scanner-spin"
                    />
                    Saving PDF...
                  </>
                ) : (
                  <>
                    <FileCheck size={18} />
                    Create PDF
                  </>
                )}
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default Notes;