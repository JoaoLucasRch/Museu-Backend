import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Filter, Plus } from "lucide-react";
import styles from "./EventToolbar.module.css";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onCreate: () => void;
}

const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ativos", value: "ATIVO" },
  { label: "Rascunhos", value: "RASCUNHO" },
  { label: "Encerrados", value: "ENCERRADO" },
];

export default function EventToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreate,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu suspenso ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Descobre a label a ser exibida no botão principal
  const currentLabel =
    STATUS_OPTIONS.find((opt) => opt.value === status)?.label || "Todos os Status";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.subtitle}>
            Cadastre, acompanhe e gerencie a programação do museu.
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        {/* BUSCA */}
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar eventos e editais..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* BOTÃO CRIAR EVENTO */}
        <button className={styles.createButton} onClick={onCreate}>
          <Plus size={18} />
          <span>Novo Evento</span>
        </button>

        {/* DROPDOWN CUSTOMIZADO (ESTÉTICA BRANCA) */}
        <div className={styles.selectWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={`${styles.selectButton} ${isOpen ? styles.active : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={styles.selectLabel}>
              <Filter size={16} className={styles.filterIcon} />
              <span>{currentLabel}</span>
            </div>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`}
            />
          </button>

          {isOpen && (
            <ul className={styles.dropdownMenu}>
              {STATUS_OPTIONS.map((option) => (
                <li
                  key={option.value}
                  className={`${styles.dropdownOption} ${
                    status === option.value ? styles.selectedOption : ""
                  }`}
                  onClick={() => {
                    onStatusChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}