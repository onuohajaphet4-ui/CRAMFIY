import { Upload, Sparkles, BookOpen, Trophy } from "lucide-react";
import "./Flow.css";
import Navbar from "../Component/Navbar";
import Foot from '../Component/Footer'
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Bring your notes",
    text: "Upload your study materials to get started.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Let the magic happen",
    text: "AI helps turn your notes into study materials.",
  },
  {
    icon: BookOpen,
    number: "03",
    title: "Study your way",
    text: "Explore summaries, flashcards, and quizzes.",
  },
  {
    icon: Trophy,
    number: "04",
    title: "Grow as you learn",
    text: "Practise regularly and build your confidence.",
  },
];

function StudyFlow() {
  return (
     <div className="home">
         <Navbar />
           <motion.div
        className="hero-left"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
    <section className="study-flow-section" id="study-flow">
      <div className="study-flow-heading">
        <span>📚 YOUR LEARNING JOURNEY</span>
        <h2>Four little steps to smarter studying.</h2>
        <p>Less overwhelm. More understanding. One step at a time.</p>
      </div>

      <div className="study-flow-grid">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article className="study-step" key={step.number}>
              <div className="step-top">
                <div className="step-icon">
                  <Icon size={24} />
                </div>
                <span>{step.number}</span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          );
        })}
      </div>
    </section>
    </motion.div>
     <Foot/>
    </div>
  );
}

export default StudyFlow;