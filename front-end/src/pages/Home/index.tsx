import {
  Navbar,
  Cover,
  OurStory,
  Rooms,
  Expose,
  Events,
  Footer,
} from "@/components/home";

import styles from "./Home.module.css";

function Home() {
  return (
    <main className={styles.homeContainer}>
      <Navbar />

      <div className={styles.fixedCover}>
        <section id="inicio">
          <Cover />
        </section>
      </div>

      <div className={styles.scrollingContent}>
        <section id="historia">
          <OurStory />
        </section>

        <section id="salas">
          <Rooms />
        </section>

        <section id="eventos">
          <Events />
        </section>

        <section id="exposicoes">
          <Expose />
        </section>

        <section id="contato">
          <Footer />
        </section>
      </div>
    </main>
  );
}

export default Home;
