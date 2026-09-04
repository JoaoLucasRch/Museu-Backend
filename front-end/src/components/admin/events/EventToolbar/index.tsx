import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Search,
  Plus,
  Filter,
  ChevronDown,
} from "lucide-react";

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

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const currentLabel =
    STATUS_OPTIONS.find(
      (option) => option.value === status
    )?.label ?? "Todos";

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} aria-hidden="true" />

          <input
            type="text"
            placeholder="Buscar eventos..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
          />
        </div>

        <div
          className={styles.selectWrapper}
          ref={dropdownRef}
        >
          <button
            type="button"
            className={`${styles.selectButton} ${
              isOpen ? styles.active : ""
            }`}
            onClick={() =>
              setIsOpen((prev) => !prev)
            }
            aria-expanded={isOpen}
          >
            <span className={styles.selectLabel}>
              <Filter
                size={16}
                aria-hidden="true"
              />

              <span>{currentLabel}</span>
            </span>

            <ChevronDown
              size={16}
              className={
                isOpen ? styles.rotate : ""
              }
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <ul className={styles.dropdownMenu}>
              {STATUS_OPTIONS.map((option) => (
                <li
                  key={option.value}
                  className={`${styles.dropdownOption} ${
                    status === option.value
                      ? styles.selectedOption
                      : ""
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

        <button
          type="button"
          className={styles.createButton}
          onClick={onCreate}
        >
          <Plus size={18} aria-hidden="true" />
          <span>Novo evento</span>
        </button>
      </div>
    </div>
  );
}