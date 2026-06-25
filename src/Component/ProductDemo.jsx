import { motion } from "framer-motion";
import { FileText, Brain, BookOpen, ClipboardList, Sparkles } from "lucide-react";
import "./ProductDemo.css";
import  Demo from '../Component/Demo'

function ProductDemo() {
  return (
    <section className="">

    <section className="demo-section">

      <div className="demo-header">
        <span>⚡ How It Works</span>

        <h2>See Cramify In Action</h2>

        <p>
          Upload your notes and let AI transform them
          into study materials within seconds.
        </p>
      </div>

      <div className="workflow">

        <motion.div
          className="workflow-card"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <FileText size={40} />
          <h3>Upload Notes</h3>
          <p>PDF, DOCX or lecture notes.</p>
        </motion.div>

        <motion.div
          className="arrow"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓
        </motion.div>

        <motion.div
          className="workflow-card ai-card"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Brain size={50} />
          <h3>AI Processing</h3>
          <p>Understanding your notes...</p>
        </motion.div>

        <motion.div
          className="arrow"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓
        </motion.div>

        <div className="results-grid">

          <motion.div
            className="result-card"
            whileHover={{ y: -10 }}
          >
            <Sparkles size={28}   color=" #f97316" />
            <h4>Summary</h4>
          </motion.div>

          <motion.div
            className="result-card"
            whileHover={{ y: -10 }}
          >
            <BookOpen size={28}  color=" #f97316"  />
            <h4>Flashcards</h4>
          </motion.div>

          <motion.div
            className="result-card"
            whileHover={{ y: -10 }}
          >
            <ClipboardList size={28}   color=" #f97316" />
            <h4>Quiz</h4>
          </motion.div>

        </div>

      </div>


      

    </section>

    <Demo/>

     </section>
  );
}

export default ProductDemo;