import React, { useState } from 'react';
import SlideButton from '../SlideButton';
import './style.css';
import Pintura from '../../../assets/Salas/pintura.jpg';
import Marco from '../../../assets/Salas/Marco.jpg';
import Etnologia from '../../../assets/Salas/etnologia.jpg';
import Arqueologo from '../../../assets/Salas/arqueologo.jpg';
// 1. Dados das Salas (pode adicionar quantas quiser)
const roomsData = [
  {
    id: 1,
    title: "Pinturas",
    description: "Uma sala que celebra artistas regionais, convidando o visitante a viajar por telas e técnicas que fizeram de Marabá uma referência nacional na arte em bico de pena (nanquim).",
    image: Pintura
  },
  {
    id: 2,
    title: "Marcos Regionais",
    description: "Essa sala apresenta os principais acontecimentos que marcaram a cidade, incluindo a primeira grande enchente de 1926.",
    image: Marco
  },
  {
    id: 3,
    title: "Etnologia Indígena",
    description: "Esta seção exibe artefatos indígenas de etnias do Pará, especialmente das regiões próximas a Marabá.",
    image: Etnologia
  },
    
  {
    id: 4,
    title: "Geologia",
    description: "Esta sala apresenta minerais e pedras preciosas de Marabá e a evolução da geologia na região. Ela também destaca a descoberta da mina de Carajás em 1967 pelo arqueólogo Breno Augusto dos Santos.",
    image: Arqueologo
  }
];

export default function Rooms() {
  // 2. Estado para controlar qual sala está aparecendo (começa na 0)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para ir para o PRÓXIMO slide
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      // Se for o último, volta para o primeiro (loop infinito)
      return prevIndex === roomsData.length - 1 ? 0 : prevIndex + 1;
    });
  };

  // Função para ir para o slide ANTERIOR
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      // Se for o primeiro, vai para o último
      return prevIndex === 0 ? roomsData.length - 1 : prevIndex - 1;
    });
  };

  // Pega os dados da sala atual baseada no índice
  const currentRoom = roomsData[currentIndex];

  return (
    <section className="rooms-container" id="salas">
      <div className="text-header">
        <h2>Salas em Destaque</h2>
        <p>Acompanhe algumas das salas presentes no museu</p>
      </div>

      <div className="slider-wrapper">
        
        {/* Botão Esquerda */}
        <div className="nav-left">
           <SlideButton direction="left" onClick={handlePrev} />
        </div>

        {/* O Conteúdo que muda dinamicamente */}
        <div className="slide-content">
           {/* Imagem dinâmica */}
           <img 
             src={currentRoom.image} 
             alt={currentRoom.title} 
             // Key ajuda o React a fazer uma animação sutil se tiver CSS de fade
             key={currentRoom.image} 
           />
           
           <div className="slide-info">
             {/* Texto dinâmico */}
             <h2>{currentRoom.title}</h2>
             <p>{currentRoom.description}</p>
           </div>
        </div>

        {/* Botão Direita */}
        <div className="nav-right">
           <SlideButton direction="right" onClick={handleNext} />
        </div>

      </div>
    </section>
  );
}