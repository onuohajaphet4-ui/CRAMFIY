import Navbar from "../Component/Navbar";
import "./Home.css";
import Hero from '../Component/Hero'
import ProductDemo from '../Component/ProductDemo'
import Cta from '../Component/Cta'
import Foot from '../Component/Footer'
function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero/>
      <ProductDemo/>
      <Cta/>
      <Foot/>
    </div>
  );
}

export default Home;