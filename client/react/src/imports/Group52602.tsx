import svgPaths from "./svg-zkp5gndotj";
import imgImage48 from "figma:asset/f559d06dbfb1645515a8890af779d43c96c38a39.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute left-[5px] size-[84px] top-0" data-name="image 48">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage48} />
      </div>
      <div className="absolute flex h-[24.329px] items-center justify-center left-[58.95px] top-[44.94px] w-[24.08px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90.924deg] skew-x-[359.767deg]">
          <div className="h-[23.7px] relative w-[23.853px]">
            <div className="absolute inset-[-12.66%_-12.58%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.8529 29.7002">
                <g filter="url(#filter0_f_159_458)" id="Ellipse 952">
                  <path d={svgPaths.p1e991100} fill="var(--fill-0, #B5FA30)" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.7002" id="filter0_f_159_458" width="29.8529" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_159_458" stdDeviation="1.5" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="absolute font-['Poppins:ExtraBold',sans-serif] h-[23.638px] leading-[normal] left-[70.23px] not-italic text-[#f8fff7] text-[20px] text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] top-[42px] tracking-[0.2px] translate-x-[-50%] w-[22.46px]">5</p>
      <p className="absolute font-['Poppins:ExtraBold',sans-serif] h-[15px] leading-[normal] left-[47.01px] not-italic text-[#32a928] text-[10px] text-center top-[73px] tracking-[0.1px] translate-x-[-50%] w-[94.026px]">Orders</p>
    </div>
  );
}