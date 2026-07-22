type ConfirmModalProps = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onCancel}>
            {cancelText}
          </button>

          <button className="danger-button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
