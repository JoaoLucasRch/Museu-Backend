import "./style.css";

import coverImg from '../../../assets/Cover.png';

function Cover() {
  return (
    <>
      {/* Nota: Se estiver usando Next.js, as meta tags e title 
         devem ir no objeto 'metadata' ou no componente <Head>.
      */}

      <header>
        <div className="cover">
          {/* Lembre-se de colocar o caminho da imagem no src */}
          <img src={coverImg} alt="Capa imagem tal aqui" />
        </div>

        <div className="titles">
          <h5>Museu Municipal de Marabá</h5>
          <h1>FRANCISCO COELHO</h1>
          <h5>Viva a Cultura de Marabá</h5>
          <p>
            Explore a rica história e cultura amazônica através de exposições
            interativas, arte regional e patrimônio cultural que conecta passado
            e futuro.
          </p>
        </div>
      </header>
    </>
  );
}

export default Cover;
