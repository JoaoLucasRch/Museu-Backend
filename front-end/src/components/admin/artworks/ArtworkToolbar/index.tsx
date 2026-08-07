import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";

import styles from "./ArtworkToolbar.module.css";

type StatusFilter =
  | "todos"
  | "pendente"
  | "aprovada"
  | "rejeitada";

interface Props {
  searchTerm: string;

  statusFilter: StatusFilter;

  onSearchChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: StatusFilter
  ) => void;
}

const STATUS_OPTIONS: {
  label: string;
  value: StatusFilter;
}[] = [
  {
    label: "Todos",
    value: "todos",
  },
  {
    label: "Pendente",
    value: "pendente",
  },
  {
    label: "Aprovada",
    value: "aprovada",
  },
  {
    label: "Rejeitada",
    value: "rejeitada",
  },
];

export default function ArtworkToolbar({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: Props) {
  const [isOpen, setIsOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
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
      (option) =>
        option.value === statusFilter
    )?.label ?? "Todos";

  return (
    <div className={styles.container}>
      <div
        className={styles.searchContainer}
      >
        <Search
          size={18}
          className={styles.searchIcon}
        />

        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por obra..."
          value={searchTerm}
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
        />
      </div>

      <div
        className={styles.selectWrapper}
        ref={dropdownRef}
      >
        <button
          type="button"
          className={styles.selectButton}
          onClick={() =>
            setIsOpen(!isOpen)
          }
        >
          <div
            className={
              styles.buttonLabel
            }
          >
            <Filter size={16} />

            <span>
              {currentLabel}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`${
              styles.chevron
            } ${
              isOpen
                ? styles.rotate
                : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul
            className={
              styles.dropdownMenu
            }
          >
            {STATUS_OPTIONS.map(
              (option) => (
                <li
                  key={option.value}
                  className={`${
                    styles.dropdownOption
                  } ${
                    statusFilter ===
                    option.value
                      ? styles.selectedOption
                      : ""
                  }`}
                  onClick={() => {
                    onStatusChange(
                      option.value
                    );
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}