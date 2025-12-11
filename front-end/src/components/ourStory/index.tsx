import React from 'react';
import "./style.css";

// Exemplo de dados (substitua pelas suas imagens importadas)
// import img2010 from '../../assets/img2010.jpg';
const historyData = [
  {
    year: "2010",
    text: "Surgiu em 2010 ocupando o espaço do antigo palacete Augusto Dias",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop" // Exemplo
  },
  {
    year: "2015",
    text: "Expansão para novas galerias e acervo internacional",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600&auto=format&fit=crop" // Exemplo
  },
  {
    year: "2025",
    text: "Futuro projeto de digitalização e museu virtual",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600&auto=format&fit=crop" // Exemplo
  }
];

function OurStory() {
  return (
    <div className="story-container">
      {/* Lado Esquerdo: Textos */}
      <div className="text-section">
        <h2>Nossa História</h2>
        <p>Acompanhe um pouco da história do museu</p>
      </div>

      {/* Lado Direito: Cards Expansíveis */}
      <div className="cards-section">
        {historyData.map((item, index) => (
          <div 
            key={index} 
            className="card"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="card-content">
              {/* O texto aparece quando expandido */}
              <p className="card-description">{item.text}</p>
              <h3 className="card-year">{item.year}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurStory;