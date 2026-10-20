import { useState } from "react";
import { BookOpen, House, Menu, Sparkle, X } from "lucide-react";
import "./Navbar.css";
import {Link} from 'react-router-dom'
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">

      <div className="logo">
        <span>🧠</span>
        <h2>Cramify</h2>
      </div>

      {/* Desktop Links */}
      <nav className="nav-links">
        <a href="/">Overview</a>
          
        <a href="/feature">Features</a>
        <a href="/flow">Study Flow</a>
      </nav>

      <button className="login-btn">
       <Link to='/log'>  Login → </Link> 
      </button>

      {/* Mobile Menu Button */}
      <button
        className="menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <a href="/"> <House size={18} color=" #f97316" /> <span>Overview </span> </a>
        <a href="/feature">  <Sparkle size={18} color=" #f97316" /> <span>Features </span> </a>
        <a href="/flow">  <BookOpen size={18} color=" #f97316" />  <span>Study Flow</span></a>



        <button className="mobile-login">
          <Link to='/log'>  Login → </Link> 
        </button>
      </div>

    </header>
  );
}

export default Navbar;