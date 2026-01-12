import svgPaths from "./svg-3oymq2n4vl";
import imgClose from "figma:asset/e92a1aea5edf60e23076a2402ea0d54fa2ae67d5.png";
import imgRectangle11256 from "figma:asset/364807345685588370ef0db7efdd7992085e10bd.png";
import imgRectangle11257 from "figma:asset/92dba10b5578a3177cec9685959d4ea0704eb4a6.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[175px] left-0 top-0 w-[323px]">
        <div className="absolute inset-[0_-1.24%_-4.57%_-1.24%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 331 183">
            <g filter="url(#filter0_d_19_1227)" id="Rectangle 11249">
              <path d={svgPaths.p1aa84a00} fill="var(--fill-0, white)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="183" id="filter0_d_19_1227" width="331" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_19_1227" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_19_1227" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute h-[52px] left-[10px] top-[42px] w-[301px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 301 52">
          <path d={svgPaths.p26b32c00} fill="var(--fill-0, #EDEDED)" id="Rectangle 11250" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[16px] not-italic text-[#474747] text-[16px] top-[14px] tracking-[0.16px] w-[233px]">Quantity / Unit / Price</p>
      <div className="absolute h-[41px] left-[15.5px] top-[47px] w-[76px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 41">
          <path d={svgPaths.p138fdb00} fill="var(--fill-0, white)" id="Rectangle 11251" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[26px] leading-[normal] left-[52px] not-italic text-[#353535] text-[20px] text-center top-[54px] translate-x-[-50%] w-[44px]">1</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[30px] leading-[normal] left-[183px] not-italic text-[24px] text-[rgba(6,6,6,0.8)] top-[49px] w-[111px]">0.00</p>
      <div className="absolute h-[30px] left-[283px] top-[7px] w-[34px]" data-name="Close">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgClose} />
      </div>
      <div className="absolute h-[52px] left-[10px] top-[104.5px] w-[300px]">
        <img alt="" className="block max-w-none size-full" height="52" src={imgRectangle11256} width="300" />
      </div>
      <div className="absolute h-[42px] left-[16px] top-[109px] w-[77px]">
        <img alt="" className="block max-w-none size-full" height="42" src={imgRectangle11257} width="77" />
      </div>
      <div className="absolute h-[41px] left-[98px] top-[47px] w-[76px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 41">
          <path d={svgPaths.p138fdb00} fill="var(--fill-0, white)" id="Rectangle 11251" />
        </svg>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[36px] leading-[normal] left-[135.5px] not-italic text-[#353535] text-[20px] text-center top-[53px] translate-x-[-50%] w-[57px]">kg</p>
      <div className="absolute h-[42px] left-[98px] top-[109.5px] w-[77px]">
        <img alt="" className="block max-w-none size-full" height="42" src={imgRectangle11257} width="77" />
      </div>
    </div>
  );
}