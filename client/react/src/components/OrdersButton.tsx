import svgPaths from "../imports/svg-wlhcu6peep";
import imgImage48 from "figma:asset/f559d06dbfb1645515a8890af779d43c96c38a39.png";

interface OrdersButtonProps {
  orderCount: number;
  onClick: () => void;
}

export function OrdersButton({ orderCount, onClick }: OrdersButtonProps) {
  const hasBadge = orderCount > 0;
  return (
    <button 
      onClick={onClick}
      className="relative w-[75px] h-[70px] hover:opacity-80 transition"
    >
      <div className="absolute left-[4px] size-[67px] top-0" data-name="image 48">
        <img alt="Orders clipboard" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage48} />
      </div>
      {hasBadge && (
        <>
          <div className="absolute flex h-[19.5px] items-center justify-center left-[47px] top-[35.8px] w-[19.3px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
            <div className="flex-none rotate-[90.924deg] skew-x-[359.767deg]">
              <div className="h-[19px] relative w-[19px]">
                <div className="absolute inset-[-12.66%_-12.58%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.8529 29.7002">
                    <g filter="url(#filter0_f_47_209)" id="Ellipse 952">
                      <path d={svgPaths.p1e991100} fill="var(--fill-0, #B5FA30)" />
                    </g>
                    <defs>
                      <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.7002" id="filter0_f_47_209" width="29.8529" x="0" y="0">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_47_209" stdDeviation="1.5" />
                      </filter>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <p className="absolute font-['Poppins',sans-serif] font-extrabold h-[19px] leading-[normal] left-[56px] not-italic text-[#f8fff7] text-[16px] text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] top-[33.5px] tracking-[0.2px] translate-x-[-50%] w-[18px]">{orderCount}</p>
        </>
      )}
      <p className="absolute font-['Poppins',sans-serif] font-extrabold h-[12px] leading-[normal] left-[37.5px] not-italic text-[#32a928] text-[8px] text-center top-[58px] tracking-[0.1px] translate-x-[-50%] w-[75px]">Orders</p>
    </button>
  );
}
