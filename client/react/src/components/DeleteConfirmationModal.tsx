import { X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listingName: string;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, listingName }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div className="relative bg-white rounded-[20px] shadow-[0px_4px_30px_rgba(0,0,0,0.2)] w-full max-w-[500px]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-gray-600 hover:text-gray-800 transition p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] px-8 py-6 rounded-t-[20px]">
          <h2 className="font-['Poppins'] text-[28px] font-bold text-[#353535] mb-2">
            Delete Listing
          </h2>
          <p className="font-['Poppins'] text-[14px] text-[#7d7d7d]">
            This action cannot be undone
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Warning Message */}
          <div className="mb-6">
            <p className="font-['Poppins'] text-[16px] text-[#353535] leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-[#EF4444]">"{listingName}"</span>?
            </p>
            <p className="font-['Poppins'] text-[14px] text-[#7d7d7d] mt-3">
              This listing will be permanently removed from your inventory and cannot be recovered.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#353535] font-['Poppins'] font-semibold text-[16px] py-3 rounded-[10px] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white font-['Poppins'] font-semibold text-[16px] py-3 rounded-[10px] transition shadow-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}