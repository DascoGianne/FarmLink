import { useEffect, useState } from 'react';
import svgPaths from "../imports/svg-1j7l0qc78i";

interface PromosModalProps {
  isOpen: boolean;
  onClose: (selected: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  }) => void;
  selectedPromos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
  onPromoChange?: (promos: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  }) => void;
}

export function PromosModal({ isOpen, onClose, selectedPromos, onPromoChange }: PromosModalProps) {
  // Initialize with selectedPromos from parent
  const [checkedPromos, setCheckedPromos] = useState(
    selectedPromos || {
      limitedStocks: false,
      freeShipping: false,
      discount25: false,
      discount50: false,
    }
  );

  useEffect(() => {
    if (!selectedPromos) return;
    setCheckedPromos(selectedPromos);
  }, [selectedPromos]);

  if (!isOpen) return null;

  const handleCheckboxChange = (promo: keyof typeof checkedPromos) => {
    const isCurrentlySelected = checkedPromos[promo];
    const newPromos = {
      limitedStocks: false,
      freeShipping: false,
      discount25: false,
      discount50: false,
      [promo]: !isCurrentlySelected,
    };

    setCheckedPromos(newPromos);
    if (onPromoChange) {
      onPromoChange(newPromos);
    }
    onClose(newPromos);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
      <div className="absolute bottom-[120px] right-[50px] pointer-events-auto">
        <div className="relative w-[318px] h-[198px]">
          <div className="absolute inset-[0_-1.26%_-4.04%_-1.26%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 326 206">
              <g filter="url(#filter0_d_19_1229)" id="Rectangle 11393">
                <path d={svgPaths.p17faed80} fill="white" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="206" id="filter0_d_19_1229" width="326" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_19_1229" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow_19_1229" mode="normal" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>

          <p className="absolute font-['Poppins',sans-serif] font-medium h-[23px] leading-[normal] left-[19px] text-[#474747] text-[16px] top-[9px] tracking-[0.16px] w-[233px]">Check your offered promo:</p>

          {/* Limited Stocks */}
          <div className="absolute left-[19px] top-[42px]">
            <input
              type="checkbox"
              checked={checkedPromos.limitedStocks}
              onChange={() => handleCheckboxChange('limitedStocks')}
              className="w-[19px] h-[20px] border-2 border-[#c8c8c8] rounded-[3px] cursor-pointer"
            />
          </div>
          <div className="absolute left-[42px] top-[42px]">
            <div className="bg-gradient-to-r from-[#1bb81b] to-[#2f2] h-[20px] rounded-bl-[5px] rounded-tr-[15px] w-[78px]" />
            <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[#21f321] from-[37.225%] to-[#1bba1b] to-[50.551%] h-[11px] leading-[normal] left-[1.88px] text-[14px] top-[2px] w-[76.12px]" style={{ WebkitTextFillColor: "transparent" }}>
              LIMITED STOCKS
            </p>
          </div>

          {/* Free Shipping */}
          <div className="absolute left-[19px] top-[73px]">
            <input
              type="checkbox"
              checked={checkedPromos.freeShipping}
              onChange={() => handleCheckboxChange('freeShipping')}
              className="w-[19px] h-[20px] border-2 border-[#c8c8c8] rounded-[3px] cursor-pointer"
            />
          </div>
          <div className="absolute left-[42px] top-[73px]">
            <div className="bg-gradient-to-r from-[#321bb8] to-[#1c1646] h-[20px] rounded-bl-[5px] rounded-tr-[15px] w-[202px]" />
            <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[#bbb0ff] from-[47.95%] to-white h-[20px] leading-[normal] left-[81px] text-[16px] top-0 w-[111.246px]" style={{ WebkitTextFillColor: "transparent" }}>
              FREE SHIPPING
            </p>
            <div className="absolute font-['Teko',sans-serif] font-medium leading-[6px] left-[158px] text-[7px] text-white top-[4px] tracking-[0.49px] w-[39px]">
              <p className="mb-0">WITHIN</p>
              <p>METRO MANILA</p>
            </div>
          </div>

          {/* 25% OFF */}
          <div className="absolute left-[19px] top-[104px]">
            <input
              type="checkbox"
              checked={checkedPromos.discount25}
              onChange={() => handleCheckboxChange('discount25')}
              className="w-[19px] h-[20px] border-2 border-[#c8c8c8] rounded-[3px] cursor-pointer"
            />
          </div>
          <div className="absolute left-[42px] top-[105px]">
            <div className="h-[20px] rounded-bl-[5px] rounded-br-[5px] rounded-tr-[15px] w-[248px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 248 20\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(34.05 -0.3 0.076377 8.6688 -92.5 13)\\'><stop stop-color=\\'rgba(251,212,70,1)\\' offset=\\'0.64087\\'/><stop stop-color=\\'rgba(252,164,52,1)\\' offset=\\'0.73065\\'/><stop stop-color=\\'rgba(253,116,35,1)\\' offset=\\'0.82043\\'/><stop stop-color=\\'rgba(254,69,17,1)\\' offset=\\'0.91022\\'/><stop stop-color=\\'rgba(254,45,9,1)\\' offset=\\'0.95511\\'/><stop stop-color=\\'rgba(255,21,0,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />
            <p className="absolute bg-clip-text font-['Teko',sans-serif] font-medium h-[20px] leading-[normal] left-[204px] text-[0px] top-0 w-[47px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(104.56deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
              <span className="text-[16px]">25% </span>
              <span className="bg-clip-text text-[10px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(104.56deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
                OFF
              </span>
            </p>
          </div>

          {/* 50% OFF */}
          <div className="absolute left-[19px] top-[135px]">
            <input
              type="checkbox"
              checked={checkedPromos.discount50}
              onChange={() => handleCheckboxChange('discount50')}
              className="w-[19px] h-[20px] border-2 border-[#c8c8c8] rounded-[3px] cursor-pointer"
            />
          </div>
          <div className="absolute left-[42px] top-[135px]">
            <div className="h-[20px] rounded-bl-[5px] rounded-br-[5px] rounded-tr-[15px] w-[248px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 248 20\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(34.05 -0.3 0.076377 8.6688 -92.5 13)\\'><stop stop-color=\\'rgba(251,212,70,1)\\' offset=\\'0.64087\\'/><stop stop-color=\\'rgba(252,164,52,1)\\' offset=\\'0.73065\\'/><stop stop-color=\\'rgba(253,116,35,1)\\' offset=\\'0.82043\\'/><stop stop-color=\\'rgba(254,69,17,1)\\' offset=\\'0.91022\\'/><stop stop-color=\\'rgba(254,45,9,1)\\' offset=\\'0.95511\\'/><stop stop-color=\\'rgba(255,21,0,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />
            <p className="absolute bg-clip-text font-['Teko',sans-serif] font-medium h-[20px] leading-[normal] left-[204px] text-[0px] top-0 w-[47px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(104.56deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
              <span className="text-[16px]">50% </span>
              <span className="bg-clip-text text-[10px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(104.56deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
                OFF
              </span>
            </p>
          </div>

          <p className="absolute font-['Poppins',sans-serif] italic h-[15px] leading-[normal] left-[162px] text-[#474747] text-[9px] text-center top-[167px] tracking-[0.09px] -translate-x-1/2 w-[286px]">Discounts take effect in real-time after Checking its Box</p>
        </div>
      </div>
    </div>
  );
}
