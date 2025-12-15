import "./style.css";

import Museu2020 from '../../../assets/Museu/museu2020.png';
import Museu2022 from '../../../assets/Museu/museu2022.png';
import Museu2025 from '../../../assets/Museu/museu2025.png';


// Exemplo de dados (substitua pelas suas imagens importadas)
// import img2010 from '../../assets/img2010.jpg';
const historyData = [
  {
    year: "2020",
    text: "Em 2020 é inaugurado o museu municipal francisco coelho ocupando o espaço do antigo palacete Augusto Dias.",
    image: Museu2020
  },
  {
    year: "2022",
    text: "1º Giro Cultural no Museu de Marabá,  em abril de 2022 para celebrar a cultura popular e a história local.",
    image: Museu2022
  },
  {
    year: "2025",
    text: "Atualmente o museu se encontra com uma bela decoração de guarda-chuvas cor-de-rosa, em homenagem ao outubro rosa.",
    image: Museu2025
  }
];

function OurStory() {
  return (
    <div className="story-container">
      {/* Lado Esquerdo: Textos */}
      <div className="text-section">
        <h1>Nossa História</h1>
        <p>Conheça os momentos que marcaram a história do Museu e sua importância para a cultura e a memória de Marabá.</p>
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