import React from "react";
import { ExternalLink } from "lucide-react";
import Modal from "./Modal";
import type { AdminVerificationItem } from "../../services/adminServices";

interface KYCDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: AdminVerificationItem | null;
  onApprove: (item: AdminVerificationItem) => void;
  onOpenReject: (item: AdminVerificationItem) => void;
  isApproving?: boolean;
}

export const KYCDocumentsModal: React.FC<KYCDocumentsModalProps> = ({
  isOpen,
  onClose,
  verification,
  onApprove,
  onOpenReject,
  isApproving,
}) => {
  if (!isOpen || !verification) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <div className="flex items-center justify-between border-b border-[#e3eaf2] pb-3 mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-[#0B2D5B]">
              Identity Documents Inspection
            </h3>
            <p className="text-[11px] text-[#8190a3]">
              {verification.user?.name} • Ref: {verification.document_number}
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-primary/10 text-primary">
            {verification.document_type?.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Front Image */}
          <div className="rounded-lg border border-[#e3eaf2] bg-[#f8fafc] p-3 text-center">
            <p className="text-xs font-semibold text-primary mb-2 flex items-center justify-center gap-1">
              <span>Front Document Image</span>
              {verification.front_image_url && (
                <a
                  href={verification.front_image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-primary"
                  title="Open full size"
                >
                  <ExternalLink size={12} />
                </a>
              )}
            </p>
            {verification.front_image_url ? (
              <a
                href={verification.front_image_url}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={verification.front_image_url}
                  alt="Front Document"
                  className="w-full h-44 object-cover rounded border border-[#dfe8f1] bg-white hover:opacity-95 transition"
                />
              </a>
            ) : (
              <div className="h-44 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs">
                No front document uploaded
              </div>
            )}
          </div>

          {/* Back Image */}
          <div className="rounded-lg border border-[#e3eaf2] bg-[#f8fafc] p-3 text-center">
            <p className="text-xs font-semibold text-primary mb-2 flex items-center justify-center gap-1">
              <span>Back Document Image</span>
              {verification.back_image_url && (
                <a
                  href={verification.back_image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-primary"
                  title="Open full size"
                >
                  <ExternalLink size={12} />
                </a>
              )}
            </p>
            {verification.back_image_url ? (
              <a
                href={verification.back_image_url}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={verification.back_image_url}
                  alt="Back Document"
                  className="w-full h-44 object-cover rounded border border-[#dfe8f1] bg-white hover:opacity-95 transition"
                />
              </a>
            ) : (
              <div className="h-44 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs">
                No back document (optional)
              </div>
            )}
          </div>
        </div>

        {verification.status === "pending" && (
          <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-[#e3eaf2]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReject(verification);
              }}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer transition"
            >
              Reject Submission
            </button>
            <button
              type="button"
              onClick={() => {
                onApprove(verification);
                onClose();
              }}
              disabled={isApproving}
              className="px-5 py-2 rounded-lg bg-[#05a957] hover:bg-[#04984e] text-white text-xs font-semibold cursor-pointer transition disabled:opacity-60"
            >
              {isApproving ? "Approving..." : "Approve Verification"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default KYCDocumentsModal;
