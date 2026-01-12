import { useState } from 'react';
import { X } from 'lucide-react';
import imgEllipse973 from "figma:asset/47372860d1fb2dd065b1952ae7d521db4da96171.png";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerName: string;
  buyerId: string;
}

export function SendMessageModal({ isOpen, onClose, buyerName, buyerId }: SendMessageModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    // Simulate sending message
    setMessage('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div className="relative bg-white rounded-[20px] shadow-[0px_4px_30px_rgba(0,0,0,0.2)] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-gray-500 hover:text-gray-700 transition p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#5EB14E] to-[#73CF61] px-8 py-6 rounded-t-[20px]">
          <h2 className="font-['Poppins'] text-[28px] font-bold text-white mb-2">
            Send Message
          </h2>
          <p className="font-['Poppins'] text-[14px] text-white/90">
            Send a message to the buyer
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-[12px]">
            <div className="relative w-[48px] h-[48px] flex-shrink-0">
              <div className="absolute inset-0 bg-[#32a928] rounded-full blur-[4px]"></div>
              <img src={imgEllipse973} alt={buyerName} className="relative w-full h-full rounded-full" />
            </div>
            <div>
              <p className="font-['Poppins'] text-[18px] font-semibold text-[#353535]">
                {buyerName}
              </p>
              <p className="font-['Poppins'] text-[12px] text-[#979797]">
                Buyer ID #{buyerId}
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="font-['Poppins'] text-[14px] font-semibold text-[#353535] block mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className="w-full border-2 border-gray-200 rounded-[12px] px-4 py-3 font-['Poppins'] text-[16px] text-[#353535] outline-none focus:border-[#5EB14E] transition resize-none placeholder:text-gray-400"
            />
            <p className="font-['Poppins'] text-[12px] text-[#979797] mt-2">
              {message.length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-['Poppins'] font-semibold text-[16px] px-6 py-3 rounded-[10px] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`flex-1 font-['Poppins'] font-extrabold text-[16px] px-6 py-3 rounded-[10px] transition ${
                message.trim()
                  ? 'bg-[#5EB14E] hover:bg-[#4a9a3d] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}