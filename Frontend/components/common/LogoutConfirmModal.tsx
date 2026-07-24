'use client';

type LogoutConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  processing?: boolean;
  title?: string;
  message?: string;
};

export default function LogoutConfirmModal({
  open,
  onCancel,
  onConfirm,
  processing = false,
  title = 'Log Out',
  message = 'Are you sure you want to log out?',
}: LogoutConfirmModalProps) {
  if (!open) {
    return null;
  }

  const confirmLabel = processing ? 'Logging out...' : 'Yes, Logout';

  return (
    <div
      className="logoutModalBackdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
    >
      <div className="logoutModalDialog" role="document">
        <div className="logoutModalContent">
          <div className="logoutModalHeader">
            <h5 className="logoutModalTitle" id="logout-confirm-title">
              {title}
            </h5>

            <button
              className="logoutModalClose"
              disabled={processing}
              onClick={onCancel}
              type="button"
              aria-label="Close logout confirmation"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="logoutModalBody">{message}</div>

          <div className="logoutModalFooter">
            <button
              className="btn btn-secondary logoutModalButton"
              disabled={processing}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>

            <button
              className="btn btn-primary logoutModalButton logoutConfirmButton"
              disabled={processing}
              onClick={onConfirm}
              type="button"
            >
              <span className="buttonText">
                <span className="buttonTextOriginal">{confirmLabel}</span>
                <span className="buttonTextCopy" aria-hidden="true">
                  {confirmLabel}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .logoutModalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 1055;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100dvh;
          padding: 20px;
          overflow-x: hidden;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .logoutModalDialog {
          width: min(100%, 460px);
          margin: auto;
        }

        .logoutModalContent {
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.2),
            0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .logoutModalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 24px 26px 18px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .logoutModalTitle {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .logoutModalClose {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          padding: 0;
          color: inherit;
          font-size: 28px;
          font-weight: 300;
          line-height: 1;
          background: transparent;
          border: 0;
          border-radius: 50%;
          opacity: 0.7;
          cursor: pointer;
          transition:
            opacity 0.2s ease,
            background-color 0.2s ease,
            transform 0.2s ease;
        }

        .logoutModalClose:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.06);
          opacity: 1;
          transform: rotate(4deg);
        }

        .logoutModalClose:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }

        .logoutModalClose:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .logoutModalBody {
          padding: 28px 26px;
          font-size: 1rem;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .logoutModalFooter {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 18px 26px 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .logoutModalButton {
          min-width: 122px;
          min-height: 44px;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 500;
          white-space: nowrap;
        }

        .logoutConfirmButton {
          overflow: hidden;
        }

        .buttonText {
          position: relative;
          display: inline-block;
          overflow: hidden;
          line-height: 1;
          vertical-align: middle;
        }

        .buttonTextOriginal,
        .buttonTextCopy {
          display: block;
          transition: transform 0.35s ease-in-out;
        }

        .buttonTextCopy {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
        }

        .logoutConfirmButton:hover:not(:disabled) .buttonTextOriginal,
        .logoutConfirmButton:hover:not(:disabled) .buttonTextCopy,
        .logoutConfirmButton:focus-visible:not(:disabled) .buttonTextOriginal,
        .logoutConfirmButton:focus-visible:not(:disabled) .buttonTextCopy {
          transform: translateY(-100%);
        }

        @media (max-width: 575.98px) {
          .logoutModalBackdrop {
            align-items: flex-end;
            padding: 14px;
          }

          .logoutModalDialog {
            width: 100%;
          }

          .logoutModalContent {
            border-radius: 18px;
          }

          .logoutModalHeader {
            padding: 20px 20px 16px;
          }

          .logoutModalBody {
            padding: 24px 20px;
          }

          .logoutModalFooter {
            flex-direction: column-reverse;
            align-items: stretch;
            padding: 16px 20px 20px;
          }

          .logoutModalButton {
            width: 100%;
            min-height: 46px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logoutModalClose,
          .buttonTextOriginal,
          .buttonTextCopy {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
