import styles from "./NavigationTabs.module.css";

// Definindo os caminhos ou identificadores das páginas
type TabType = "insights" | "obras" | "eventos";

interface NavigationTabsProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function NavigationTabs({ currentTab, onChangeTab }: NavigationTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "insights", label: "insights" },
    { id: "obras", label: "Obras" },
    { id: "eventos", label: "Eventos" },
  ];

  // Encontra o índice atual para calcular o deslocamento da pílula preta
  const activeIndex = tabs.findIndex((tab) => tab.id === currentTab);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Pílula preta que desliza animada */}
        <div
          className={styles.slidingIndicator}
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {/* Botões das abas */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabButton} ${
              currentTab === tab.id ? styles.activeText : ""
            }`}
            onClick={() => onChangeTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}