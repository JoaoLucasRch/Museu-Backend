import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Upload, Edit2, Trash2 } from "lucide-react";
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    titulo_evento: "",
    descricao_evento: "",
    local_evento: "",
    data_hora_inicio: "",
    data_hora_fim: "",
    tipo_evento: "" as Evento["tipo_evento"],
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
          criado_por: selectedEvento.criado_por, // Preserva o criador
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

  const startEdit = () => setIsEditMode(true);

  const cancelEdit = () => {
    if (selectedEvento) {
      setFormData({
        titulo_evento: selectedEvento.titulo_evento,
        descricao_evento: selectedEvento.descricao_evento,
        local_evento: selectedEvento.local_evento,
        data_hora_inicio: selectedEvento.data_hora_inicio.slice(0, 16),
        data_hora_fim: selectedEvento.data_hora_fim.slice(0, 16),
        tipo_evento: selectedEvento.tipo_evento,
        imagemPreview: selectedEvento.imagem_evento,
      });
      setSelectedFile(null);
    }
    setIsEditMode(false);
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

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando eventos...</p>
        </div>
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
        <div className={styles.cardsGrid}>
          <div className={styles.addCard} onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={48} className={styles.plusIcon} />
          </div>

          {eventos.map((evento) => (
            <div key={evento.id_evento} className={styles.eventoCard} onClick={() => openViewModal(evento)}>
              <div className={styles.cardImage}>
                {evento.imagem_evento ? (
                  <img
                    src={evento.imagem_evento}
                    alt={evento.titulo_evento}
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300?text=Sem+Imagem")}
                  />
                ) : (
                  <div className={styles.noImage}><span>Sem Imagem</span></div>
                )}
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{evento.titulo_evento}</h3>
                <p className={styles.cardType}>{evento.tipo_evento.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>

        {eventos.length === 0 && (
          <div className={styles.emptyState}>
            <h3>Nenhum evento cadastrado</h3>
            <p>Clique no card "+" para adicionar um novo evento.</p>
          </div>
        )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO / EDIÇÃO */}
      {selectedEvento && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modalWide} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{isEditMode ? "Editar Evento" : selectedEvento.titulo_evento}</h2>
              <button onClick={closeAllModals} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>

            {!isEditMode ? (
              <>
                <div className={styles.viewBody}>
                  <img
                    src={selectedEvento.imagem_evento || "https://placehold.co/800x400?text=Sem+Imagem"}
                    alt={selectedEvento.titulo_evento}
                    className={styles.viewImage}
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/800x400?text=Sem+Imagem")}
                  />
                  <div className={styles.viewInfo}>
                    <p><strong>Descrição:</strong> {selectedEvento.descricao_evento}</p>
                    <p><strong>Local:</strong> {selectedEvento.local_evento}</p>
                    <p><strong>Início:</strong> {formatDate(selectedEvento.data_hora_inicio)}</p>
                    <p><strong>Fim:</strong> {formatDate(selectedEvento.data_hora_fim)}</p>
                    <p><strong>Tipo:</strong> <span className={styles.typeBadge}>{selectedEvento.tipo_evento}</span></p>
                    <p>
                      <strong>Criado por:</strong>{" "}
                      {selectedEvento.criado_por?.nome || "Administrador"}
                    </p>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button onClick={handleDelete} className={styles.deleteBtn}>
                    <Trash2 size={18} /> Excluir Evento
                  </button>
                  <button onClick={startEdit} className={styles.editBtn}>
                    <Edit2 size={18} /> Editar Evento
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label>Nome do Evento</label>
                    <input
                      type="text"
                      value={formData.titulo_evento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, titulo_evento: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Descrição</label>
                    <textarea
                      rows={4}
                      value={formData.descricao_evento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, descricao_evento: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Local do Evento</label>
                    <input
                      type="text"
                      value={formData.local_evento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, local_evento: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Data e Hora Início</label>
                      <input
                        type="datetime-local"
                        value={formData.data_hora_inicio}
                        onChange={(e) => setFormData((prev) => ({ ...prev, data_hora_inicio: e.target.value }))}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Data e Hora Fim</label>
                      <input
                        type="datetime-local"
                        value={formData.data_hora_fim}
                        onChange={(e) => setFormData((prev) => ({ ...prev, data_hora_fim: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Categoria</label>
                    <select
                      value={formData.tipo_evento}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tipo_evento: e.target.value as any }))}
                    >
                      <option value="EXPOSICAO">Exposição</option>
                      <option value="OFICINA">Oficina</option>
                      <option value="PALESTRA">Palestra</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Imagem do Evento (deixe em branco para manter a atual)</label>
                    <label className={styles.uploadArea}>
                      <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                      {formData.imagemPreview ? (
                        <div className={styles.previewContainer}>
                          <img src={formData.imagemPreview} alt="Preview" className={styles.previewImage} />
                          <p className={styles.fileName}>{selectedFile?.name || "Imagem atual"}</p>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <Upload size={32} />
                          <span>Clique para alterar imagem</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button onClick={cancelEdit} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={isSubmitting || uploadProgress}
                    className={styles.submitBtn}
                  >
                    {isSubmitting || uploadProgress ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}