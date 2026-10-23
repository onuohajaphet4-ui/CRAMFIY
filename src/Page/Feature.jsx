import React from "react";
import {
  FileText,
  Brain,
  Layers3,
  ClipboardCheck,
  MessageCircle,
  Camera,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import "./Feature.css";
import Navbar from "../Component/Navbar";
import Foot from '../Component/Footer'
import { motion } from "framer-motion";
import Footer from "../Component/Footer";
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    icon: FileText,
    title: "Smart Notes Management",
    tag: "YOUR MATERIALS, ORGANIZED",
    description:
      "Keep your learning materials organized in one convenient place. Upload supported documents, access saved notes, and return to important information whenever you need it.",
    details: [
      "Upload and manage study documents",
      "Access your saved learning materials",
      "Open and review supported PDF files",
    ],
    className: "feature-blue",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI-Powered Summaries",
    tag: "UNDERSTAND THE BIG PICTURE",
    description:
      "Make lengthy study materials easier to work through. Turn supported learning content into structured summaries that highlight important concepts, definitions, and key ideas.",
    details: [
      "Focus on important information",
      "Review topics in a clearer format",
      "Make revision sessions more manageable",
    ],
    className: "feature-purple",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Intelligent Flashcards",
    tag: "LEARN THROUGH ACTIVE RECALL",
    description:
      "Transform your study content into question-and-answer flashcards. Practise recalling information instead of simply reading the same material repeatedly.",
    details: [
      "Review concepts one card at a time",
      "Practise remembering key facts",
      "Revisit topics that need more attention",
    ],
    className: "feature-orange",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Practice Quizzes",
    tag: "PUT YOUR KNOWLEDGE TO THE TEST",
    description:
      "Use practice questions to engage with what you have studied. Quizzes can help you check your understanding, recognise knowledge gaps, and decide what to revise next.",
    details: [
      "Practise with topic-based questions",
      "Check your understanding",
      "Identify areas for further revision",
    ],
    className: "feature-green",
  },
  {
    number: "05",
    icon: MessageCircle,
    title: "Your Learning Buddy",
    tag: "QUESTIONS WELCOME",
    description:
      "Learning should not stop when a concept becomes difficult. Ask questions, seek explanations, and work through challenging topics with an AI study assistant.",
    details: [
      "Ask questions about your studies",
      "Request clearer explanations",
      "Explore difficult concepts step by step",
    ],
    className: "feature-pink",
  },
  {
    number: "06",
    icon: Camera,
    title: "Notes to PDF",
    tag: "FROM PAPER TO DIGITAL",
    description:
      "Bring physical and digital study materials into your learning workspace. The planned scanning workflow will let you photograph handwritten notes, combine pages into PDFs, and convert supported uploaded documents.",
    details: [
      "Prepare digital copies of paper notes",
      "Combine photographed pages into PDFs",
      "Keep converted files with your study materials",
    ],
    className: "feature-cyan",
  },
];

function Features() {
  return (
    <div>
      <Navbar/>
     <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="features-eyebrow">
            <Sparkles size={16} />
            THE CRAMIFY EXPERIENCE
          </span>

          <h2>
            Everything you need to
            <span> study smarter.</span>
          </h2>

          <p className="features-intro">
            Studying is more than reading and memorizing. Cramify brings
            your learning materials and study tools together to help you
            organize information, practise what you learn, and build a
            study routine that works for you.
          </p>
        </div>
        <div className="features-highlight">
          <div className="features-highlight-icon">
            <BookOpen size={28} />
          </div>

          <div>
            <h3>Your learning, all in one place.</h3>
            <p>
              Start with your study materials and explore different ways
              to understand, remember, and revise what matters.
            </p>
          </div>

          <Link to="/flow" className="features-highlight-link">
              See how it works <ArrowUpRight size={18} />
          </Link>
           
          
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className={`feature-card ${feature.className}`}
                key={feature.number}
              >
                <div className="feature-card-top">
                  <div className="feature-icon">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="feature-number">
                    {feature.number}
                  </span>
                </div>

                <span className="feature-tag">{feature.tag}</span>

                <h3>{feature.title}</h3>

                <p className="feature-description">
                  {feature.description}
                </p>

                <ul className="feature-details">
                  {feature.details.map((detail) => (
                    <li key={detail}>
                      <CheckCircle2 size={17} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="features-bottom">
          <div>
            <span className="features-bottom-label">
              A BETTER WAY TO PREPARE
            </span>

            <h3>
              Make every study session
              <br className="features-desktop-break" /> count.
            </h3>

            <p>
              Bring your materials, choose your learning tools, and
              take the next step toward understanding your subjects.
            </p>
          </div>

          <a href="/signup" className="features-cta">
            Get started <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
    </motion.div>
    <Foot/>
    </div>
  );
}

export default Features;