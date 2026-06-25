import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Demo.css";

function ProductDemo() {
  const [step, setStep] = useState("idle");

  const runDemo = () => {
    setStep("uploading");

    setTimeout(() => {
      setStep("processing");
    }, 1500);

    setTimeout(() => {
      setStep("complete");
    }, 3500);
  };

  return (
    <section className="demo">

      <div className="demo-header">
        
        <p>
          Experience how your notes become study materials.
        </p>
      </div>

      <div className="demo-container">

        {step === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="demo-card"
          >
            <h3>📄 Biology Notes.pdf</h3>

            <button onClick={runDemo}>
              Generate Study Materials
            </button>
          </motion.div>
        )}

        <AnimatePresence>

          {step === "uploading" && (
            <motion.div
              className="demo-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>📤 Uploading Notes...</h3>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              className="demo-card processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="loader"></div>

              <h3>🧠 AI Processing...</h3>

              <p>Creating summaries, flashcards and quizzes</p>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              className="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="result-cardd">
                📄 Summary Ready
              </div>

              <div className="result-cardd">
                📚 12 Flashcards Generated
              </div>

              <div className="result-cardd">
                📝 10 Quiz Questions Created
              </div>

              <button
                className="reset-btn"
                onClick={() => setStep("idle")}
              >
                Run Again
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </section>
  );
}

export default ProductDemo;