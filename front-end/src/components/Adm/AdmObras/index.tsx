import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdmObras.module.css";
import { Search } from "lucide-react";
import AdmObraModal from "../AdmObraModal";

// Tipos
export interface Obra {
  id_obra: number;
  titulo_obra: string;
  descricao_obra: string;
  imagens_obras: string;
  categoria_obra: string;
  data_exposicao: string;
  data_fim_exposicao: string;
  status: "pendente" | "aprovada" | "rejeitada";
  artista_id: number;
  artista?: {
    id: number;
    nome: string;
    email: string;
  };
}

export default function AdmObras() {
  const navigate = useNavigate();
  
  const [obras, setObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  
  // Estados do Modal
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3333/obra/admin", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setObras(data);
      } else {
        throw new Error("Erro ao carregar obras");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar obras:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar status da obra
  const handleStatusUpdate = async (id_obra: number, status: "aprovada" | "rejeitada") => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      console.log(`Atualizando obra ${id_obra} para status: ${status}`);

      const response = await fetch(`http://localhost:3333/obra/admin/${id_obra}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      console.log("Status da resposta:", response.status);

      // Verificar se a resposta não é ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Erro na resposta:", errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("Sem permissão. Verifique se você está logado como ADMIN.");
        }
        
        throw new Error(errorData?.message || `Erro HTTP: ${response.status}`);
      }

      // Tentar ler a resposta JSON
      const data = await response.json().catch(() => ({}));
      console.log("Resposta da API:", data);

      // Atualizar a lista de obras
      await fetchObras();
      
      console.log("Status atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      throw err;
    }
  };

  // Abrir modal com obra selecionada
  const handleCardClick = (obra: Obra) => {
    setSelectedObra(obra);
    setIsModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedObra(null);
  };

  // Formatar texto para exibição
  const formatText = (text: string, maxLength: number = 60) => {
    if (!text) return "";
    return text.length > maxLength 
      ? text.substring(0, maxLength) + "..." 
      : text;
  };

  // Filtrar obras baseado na busca e filtro de status
  const filteredObras = obras.filter(obra => {
    const matchesSearch = 
      obra.titulo_obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.descricao_obra.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "todos" || 
      obra.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "#da9f408d";
      case "aprovada": return "#173c30f6";
      case "rejeitada": return "#5d1212cf";
      default: return "#6B7280";
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando obras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>Erro ao carregar obras</h3>
          <p>{error}</p>
          <button 
            onClick={fetchObras}
            className={styles.retryButton}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Título principal */}
      <div className={styles.header}>
        <h2 className={styles.title}>Obras</h2>
        <p className={styles.subtitle}>Gerencie as Obras de seus Artistas</p>
      </div>

      {/* Barra de busca com filtros */}
      <div className={styles.searchFilterSection}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar obras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        {/* Filtros de status */}
        <div className={styles.filtersContainer}>
          <button
            className={`${styles.filterButton} ${statusFilter === "todos" ? styles.filterButtonActive : ""}`}
            onClick={() => setStatusFilter("todos")}
          >
            Todos
          </button>
          <button
            className={`${styles.filterButton} ${statusFilter === "pendente" ? styles.filterButtonActive : ""}`}
            onClick={() => setStatusFilter("pendente")}
          >
            Pendentes
          </button>
          <button
            className={`${styles.filterButton} ${statusFilter === "rejeitada" ? styles.filterButtonActive : ""}`}
            onClick={() => setStatusFilter("rejeitada")}
          >
            Rejeitadas
          </button>
          <button
            className={`${styles.filterButton} ${statusFilter === "aprovada" ? styles.filterButtonActive : ""}`}
            onClick={() => setStatusFilter("aprovada")}
          >
            Aprovadas
          </button>
        </div>
      </div>

      {/* Grid de Cards Quadrados */}
      <div className={styles.cardsGrid}>
        {filteredObras.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {searchTerm || statusFilter !== "todos" 
                ? `Nenhuma obra encontrada${searchTerm ? ` para "${searchTerm}"` : ""}${statusFilter !== "todos" ? ` com status "${statusFilter}"` : ""}`
                : "Nenhuma obra cadastrada no sistema"}
            </p>
            {(searchTerm || statusFilter !== "todos") && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                }}
                className={styles.clearButton}
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          filteredObras.map(obra => (
            <div 
              key={obra.id_obra} 
              className={styles.squareCard}
              style={{ borderTopColor: getStatusColor(obra.status) }}
              onClick={() => handleCardClick(obra)}
            >
              {/* Status no canto superior direito */}
              <div className={styles.cardStatus} style={{ backgroundColor: getStatusColor(obra.status) }}>
                {obra.status.toUpperCase()}
              </div>
              
              {/* Nome da obra */}
              <h3 className={styles.cardTitle}>
                {obra.titulo_obra}
              </h3>
              
              {/* Descrição no canto inferior */}
              <div className={styles.cardFooter}>
                <p className={styles.cardDescription}>
                  {formatText(obra.descricao_obra)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Se não houver obras no sistema */}
      {obras.length === 0 && !isLoading && !error && (
        <div className={styles.emptyDashboard}>
          <h3>Nenhuma obra cadastrada</h3>
          <p>Ainda não há obras para gerenciar no sistema.</p>
          <button 
            onClick={fetchObras}
            className={styles.retryButton}
          >
            Atualizar
          </button>
        </div>
      )}

      {/* Modal de Visualização e Avaliação */}
      <AdmObraModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        obra={selectedObra}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}