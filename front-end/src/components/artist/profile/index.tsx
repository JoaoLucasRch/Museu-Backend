// src/components/artist/profile/index.tsx

import { Pencil, LogOut, User, Calendar, Award, Clock } from "lucide-react";
import { useState, useEffect } from "react";

import styles from "./ProfileCard.module.css";

import type { UserProfile } from "@/types/User";
import { ArtworkService } from "@/services/artworks/artworkService";

interface UserProfileCardProps {
  user: UserProfile | null;
  isLoading?: boolean;
  onEdit: () => void;
  onLogout: () => void;
}

// 🔧 Função para calcular "Membro há" com mais precisão
function getMemberSince(createdAt?: string | null): string {
  if (!createdAt) {
    return "Dados não disponíveis";
  }

  try {
    const created = new Date(createdAt);

    if (isNaN(created.getTime())) {
      return "Dados não disponíveis";
    }

    const now = new Date();
    const diffInMs = now.getTime() - created.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    const diffInYears = Math.floor(diffInMonths / 12);
    const remainingMonths = diffInMonths % 12;

    const tempDate = new Date(created);
    tempDate.setMonth(tempDate.getMonth() + diffInMonths);
    const remainingDays = Math.floor((now.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
      }
      return `${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }

    if (diffInDays < 30) {
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }

    if (diffInYears > 0) {
      let result = `${diffInYears} ano${diffInYears > 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        result += ` e ${remainingMonths} mês${remainingMonths > 1 ? 'es' : ''}`;
      }
      if (remainingDays > 0 && remainingMonths === 0) {
        result += ` e ${remainingDays} dia${remainingDays > 1 ? 's' : ''}`;
      }
      return result;
    }

    if (diffInMonths > 0) {
      let result = `${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`;
      if (remainingDays > 0) {
        result += ` e ${remainingDays} dia${remainingDays > 1 ? 's' : ''}`;
      }
      return result;
    }

    return `${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  } catch (error) {
    console.error('Erro ao calcular tempo de membro:', error);
    return "Dados não disponíveis";
  }
}

// 🔧 Função para obter a data de criação do usuário
function getUserCreatedAt(user: UserProfile): string | null {
  return user.created_at ||
    (user as any).criado_em ||
    (user as any).createdAt ||
    (user as any).data_criacao ||
    null;
}

export default function UserProfileCard({
  user,
  isLoading,
  onEdit,
  onLogout,
}: UserProfileCardProps) {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadArtworks() {
      try {
        const data = await ArtworkService.getMyArtworks();
        setArtworks(data);
      } catch (error) {
        console.error('Erro ao carregar obras para estatísticas:', error);
      } finally {
        setLoadingStats(false);
      }
    }
    loadArtworks();
  }, []);

  if (isLoading || !user) {
    return (
      <div className={styles.loading}>
        Carregando perfil...
      </div>
    );
  }

  const userCreatedAt = getUserCreatedAt(user);
  const memberText = userCreatedAt ? getMemberSince(userCreatedAt) : "Dados não disponíveis";

  const obrasParticipacao = artworks.filter(
    artwork =>
      (artwork.status === 'aprovada' || artwork.status === 'exposta') &&
      artwork.edital_id !== null
  ).length;

  const obrasExpostas = artworks
    .filter(artwork =>
      (artwork.status === 'exposta' || artwork.status === 'aprovada') &&
      artwork.edital_id !== null
    )
    .sort((a, b) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime());

  const exposicaoRecente = obrasExpostas.length > 0
    ? obrasExpostas[0].titulo_obra
    : "Nenhuma exposição recente";

  return (
    <section className={styles.container}>

      {/* TOP BAR - Sair destacado */}
      <div className={styles.topBar}>
        <div className={styles.userGreeting}>
        </div>
        <button
          className={styles.logoutButton}
          onClick={onLogout}
          aria-label="Sair"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>

      {/* HEADER - Nome + Botão Editar */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <span className={styles.section}>MEU PERFIL</span>
            <div className={styles.nameWrapper}>
              <h1>{user.nome}</h1>
              <button
                className={styles.editIconButton}
                onClick={onEdit}
                aria-label="Editar perfil"
              >
                <Pencil size={16} />
              </button>
            </div>
            <p>Gerencie suas informações e acompanhe sua jornada artística</p>
          </div>
        </div>
      </header>

      {/* CARDS DE ESTATÍSTICAS - 3 colunas sempre */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Membro há</span>
            <strong className={styles.statValue}>{memberText}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Award size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Participação em Eventos</span>
            <strong className={styles.statValue}>{obrasParticipacao}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Exposição Recente</span>
            <strong className={styles.statValue}>{exposicaoRecente}</strong>
          </div>
        </div>
      </div>

    </section>
  );
}