import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Camera,
  FileText,
  Search,
  MoreVertical,
  Trash2,
  BookOpen,
  FileCheck,
  ScanLine,
} from "lucide-react";
import "./Note.css";

function Notes() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

 const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);

  if (!files.length) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in before uploading notes.");
    event.target.value = "";
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

      const response = await fetch(
        "http://localhost:3000/api/notes/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      const savedNote = data.note;

      setNotes((prev) => [
        {
          id: savedNote._id,
          name: savedNote.title,
          type: savedNote.fileType,
          size: formatFileSize(savedNote.size),
          date: "Just now",
          scanned: false,
          fileUrl: savedNote.fileUrl,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Note upload error:", error);
      alert(`Couldn't upload ${file.name}: ${error.message}`);
    }
  }

  event.target.value = "";
};

useEffect(() => {
  const fetchNotes = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notes.");
      }

      setNotes(
        data.map((note) => ({
          id: note._id,
          name: note.title,
          type: note.fileType,
          size: formatFileSize(note.size),
          date: new Date(note.createdAt).toLocaleDateString(),
          scanned: false,
          fileUrl: note.fileUrl,
        }))
      );
    } catch (error) {
      console.error("Fetch notes error:", error);
    }
  };

  fetchNotes();
}, []);

 const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in again.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/notes/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete note.");
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
  } catch (error) {
    console.error("Delete note error:", error);
    alert(error.message || "Couldn't delete note.");
  }
};

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-page">
      {/* HEADER */}
      <section className="notes-top">
        <div>
          <p className="notes-eyebrow">YOUR STUDY LIBRARY</p>

          <h1>My Notes</h1>

          <p className="notes-subtitle">
            Keep your study materials organized and ready to learn.
          </p>
        </div>

        <div className="notes-header-buttons">
          <button
            className="secondary-note-btn"
            onClick={() => cameraInputRef.current?.click()}
          >
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

      {/* HIDDEN INPUTS */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        multiple
        hidden
        onChange={handleFileSelect}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileSelect}
      />

      {/* FEATURE CARDS */}
      <section className="note-feature-grid">
        <div className="scan-card">
          <div className="scan-card-content">
            <div className="feature-icon scan-icon">
              <ScanLine size={25} />
            </div>

            <p className="feature-small-title">SCAN YOUR NOTES</p>

            <h2>Turn a snap into a PDF</h2>

            <p>
              Got handwritten or physical notes? Take a picture and turn them
              into a clean PDF for your Cramify library.
            </p>

            <button
              className="scan-card-button"
              onClick={() => cameraInputRef.current?.click()}
            >
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
            Upload your existing study materials and keep everything in one
            place.
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
      {/* STATS */}
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
              {notes.filter((note) => note.type === "application/pdf").length}
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

      {/* NOTES SECTION */}
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
              Upload your first note or snap a physical note to start building
              your study library.
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
                onClick={() => cameraInputRef.current?.click()}
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
            {filteredNotes.map((note) => (
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
                    {note.scanned ? "Scanned note" : "Uploaded note"} •{" "}
                    {note.size} • {note.date}
                  </p>
                </div>

                <span className="note-type">
                  {note.scanned ? "SCAN" : "FILE"}
                </span>

                <button
                  className="note-menu"
                  onClick={() => deleteNote(note.id)}
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Notes;