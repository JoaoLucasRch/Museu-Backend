import { X } from "lucide-react";

import EventForm from "./EventForm";

import styles from "./EventModal.module.css";

interface Props {
  isOpen: boolean;
  title: string;
  formData: any;
  selectedFile: File | null;
  isSubmitting: boolean;
  uploadProgress: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function EventModal({
  isOpen,
  title,
  formData,
  selectedFile,
  isSubmitting,
  uploadProgress,
  onClose,
  onSubmit,
  onFileChange,
  setFormData,
}: Props) {

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>

          <div>

            <h2>{title}</h2>

            <p className={styles.subtitle}>
              Preencha as informações abaixo para publicar o evento.
            </p>

          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </header>

        <EventForm
          formData={formData}
          selectedFile={selectedFile}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onSubmit={onSubmit}
          onClose={onClose}
          onCancel={onClose}
          onFileChange={onFileChange}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}