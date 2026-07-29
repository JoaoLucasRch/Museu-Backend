import {
  useEffect,
  useState,
} from "react";

import styles from "./Cover.module.css";

import coverImg from "../../../assets/Cover.png";
import Museu2025 from "../../../assets/Museum/museu2025.png";
import Pintura from "../../../assets/Expose/pinturaManuel.jpg";


const slides = [
  {
    image: coverImg,
    subtitle: "Museu Municipal de Marabá",
    title: "FRANCISCO COELHO",
    description:
      "Um espaço dedicado à preservação da memória, da arte e da cultura amazônica."
  },
  {
    image: Museu2025,
    subtitle: "História e Patrimônio",
    title: "Conheça nossas histórias",
    description:
      "Descubra momentos que marcaram a trajetória cultural de Marabá."
  },
  {
    image: Pintura,
    subtitle: "Arte e Expressão",
    title: "Novas vozes, novas perspectivas",
    description:
      "Exposições que conectam artistas, comunidade e diferentes formas de expressão."
  }
];


export default function Cover() {

  const [activeSlide, setActiveSlide] = useState(0);


  useEffect(() => {

    const interval = setInterval(() => {

      setActiveSlide((prev) =>
        (prev + 1) % slides.length
      );

    }, 6000);


    return () =>
      clearInterval(interval);

  }, []);



  const slide = slides[activeSlide];


  return (

    <header className={styles.header}>


      <div
        className={styles.cover}
        key={activeSlide}
      >

        <img
          src={slide.image}
          alt={slide.title}
        />

        <div className={styles.overlay}/>

      </div>



      <div className={styles.titles}>


        <h5>
          {slide.subtitle}
        </h5>


        <h1>
          {slide.title}
        </h1>


        <p>
          {slide.description}
        </p>


        <div className={styles.indicators}>

          {slides.map((_, index) => (

            <span
              key={index}
              className={
                index === activeSlide
                  ? styles.active
                  : ""
              }
            />

          ))}

        </div>


      </div>


    </header>

  );
}