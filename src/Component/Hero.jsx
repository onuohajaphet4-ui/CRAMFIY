import { motion } from "framer-motion";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

        <div className="badge">
          ✨ AI Study Buddy
        </div>

        <h1>
          Turn Notes Into
          <span> Knowledge</span>
        </h1>

        <p>
          Upload class notes and instantly get
          summaries, flashcards and quizzes.
          Study smarter, not harder.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started
          </button>

          <button className="secondary-btn">
            Watch Demo
          </button>
        </div>

      </motion.div>

      <div className="hero-right">

        <motion.div
          className="note-card"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        >
          📄 Biology Notes
        </motion.div>

        <motion.div
          className="brain-card"
          animate={{
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        >
          🧠 AI
        </motion.div>

        <motion.div
          className="quiz-card"
          animate={{ y: [0, 15, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        >
          🎯 Quiz Ready
        </motion.div>

      </div>

    </section>
  );
}

export default Hero;