import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Home,
  FileText,
  Layers,
  ClipboardList,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Search,
  Upload,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Menu,
  X,
  LogOut,
  CheckCircle2,
  Lightbulb,
  WandSparkles,
  FileUp,
} from "lucide-react";
import "./Hub.css";

const navigation = [
  { label: "Learning Hub", icon: Home },
  { label: "My Notes", icon: FileText },
  { label: "Flashcards", icon: Layers },
  { label: "Quizzes", icon: ClipboardList },
  { label: "Progress", icon: ChartNoAxesCombined },
];

function Dashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notice, setNotice] = useState("");
  const [activePage, setActivePage] = useState("Learning Hub");

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const userName = savedUser?.name?.trim()?.split(" ")[0] || "Learner";

  const hour = new Date().getHours();
  const greeting =
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  

  const handleNavigation = (label) => {
  setActivePage(label);
  setMenuOpen(false);

  const routes = {
    "Learning Hub": "/hub",
    "My Notes": "/note",
    "Flashcards": "/flashcards",
    "Quizzes": "/quizzes",
    "Progress": "/progress",
    "Settings": "/settings",
  };

  navigate(routes[label]);
};

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setNotice("Please choose a PDF, TXT, or DOCX notes file.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setNotice(
      "Your file is selected! Next, we'll connect the upload to your backend."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/log");
  };

  const quickActions = [
    {
      title: "Make a summary",
      description: "Understand the big ideas faster.",
      icon: BookOpen,
      className: "summary-action",
    },
    {
      title: "Create flashcards",
      description: "Remember important facts.",
      icon: Layers,
      className: "flashcard-action",
    },
    {
      title: "Take a quiz",
      description: "Test what you've learned.",
      icon: ClipboardList,
      className: "quiz-action",
    },
  ];

  return (
    <div className="learning-page">
      <AnimatePresence>
        {menuOpen && (
          <motion.button
            className="sidebar-backdrop"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`learning-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="learning-brand">
          <div className="brand-symbol">
            <Brain size={25} />
          </div>

          <div>
            <h2>Cramify</h2>
            <span>Your study buddy</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-label">YOUR SPACE</div>

        <nav className="learning-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label ? "nav-item-active" : ""
                }`}
                onClick={() => handleNavigation(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.label === "Learning Hub" && (
                  <span className="active-dot" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <Lightbulb size={20} />
            </div>

            <h4>A little reminder</h4>
            <p>Small steps every day lead to big discoveries.</p>
            <span>You've got this! ✨</span>
          </div>

          <button
            className={`nav-item ${
              activePage === "Settings" ? "nav-item-active" : ""
            }`}
            onClick={() => handleNavigation("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button className="nav-item logout-item" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="learning-main">
        <header className="learning-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={23} />
          </button>

          <div className="breadcrumb">
            <span>My space</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <Search size={17} />
              <input
                type="search"
                placeholder="Find something..."
                aria-label="Search study materials"
                onChange={() =>
                  setNotice("Search will work when your notes are connected.")
                }
              />
            </div>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotice("You're all caught up! No new notifications.")}
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="topbar-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="learning-content">
          <motion.section
            className="welcome-section"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="welcome-copy">
              <div className="welcome-eyebrow">
                <Sparkles size={15} />
                YOUR LITTLE CORNER OF LEARNING
              </div>

              <h1>
                {greeting}, {userName}! <span>👋</span>
              </h1>

              <p>
                Ready to learn something wonderful today? Let's make those
                notes a little less scary.
              </p>

              <div className="welcome-note">
                <span className="welcome-note-icon">🌱</span>
                Every expert started as a beginner. Keep growing!
              </div>
            </div>

            <div className="welcome-art" aria-hidden="true">
              <div className="art-sun" />
              <div className="art-sparkle sparkle-one">✦</div>
              <div className="art-sparkle sparkle-two">✧</div>
              <div className="art-book">
                <BookOpen size={67} strokeWidth={1.4} />
              </div>
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-caption">Let's grow! 🌼</div>
            </div>
          </motion.section>

          {notice && (
            <motion.div
              className="learning-notice"
              role="status"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles size={18} />
              <span>{notice}</span>
              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                <X size={17} />
              </button>
            </motion.div>
          )}

          <motion.section
            className="upload-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <div className="upload-copy">
              <span className="section-kicker">LET'S GET STARTED</span>
              <h2>Turn your notes into knowledge.</h2>
              <p>
                Bring your class notes. We'll help you turn them into something
                easier to understand and remember.
              </p>

              <div className="upload-file-info">
                <CheckCircle2 size={16} />
                PDF, DOCX, or TXT files
              </div>

              <label className="upload-button">
                <Upload size={18} />
                {selectedFile ? "Choose another file" : "Choose your notes"}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="upload-illustration">
              <div className="upload-cloud cloud-one" />
              <div className="upload-cloud cloud-two" />

              <div className="floating-paper paper-back">
                <span />
                <span />
                <span />
              </div>

              <div className="floating-paper paper-front">
                <div className="paper-heading">
                  <FileText size={22} />
                  <span>MY NOTES</span>
                </div>
                <div className="paper-line paper-line-long" />
                <div className="paper-line" />
                <div className="paper-line paper-line-short" />
                <div className="paper-highlight" />
                <div className="paper-line" />
              </div>

              <div className="upload-arrow-circle">
                <WandSparkles size={24} />
              </div>

              <div className="upload-sparkle">✦</div>
              <div className="upload-sparkle sparkle-bottom">✧</div>
            </div>
          </motion.section>

          {selectedFile && (
            <motion.div
              className="selected-file-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="selected-file-icon">
                <FileText size={22} />
              </div>

              <div className="selected-file-details">
                <strong>{selectedFile.name}</strong>
                <span>
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready for the
                  next step
                </span>
              </div>

              <button
                className="remove-file-button"
                onClick={() => setSelectedFile(null)}
                aria-label="Remove selected file"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
          <section className="quick-actions-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">YOUR STUDY TOOLKIT</span>
                <h2>What shall we create?</h2>
              </div>

              <span className="heading-decoration">✿</span>
            </div>

            <div className="quick-actions-grid">
              {quickActions.map((action, index) => {
                const Icon = action.icon;

                return (
                  <motion.button
                    key={action.title}
                    className={`quick-action-card ${action.className}`}
                    onClick={() =>
                      setNotice(
                        selectedFile
                          ? `${action.title} will be available once we connect the AI study service.`
                          : "Choose your notes first, then we'll help you study them!"
                      )
                    }
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="quick-action-icon">
                      <Icon size={23} />
                    </div>

                    <div className="quick-action-text">
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>

                    <span className="quick-action-arrow">
                      <ArrowRight size={18} />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="recent-section">
            <div className="section-heading recent-heading">
              <div>
                <span className="section-kicker">YOUR LEARNING JOURNEY</span>
                <h2>Pick up where you left off</h2>
              </div>

              <span className="coming-soon-label">
                <Clock size={14} />
                Your history is coming soon
              </span>
            </div>

            <div className="empty-learning-state">
              <div className="empty-state-art">
                <div className="empty-state-circle">
                  <FileUp size={31} />
                </div>
                <span className="empty-star empty-star-one">✦</span>
                <span className="empty-star empty-star-two">✧</span>
              </div>

              <h3>Your study story starts here</h3>
              <p>
                Once you save your first notes, you'll find your study
                materials waiting for you right here.
              </p>

              <button
                className="empty-state-button"
                onClick={() =>
                  document
                    .querySelector(".upload-button input")
                    ?.click()
                }
              >
                Add your first notes
                <ArrowRight size={17} />
              </button>
            </div>
          </section>

          <footer className="learning-footer">
            <div className="footer-brand">
              <Brain size={18} />
              <strong>Cramify</strong>
            </div>

            <p>Learn a little. Grow a lot. 💜</p>

            <span>Made for curious minds</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;