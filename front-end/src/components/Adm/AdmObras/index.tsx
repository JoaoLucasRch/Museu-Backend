import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdmObras.module.css";
import { Search, ChevronDown } from "lucide-react"; // Adicionado ChevronDown
import AdmObraModal from "../AdmObraModal";

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
  const [statusFilter, setStatusFilter] = useState<string>("pendente"); // Iniciando como Pendente padrão da imagem
  
  // NOVO: Estados para o Dropdown de Status estilizado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchObras();

    // Fecha o dropdown se clicar fora dele
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        console.log("Obras recebidas:", data);
        
        // Buscar informações dos artistas para cada obra
        const obrasComArtistas = await Promise.all(
          data.map(async (obra: Obra) => {
            // Se já tiver artista, retorna
            if (obra.artista) {
              return obra;
            }
            
            // Se tiver artista_id, tenta buscar
            if (obra.artista_id) {
              try {
                const artistaResponse = await fetch(`http://localhost:3333/user/${obra.artista_id}`, {
                  method: "GET",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                });
                
                if (artistaResponse.ok) {
                  const artistaData = await artistaResponse.json();
                  return {
                    ...obra,
                    artista: {
                      id: artistaData.id,
                      nome: artistaData.nome,
                      email: artistaData.email || "",
                    }
                  };
                } else {
                  console.error(`Erro ao buscar artista ${obra.artista_id}: Status ${artistaResponse.status}`);
                }
              } catch (error) {
                console.error(`Erro ao buscar artista ${obra.artista_id}:`, error);
              }
            }
            
            // Fallback: mostra o ID do artista
            return {
              ...obra,
              artista: {
                id: obra.artista_id,
                nome: `Artista #${obra.artista_id}`,
                email: "",
              }
            };
          })
        );
        
        setObras(obrasComArtistas);
        console.log("Obras processadas com artistas:", obrasComArtistas);
      } else {
        throw new Error("Erro ao carregar obras");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id_obra: number, status: "aprovada" | "rejeitada") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado.");

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
    } catch (err) {
      console.error(err);
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
    
    const matchesStatus = statusFilter === "todos" || obra.status === statusFilter;
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
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando obras...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Cabeçalho com Tabs */}
      <div className={styles.header}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "obras" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("obras")}
          >
            Obras
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "eventos" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("eventos")}
          >
            Eventos
          </button>
        </div>
        
        <p className={styles.subtitle}>
          {activeTab === "obras" 
            ? "Gerencie as Obras de seus Artistas" 
            : "Gerencie os Eventos do Museu"}
        </p>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === "obras" ? (
        <>
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

      {/* Tabela de Obras */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>OBRA</th>
              <th>EVENTO</th>
              <th>ENVIADO</th>
              <th className={styles.thRight}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredObras.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyRow}>
                  Nenhuma obra encontrada para os filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredObras.map((obra) => (
                <tr 
                  key={obra.id_obra} 
                  className={styles.row}
                  onClick={() => handleRowClick(obra)}
                >
                  <td className={styles.obraCell}>
                    <span className={styles.obraTitle}>{obra.titulo_obra}</span>
                    <div className={styles.obraMeta}>
                      <span>{obra.categoria_obra}</span>
                      <span className={styles.bullet}>•</span>
                      <span>autor: {obra.artista?.nome || "Desconhecido"}</span>
                    </div>
                  </td>
                  <td className={styles.centerCell}>
                    <span className={styles.eventText}>Exponha</span>
                  </td>
                  <td className={styles.centerCell}>
                    <span className={styles.dateText}>{formatDate(obra.data_fim_exposicao)}</span>
                  </td>
                  <td className={styles.statusCell}>
                    <span className={`${styles.statusBadge} ${styles[obra.status]}`}>
                      {obra.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdmObraModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedObra(null); }}
        obra={selectedObra}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}