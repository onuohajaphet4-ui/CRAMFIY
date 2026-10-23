import React from "react";
import {
  Upload,
  FileText,
  Brain,
  MessageCircle,
  BookOpenCheck,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Target,
  RefreshCw,
} from "lucide-react";

import "./Flow.css";
import Navbar from "../Component/Navbar";
import Foot from '../Component/Footer'
import { motion } from "framer-motion";
import Footer from "../Component/Footer";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Bring your materials",
    subtitle: "START WITH WHAT YOU HAVE",
    description:
      "Every effective study session begins with useful learning material. Start by uploading your supported documents and existing notes. The planned photo-scanning feature will also let you capture handwritten pages and prepare them as PDFs.",
    points: [
      "Upload supported study documents",
      "Photograph physical notes when scanning is available",
      "Keep your materials in one learning workspace",
    ],
    color: "flow-blue",
    label: "Your study materials",
  },
  {
    number: "02",
    icon: FileText,
    title: "Organize and prepare",
    subtitle: "MAKE YOUR CONTENT ACCESSIBLE",
    description:
      "Keep your study files organized and easy to revisit. Converted documents and photographed pages can be saved as PDFs. These materials will provide the content for your later study activities.",
    points: [
      "Find and open saved notes",
      "Prepare documents for study",
      "Build a reusable library of learning materials",
    ],
    color: "flow-cyan",
    label: "Your notes library",
  },
  {
    number: "03",
    icon: Brain,
    title: "Create your study resources",
    subtitle: "TURN CONTENT INTO PRACTICE",
    description:
      "Instead of relying on one way of studying, use different learning resources. Cramify's planned AI tools will help turn readable study material into summaries, flashcards, and practice quizzes.",
    points: [
      "Review the main ideas with summaries",
      "Practise recall using flashcards",
      "Check your understanding with quizzes",
    ],
    color: "flow-purple",
    label: "Your learning toolkit",
  },
  {
    number: "04",
    icon: MessageCircle,
    title: "Ask, explore, and understand",
    subtitle: "GET HELP WHEN YOU NEED IT",
    description:
      "Some topics take more than one reading to understand. Learning Buddy is designed to let you ask questions, explore unfamiliar concepts, and receive explanations that help make difficult material clearer.",
    points: [
      "Ask questions about a topic",
      "Request simpler explanations",
      "Explore difficult ideas step by step",
    ],
    color: "flow-pink",
    label: "Your Learning Buddy",
  },
  {
    number: "05",
    icon: BookOpenCheck,
    title: "Practise, review, and improve",
    subtitle: "MAKE LEARNING A ROUTINE",
    description:
      "Learning continues after the first study session. Return to your notes, revisit challenging concepts, and practise with your learning resources. Use what you discover to decide what to study next.",
    points: [
      "Revisit difficult topics",
      "Test what you remember",
      "Build a consistent revision routine",
    ],
    color: "flow-green",
    label: "Your next study session",
  },
];

function StudyFlow() {
  return (
    <div>
      <Navbar/>
    <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

    <section className="study-flow-section" id="study-flow">
      <div className="study-flow-container">
        <header className="study-flow-heading">
          <span className="study-flow-eyebrow">
            <Sparkles size={16} />
            YOUR LEARNING JOURNEY
          </span>

          <h2>
            From study materials
            <span> to real understanding.</span>
          </h2>

          <p>
            A good study routine needs more than effort. It needs
            organization, useful practice, and a clear way to revisit
            what you learn. Cramify brings these parts together in a
            simple learning journey.
          </p>
        </header>

        <div className="study-flow-overview">
          <div className="study-flow-overview-icon">
            <Target size={26} />
          </div>
          <div className="study-flow-overview-copy">
            <span>THE BIG PICTURE</span>
            <h3>Learn at your pace. Return when you need to.</h3>
            <p>
              Start with your own materials, explore different study
              methods, and keep building on what you understand.
            </p>
          </div>

          <div className="study-flow-loop-icon">
            <RefreshCw size={25} />
          </div>
        </div>

        <div className="study-flow-timeline">
          
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <React.Fragment key={step.number}>
                <article className={`study-flow-step ${step.color}`}>
                  <div className="study-flow-step-visual">
                    <div className="study-flow-step-icon">
                      <Icon size={29} strokeWidth={1.8} />
                    </div>

                    <span className="study-flow-step-number">
                      {step.number}
                    </span>

                    <div className="study-flow-visual-caption">
                      <span className="study-flow-caption-dot" />
                      {step.label}
                    </div>
                  </div>

                  <div className="study-flow-step-content">
                    <span className="study-flow-step-subtitle">
                      {step.subtitle}
                    </span>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>

                    <ul>
                      {step.points.map((point) => (
                        <li key={point}>
                          <span className="study-flow-check">
                            <ArrowRight size={14} />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                {index < steps.length - 1 && (
                  <div
                    className="study-flow-connector"
                    aria-hidden="true"
                  >
                    <span />
                    <ArrowDown size={18} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="study-flow-ending">
          <div className="study-flow-ending-icon">
            <BookOpenCheck size={30} />
          </div>

          <div className="study-flow-ending-copy">
            <span>YOUR NEXT CHAPTER STARTS HERE</span>
            <h3>Make your learning more intentional.</h3>
            <p>
              Organize your materials, find the study methods that help
              you, and take your next step one topic at a time.
            </p>
          </div>

          <a href="/signup" className="study-flow-button">
            Start learning <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
    </motion.div>
    <Foot/>
    </div>
  );
}

export default StudyFlow;