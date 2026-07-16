import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Upload, Edit2, Trash2, Search } from "lucide-react";
import styles from "./styles.module.css";

export interface Evento {
  id_evento: number;
  titulo_evento: string;
  descricao_evento: string;
  local_evento: string;
  imagem_evento: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  tipo_evento: "EXPOSICAO" | "OFICINA" | "PALESTRA";
  criado_por: {
    id: number;
    nome: string;
    email: string;
  };
}

export default function AdmEventos() {
  const navigate = useNavigate();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Filtro e Busca
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  // Estados dos Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    titulo_evento: "",
    descricao_evento: "",
    local_evento: "",
    data_hora_inicio: "",
    data_hora_fim: "",
    tipo_evento: "" as any,
    imagemPreview: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    alert("Sessão expirada. Por favor, faça login novamente.");
    navigate("/login");
  };

  const fetchEventos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch("http://localhost:3333/eventos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setEventos(data);
      } else {
        throw new Error("Falha ao carregar eventos");
      }
    } catch (err) {
      setError("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagemPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImagem = async (currentImage: string): Promise<string> => {
    if (!selectedFile) return currentImage;

    setUploadProgress(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-upload-type": "eventos",
        },
        body: formDataUpload,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return currentImage;
      }

      if (!response.ok) throw new Error("Falha no upload");

      const result = await response.json();
      return result.imagem_evento;
    } catch (err) {
      alert("Erro ao fazer upload da imagem. A imagem atual será mantida.");
      return currentImage;
    } finally {
      setUploadProgress(false);
    }
  };

  const handleCreateSubmit = async () => {
    if (
      !formData.titulo_evento.trim() ||
      !formData.descricao_evento.trim() ||
      !formData.local_evento.trim() ||
      !formData.data_hora_inicio ||
      !formData.data_hora_fim ||
      !formData.tipo_evento
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token!.split(".")[1]));
      const criado_por_id = payload.id;

      const imagemUrl = await uploadImagem("https://placehold.co/800x600?text=Sem+Imagem");

      const body = {
        titulo_evento: formData.titulo_evento.trim(),
        descricao_evento: formData.descricao_evento.trim(),
        local_evento: formData.local_evento.trim(),
        imagem_evento: imagemUrl,
        data_hora_inicio: new Date(formData.data_hora_inicio).toISOString(),
        data_hora_fim: new Date(formData.data_hora_fim).toISOString(),
        tipo_evento: formData.tipo_evento,
        criado_por_id,
      };

      const response = await fetch("http://localhost:3333/eventos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        const novoEvento = await response.json();
        setEventos((prev) => [novoEvento, ...prev]);
        closeAllModals();
        alert("Evento criado com sucesso!");
      } else {
        alert("Erro ao criar evento.");
      }
    } catch (err) {
      alert("Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedEvento) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const imagemUrl = await uploadImagem(selectedEvento.imagem_evento);

      const body: Partial<Evento> = {
        titulo_evento: formData.titulo_evento.trim(),
        descricao_evento: formData.descricao_evento.trim(),
        local_evento: formData.local_evento.trim(),
        data_hora_inicio: new Date(formData.data_hora_inicio).toISOString(),
        data_hora_fim: new Date(formData.data_hora_fim).toISOString(),
        tipo_evento: formData.tipo_evento,
      };

      if (selectedFile) {
        body.imagem_evento = imagemUrl;
      }

      const response = await fetch(`http://localhost:3333/eventos/${selectedEvento.id_evento}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        const updated = await response.json();

        // CORREÇÃO: Mantemos o criado_por do evento original
        const eventoAtualizadoCompleto: Evento = {
          ...updated,
          criado_por: selectedEvento.criado_por,
        };

        setEventos((prev) =>
          prev.map((e) => (e.id_evento === updated.id_evento ? eventoAtualizadoCompleto : e))
        );
        setSelectedEvento(eventoAtualizadoCompleto);
        setIsEditMode(false);
        setSelectedFile(null);
        alert("Evento atualizado com sucesso!");
      } else {
        alert("Erro ao atualizar evento.");
      }
    } catch (err) {
      console.error("Erro ao editar evento:", err);
      alert("Erro inesperado ao atualizar o evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvento || !confirm(`Excluir permanentemente "${selectedEvento.titulo_evento}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/eventos/${selectedEvento.id_evento}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        setEventos((prev) => prev.filter((e) => e.id_evento !== selectedEvento.id_evento));
        closeAllModals();
        alert("Evento excluído com sucesso!");
      } else {
        alert("Erro ao excluir evento.");
      }
    } catch (err) {
      alert("Erro inesperado ao excluir.");
    }
  };

  const openViewModal = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsEditMode(false);
    setFormData({
      titulo_evento: evento.titulo_evento,
      descricao_evento: evento.descricao_evento,
      local_evento: evento.local_evento,
      data_hora_inicio: evento.data_hora_inicio.slice(0, 16),
      data_hora_fim: evento.data_hora_fim.slice(0, 16),
      tipo_evento: evento.tipo_evento,
      imagemPreview: evento.imagem_evento,
    });
    setSelectedFile(null);
  };

  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setSelectedEvento(null);
    setIsEditMode(false);
    setFormData({
      titulo_evento: "",
      descricao_evento: "",
      local_evento: "",
      data_hora_inicio: "",
      data_hora_fim: "",
      tipo_evento: "" as any,
      imagemPreview: "",
    });
    setSelectedFile(null);
  };

  const resetCreateForm = () => {
    setFormData({
      titulo_evento: "",
      descricao_evento: "",
      local_evento: "",
      data_hora_inicio: "",
      data_hora_fim: "",
      tipo_evento: "" as any,
      imagemPreview: "",
    });
    setSelectedFile(null);
  };

  const formatDateDisplay = (iso: string) => {
    if (!iso) return "Não informada";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(".", "");
  };

  // Filtragem combinada por busca textual + histórico vencido
  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch = evento.titulo_evento.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const isPastEvent = new Date(evento.data_hora_fim) < now;
    return matchesSearch && (showHistoryOnly ? isPastEvent : !isPastEvent);
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>Erro</h3>
          <p>{error}</p>
          <button onClick={fetchEventos} className={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {/* Painel Superior: Busca, Histórico e Botão Novo Evento Oval */}
        <div className={styles.topControlSection}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por título ou evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actionButtonsGroup}>
            <button
              type="button"
              className={`${styles.historyButton} ${showHistoryOnly ? styles.historyActive : ""}`}
              onClick={() => setShowHistoryOnly(!showHistoryOnly)}
            >
              Histórico
            </button>
            <button
              type="button"
              className={styles.newEventButton}
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Novo Evento
            </button>
          </div>
        </div>

        {/* Tabela de Eventos */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft}>EVENTO</th>
                <th>CATEGORIA</th>
                <th>CRIADO EM</th>
                <th className={styles.thRight}>DATA</th>
              </tr>
            </thead>
            <tbody>
              {filteredEventos.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyRow}>
                    Nenhum evento encontrado {showHistoryOnly ? "no histórico" : "ativo"}.
                  </td>
                </tr>
              ) : (
                filteredEventos.map((evento) => (
                  <tr key={evento.id_evento} className={styles.row} onClick={() => openViewModal(evento)}>
                    <td className={styles.eventoCell}>
                      <div className={styles.eventoContentWrapper}>
                        {/* Quadrado da Imagem ao lado do texto */}
                        <div className={styles.tableImageContainer}>
                          {evento.imagem_evento ? (
                            <img
                              src={evento.imagem_evento}
                              alt={evento.titulo_evento}
                              className={styles.tableImage}
                              onError={(e) => (e.currentTarget.src = "https://placehold.co/150?text=Sem+Imagem")}
                            />
                          ) : (
                            <div className={styles.tableNoImage} />
                          )}
                        </div>

                        {/* Textos da Coluna */}
                        <div className={styles.eventoTextGroup}>
                          <span className={styles.eventoTitle}>{evento.titulo_evento}</span>
                          <span className={styles.eventoAuthor}>
                            criado por: {evento.criado_por?.nome || "Administrador"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.centerCell}>
                      <span className={styles.categoryText}>Exponha</span>
                    </td>
                    <td className={styles.centerCell}>
                      <span className={styles.dateText}>{formatDateDisplay(evento.data_hora_inicio)}</span>
                    </td>
                    <td className={styles.dateRightCell}>
                      <div className={styles.dateWithIcon}>
                        <span className={styles.dateText}>{formatDateDisplay(evento.data_hora_fim)}</span>
                        <svg className={styles.inlineEditIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO DE EVENTO */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
          <div className={styles.modalWide} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Criar Novo Evento</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Nome do Evento *</label>
                <input
                  type="text"
                  placeholder="Digite o nome do evento"
                  value={formData.titulo_evento}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titulo_evento: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descrição *</label>
                <textarea
                  rows={4}
                  placeholder="Descreva o evento"
                  value={formData.descricao_evento}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descricao_evento: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Local do Evento *</label>
                <input
                  type="text"
                  placeholder="Onde será o evento?"
                  value={formData.local_evento}
                  onChange={(e) => setFormData((prev) => ({ ...prev, local_evento: e.target.value }))}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Data e Hora Início *</label>
                  <input
                    type="datetime-local"
                    value={formData.data_hora_inicio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, data_hora_inicio: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Data e Hora Fim *</label>
                  <input
                    type="datetime-local"
                    value={formData.data_hora_fim}
                    onChange={(e) => setFormData((prev) => ({ ...prev, data_hora_fim: e.target.value }))}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Categoria *</label>
                <select
                  value={formData.tipo_evento}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tipo_evento: e.target.value as any }))}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="EXPOSICAO">Exposição</option>
                  <option value="OFICINA">Oficina</option>
                  <option value="PALESTRA">Palestra</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Imagem do Evento</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                  {formData.imagemPreview ? (
                    <div className={styles.previewContainer}>
                      <img src={formData.imagemPreview} alt="Preview" className={styles.previewImage} />
                      <p className={styles.fileName}>{selectedFile?.name || "Imagem selecionada"}</p>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <Upload size={32} />
                      <span>Clique para fazer upload da imagem</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetCreateForm();
                }} 
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={isSubmitting || uploadProgress}
                className={styles.submitBtn}
              >
                {isSubmitting || uploadProgress ? "Criando..." : "Criar Evento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONDICIONAL UNIFICADA DOS MODAIS (Criação e Detalhes) */}
      {(isCreateModalOpen || selectedEvento) && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modalWide} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {isCreateModalOpen 
                  ? "Criar Novo Evento" 
                  : isEditMode ? "Editar Evento" : "Detalhes do Evento"}
              </h2>
              <button onClick={closeAllModals} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>

            {!isCreateModalOpen && !isEditMode && selectedEvento ? (
              <div className={styles.viewBody}>
                <div className={styles.viewInfo}>
                  <p><strong>Título:</strong> {selectedEvento.titulo_evento}</p>
                  <p><strong>Descrição:</strong> {selectedEvento.descricao_evento}</p>
                  <p><strong>Local:</strong> {selectedEvento.local_evento}</p>
                  <p><strong>Tipo:</strong> {selectedEvento.tipo_evento}</p>
                </div>
                <div className={styles.modalFooter}>
                  <button onClick={handleDelete} className={styles.deleteBtn}>
                    <Trash2 size={16} /> Excluir
                  </button>
                  <button onClick={() => setIsEditMode(true)} className={styles.editBtn}>
                    <Edit2 size={16} /> Editar
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Nome do Evento</label>
                  <input 
                    type="text" 
                    value={formData.titulo_evento} 
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo_evento: e.target.value }))} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Descrição</label>
                  <textarea 
                    rows={3} 
                    value={formData.descricao_evento} 
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao_evento: e.target.value }))} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Local do Evento</label>
                  <input 
                    type="text" 
                    value={formData.local_evento} 
                    onChange={(e) => setFormData(prev => ({ ...prev, local_evento: e.target.value }))} 
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Data Início</label>
                    <input 
                      type="datetime-local" 
                      value={formData.data_hora_inicio} 
                      onChange={(e) => setFormData(prev => ({ ...prev, data_hora_inicio: e.target.value }))} 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data Fim</label>
                    <input 
                      type="datetime-local" 
                      value={formData.data_hora_fim} 
                      onChange={(e) => setFormData(prev => ({ ...prev, data_hora_fim: e.target.value }))} 
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Categoria</label>
                  <select
                    value={formData.tipo_evento}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo_evento: e.target.value as any }))}
                  >
                    <option value="" disabled>Selecione uma categoria...</option>
                    <option value="EXPOSICAO">Exposição</option>
                    <option value="OFICINA">Oficina</option>
                    <option value="PALESTRA">Palestra</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Imagem do Evento</label>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                    {formData.imagemPreview ? (
                      <div className={styles.previewContainer}>
                        <img src={formData.imagemPreview} alt="Preview" className={styles.previewImage} />
                      </div>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <Upload size={32} />
                        <span>Clique para alterar imagem</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className={styles.modalFooter}>
                  <button type="button" onClick={closeAllModals} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit}
                    disabled={isSubmitting || uploadProgress}
                    className={styles.submitBtn}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}