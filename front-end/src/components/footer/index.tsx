import './style.css';

export default function Footer() {
  return (
    <footer className="footer-container" id="contato">
      
      {/* Parte Superior: 4 Colunas */}
      <div className="footer-content">
        
        {/* Coluna 1: Sobre */}
        <div className="footer-col">
          <h3 className="footer-title">Francisco Coelho</h3>
          <p className="footer-text">
            Anos de história dedicados à preservação e celebração da arte, 
            conectando pessoas através da cultura.
          </p>
          <p className="footer-highlight">Entrada Gratuita</p>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="footer-col">
          <h3 className="footer-title">Navegação</h3>
          <ul className="footer-links">
            <li><a href="#historia">História</a></li>
            <li><a href="#salas">Salas</a></li>
            <li><a href="#eventos">Exposições e Eventos</a></li>
            <li><a href="#exposicoes">Exponha sua Arte</a></li>
          </ul>
        </div>

        {/* Coluna 3: Contato */}
        <div className="footer-col">
          <h3 className="footer-title">Contato</h3>
          <div className="contact-item">
            {/* Ícone Localização */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Rua das Artes, 123<br/>Centro Histórico, SP<br/>01234-567</span>
          </div>
          <div className="contact-item">
             {/* Ícone Telefone */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             <span>(11) 3456-7890</span>
          </div>
          <div className="contact-item">
             {/* Ícone Email */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
             <span>contato@franco.art.br</span>
          </div>
        </div>

        {/* Coluna 4: Horário */}
        <div className="footer-col">
          <h3 className="footer-title">Horário de Visitação</h3>
          <div className="schedule-item">
            <strong>Terça a Sexta:</strong>
            <p>10h às 18h</p>
          </div>
          <div className="schedule-item">
            <strong>Sábados e Domingos:</strong>
            <p>10h às 20h</p>
          </div>
          <div className="schedule-item">
            <strong>Segundas:</strong>
            <p>Fechado</p>
          </div>
        </div>

      </div>

      {/* Parte Inferior: Copyright e Redes Sociais */}
      <div className="footer-bottom">
        <p>© 2025 Museu Francisco Coelho. Todos os direitos reservados.</p>
        
        <div className="social-icons">
          {/* Facebook */}
          <a href="#" aria-label="Facebook">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="#999" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          {/* Instagram */}
          <a href="#" aria-label="Instagram">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          {/* Email/Contato */}
          <a href="#" aria-label="Email">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="#999" stroke="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" fill="none"></polyline></svg>
          </a>
        </div>
      </div>

    </footer>
  );
}