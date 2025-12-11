import Navbar from "../../components/Menu/Navbar";
import Cover from "../../components/Cover/index";
import OurStory from "../../components/ourStory/index";
import Rooms from "../../components/Rooms";
import Expose from "../../components/Expose";
import Eventos from "../../components/Eventos";
import Footer from "../../components/footer";

import "./style.css";

function Home() {
  return (
    <main className="home-container">
      <Navbar />
      <div className="fixed-cover">
        <section id="capa"><Cover /></section>
      </div>
      <div className="scrolling-content">
        <OurStory />
        <Rooms />
        <Expose />
        <Eventos />
        <section id="contato"><Footer /></section>
        
      </div>
    </main>
  );
}

export default Home;
