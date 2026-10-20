import { FileText, Layers, ClipboardCheck, Brain } from "lucide-react";
import "./Feature.css";
import Navbar from "../Component/Navbar";
import Foot from '../Component/Footer'
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    text: "Turn long notes into simple, easy-to-understand summaries.",
    color: "blue",
  },
  {
    icon: Layers,
    title: "AI Flashcards",
    text: "Remember important concepts with flashcards made from your notes.",
    color: "purple",
  },
  {
    icon: ClipboardCheck,
    title: "Practice Quizzes",
    text: "Test your knowledge and discover what you've learned.",
    color: "orange",
  },
  {
    icon: Brain,
    title: "Your AI Study Buddy",
    text: "Make studying feel easier, friendlier, and more organised.",
    color: "pink",
  },
];

function Features() {
  return (
    <div className="home">
         <Navbar />
          <motion.div
        className="hero-left"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
    <section className="features-section" id="features">
      <div className="features-heading">
        <span>✨ MADE FOR CURIOUS MINDS</span>
        <h2>A little help goes a long way.</h2>
        <p>Everything you need to make studying feel less stressful.</p>
      </div>

      <div className="features-grid">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article className="feature-card" key={feature.title}>
              <div className={`feature-icon ${feature.color}`}>
                <Icon size={25} />
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
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

export default Features;