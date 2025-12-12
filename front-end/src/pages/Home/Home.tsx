import Navbar from "../../components/home/Menu/Navbar";
import Cover from "../../components/home/Cover/index";
import OurStory from "../../components/home/ourStory/index";
import Rooms from "../../components/home/Rooms";
import Expose from "../../components/home/Expose";
import Eventos from "../../components/home/Eventos";
import Footer from "../../components/home/footer";

import "./style.css";

function Home() {
  return (
    <main className="home-container">
      <Navbar />
      <div className="fixed-cover">
        <section id="inicio"><Cover /></section>
      </div>
      <div className="scrolling-content">
      <section id="historia"><OurStory /> </section>
      <section id="salas"><Rooms /></section>
      <section id="eventos"><Eventos /></section> 
      <section id="exposicoes"><Expose /></section>  
      <section id="contato"><Footer /></section>
        
      </div>
    </main>
  );
}

export default Home;
