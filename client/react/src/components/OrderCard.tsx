import imgEllipse973 from "figma:asset/47372860d1fb2dd065b1952ae7d521db4da96171.png";
import imgImage18 from "figma:asset/eaface832d80825f4f2db9cdcf53c51a702f0a73.png";
import imgFarmLinkMoodbo3 from "figma:asset/00a9469c66eec1aa36dc068f80cdb07a495fe047.png";
import { useState } from 'react';
import { SendMessageModal } from './SendMessageModal';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: string;
  price: string;
}

interface OrderCardProps {
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  items: OrderItem[];
  subtotal: string;
  discount: string;
  total: string;
  shipping?: string;
  orderStatus?: string;
  onConfirm?: () => void;
  isConfirming?: boolean;
}

export function OrderCard({
  orderNumber,
  buyerId,
  buyerName,
  buyerEmail,
  buyerPhone,
  buyerAddress,
  items,
  subtotal,
  discount,
  total,
  shipping = "20.00",
  orderStatus = "Pending",
  onConfirm,
  isConfirming = false
}: OrderCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const isPending = orderStatus === "Pending";
  const statusLabel = `Order ${orderStatus}`;

  return (
    <div className="relative bg-white rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-['Poppins'] text-[28px] font-bold text-[#32a928] leading-[1]">
          Order #{orderNumber}
        </h2>
        {!isPending ? (
          <p className="font-['Poppins'] text-[18px] font-bold text-[#32a928] italic">
            {statusLabel}
          </p>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="bg-[#5EB14E] hover:bg-[#4a9a3d] text-white font-['Poppins'] font-extrabold text-[16px] px-10 py-2.5 rounded-[8px] transition"
          >
            {isConfirming ? 'Confirming...' : 'Confirm Order'}
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.1fr] gap-4">
        {/* Orders Section */}
        <div className="bg-white rounded-[20px] shadow-[1px_4px_10px_rgba(0,0,0,0.25)] p-4">
          <h3 className="font-['Poppins'] text-[18px] font-bold text-[#32a928] mb-4">Orders</h3>
          
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_80px_70px] gap-3 mb-3">
            <span className="font-['Poppins'] text-[14px] font-semibold text-[#32a928]">ID</span>
            <span className="font-['Poppins'] text-[14px] font-semibold text-[#32a928]">Crop Name</span>
            <span className="font-['Poppins'] text-[14px] font-semibold text-[#32a928]">Quantity</span>
            <span className="font-['Poppins'] text-[14px] font-semibold text-[#32a928]">Price</span>
          </div>

          {/* Items */}
          {items.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <div className="border-t border-[#D1BCBC] my-3"></div>}
              <div className="grid grid-cols-[40px_1fr_80px_70px] gap-3 items-center">
                <span className="font-['Poppins'] text-[16px] font-semibold text-[#32a928]">{item.id}</span>
                
                {/* Product with Image */}
                <div className="flex items-center gap-2">
                  <div className="relative w-[40px] h-[38px] bg-white rounded-[5px] shadow-[2px_3px_10px_rgba(0,0,0,0.15)] flex items-center justify-center flex-shrink-0">
                    {item.image === 'orange' && (
                      <>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32px] h-[8px]">
                          <div className="w-full h-full rounded-full bg-[#F39A39] blur-[6px] opacity-80"></div>
                        </div>
                        <img src={imgFarmLinkMoodbo3} alt={item.name} className="relative z-10 w-[32px] h-[28px] object-cover" />
                      </>
                    )}
                    {item.image === 'kamote' && (
                      <>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32px] h-[9px]">
                          <div className="w-full h-full rounded-full bg-[#E1A5AF] blur-[6px] opacity-80"></div>
                        </div>
                        <img src={imgImage18} alt={item.name} className="relative z-10 w-[38px] h-[20px] object-cover" />
                      </>
                    )}
                    {item.image !== 'orange' && item.image !== 'kamote' && (
                      <img src={item.image} alt={item.name} className="w-[34px] h-[28px] object-contain" />
                    )}
                  </div>
                  <span className="font-['Poppins'] text-[14px] font-semibold text-[#353535]">{item.name}</span>
                </div>
                
                <span className="font-['Poppins'] text-[14px] font-medium text-[#353535]">{item.quantity}</span>
                <span className="font-['Poppins'] text-[14px] font-medium text-[#353535]">₱{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Section */}
        <div className="bg-white rounded-[20px] shadow-[1px_4px_10px_rgba(0,0,0,0.25)] p-4">
          <h3 className="font-['Poppins'] text-[18px] font-bold text-[#32a928] mb-4">Delivery</h3>
          <p className="font-['Poppins'] text-[14px] font-semibold text-[#32a928] mb-3 leading-tight">Bus<br/>Shipping</p>
          <div className="space-y-1">
            <p className="font-['Poppins'] text-[14px] font-semibold text-[#353535]">DropN'Go</p>
            <p className="font-['Poppins'] text-[14px] font-medium text-[#353535] blur-[1px] opacity-50">₱{shipping}</p>
          </div>
          <p className="font-['Poppins'] text-[13px] italic text-[#353535] mt-12">Free Shipping Applied</p>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-[20px] shadow-[1px_4px_10px_rgba(0,0,0,0.25)] p-4">
          <h3 className="font-['Poppins'] text-[18px] font-bold text-[#32a928] mb-4">Payment</h3>
          <p className="font-['Poppins'] text-[14px] font-semibold text-[#32a928] mb-3 leading-tight">Bank<br/>Transfer</p>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="font-['Poppins'] text-[14px] font-semibold text-[#353535]">Subtotal</span>
              <span className="font-['Poppins'] text-[14px] font-medium text-[#353535]">₱{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-['Poppins'] text-[14px] font-medium text-[#a9a9a9]">Discounts</span>
              <span className="font-['Poppins'] text-[14px] font-medium text-[#aaa7a7]">₱{discount}</span>
            </div>
            
            <div className="border-t border-[#D1BCBC] my-2"></div>
            
            <div className="flex justify-between">
              <span className="font-['Poppins'] text-[14px] font-semibold text-[#353535] leading-tight">Total<br/>Paid by<br/>Buyer</span>
              <span className="font-['Poppins'] text-[14px] font-medium text-[#353535]">₱{total}</span>
            </div>
          </div>

          <button className="w-full bg-[#EDEDED] hover:bg-[#d0d0d0] text-[#4f4f4f] font-['Poppins'] font-semibold text-[14px] px-4 py-2.5 rounded-[8px] transition mt-4">
            View Receipt
          </button>
        </div>

        {/* Buyer ID Section */}
        <div className="bg-[#f2f2f2] rounded-[20px] p-5 flex flex-col w-full max-w-[260px] justify-self-end">
          <h3 className="font-['Poppins'] text-[16px] font-bold text-[#32a928] text-center mb-4">
            Buyer ID #{buyerId}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="relative w-[32px] h-[32px] flex-shrink-0">
              <div className="absolute inset-0 bg-[#32a928] rounded-full blur-[4px]"></div>
              <img src={imgEllipse973} alt={buyerName} className="relative w-full h-full rounded-full" />
            </div>
            <p className="font-['Poppins'] text-[16px] font-semibold text-[#979797]">{buyerName}</p>
          </div>

          <div className="border-t border-[#D1BCBC] pt-3 space-y-1.5 mb-4">
            <p className="font-['Poppins'] text-[10px] font-semibold text-[#979797] leading-tight">
              • {buyerEmail}
            </p>
            <p className="font-['Poppins'] text-[10px] font-semibold text-[#979797] leading-tight">
              • {buyerPhone}
            </p>
            <p className="font-['Poppins'] text-[10px] font-semibold text-[#979797] leading-tight">
              • {buyerAddress}
            </p>
          </div>

          <button className="w-full bg-[#73CF61] hover:bg-[#5eb14e] text-white font-['Poppins'] font-extrabold text-[14px] px-4 py-2.5 rounded-[8px] transition mt-auto" onClick={() => setModalOpen(true)}>
            Send Message
          </button>
        </div>
      </div>

      {/* SendMessageModal */}
      <SendMessageModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        buyerName={buyerName} 
        buyerId={buyerId} 
      />
    </div>
  );
}



