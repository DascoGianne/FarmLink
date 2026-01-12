import svgPaths from "./svg-ne92mx5bl";

export default function Rectangle() {
  return (
    <div className="relative size-full">
      <div className="absolute inset-[0_-1.24%_-2.73%_-1.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 331 301">
          <g filter="url(#filter0_d_49_100)" id="Rectangle 11379">
            <path d={svgPaths.p9ae7500} fill="var(--fill-0, white)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="301" id="filter0_d_49_100" width="331" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_49_100" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_49_100" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}