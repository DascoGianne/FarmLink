import svgPaths from "./svg-nr9tpobbu5";
import clsx from "clsx";
import imgEllipse973 from "figma:asset/47372860d1fb2dd065b1952ae7d521db4da96171.png";
import imgImage18 from "figma:asset/eaface832d80825f4f2db9cdcf53c51a702f0a73.png";
import imgFarmLinkMoodbo3 from "figma:asset/00a9469c66eec1aa36dc068f80cdb07a495fe047.png";
import imgBaseBoxPerNgoProducts from "figma:asset/dc402d523819a79a0d01b7bc84aa4fb226415db5.png";
type Wrapper1Props = {
  additionalClassNames?: string;
  text: string;
};

function Wrapper1({ children, additionalClassNames = "", text }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div style={{ "--transform-inner-width": "11.328125", "--transform-inner-height": "23" } as React.CSSProperties} className={clsx("absolute flex h-[20.09px] items-center justify-center left-[58px] w-[23.78px]", additionalClassNames)}>
      <div className="flex-none rotate-[359.723deg] skew-x-[0.181deg]">
        <p className="font-['Poppins:SemiBold',sans-serif] h-[19.977px] leading-[normal] not-italic relative text-[#32a928] text-[20px] tracking-[0.2px] w-[23.621px]">{text}</p>
      </div>
    </div>
  );
}
type BgProps = {
  additionalClassNames?: string;
};

function Bg({ children, additionalClassNames = "" }: React.PropsWithChildren<BgProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 251 45.782">
        {children}
      </svg>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 252.762 1">
        {children}
      </svg>
    </div>
  );
}
type HelperProps = {
  additionalClassNames?: string;
};

function Helper({ additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("absolute h-[282px] top-[99px] w-[292px]", additionalClassNames)}>
      <div className="absolute inset-[-2.13%_-3.77%_-4.96%_-3.08%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 312 302">
          <g filter="url(#filter0_d_66_905)" id="Rectangle 11272">
            <path d={svgPaths.p35628a40} fill="var(--fill-0, white)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="302" id="filter0_d_66_905" width="312" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="4" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_66_905" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_66_905" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group52589Text({ text }: Group52589TextProps) {
  return (
    <div className="flex-none rotate-[359.723deg] skew-x-[0.181deg]">
      <p className="font-['Poppins:SemiBold',sans-serif] h-[19.977px] leading-[normal] not-italic relative text-[#32a928] text-[20px] tracking-[0.2px] w-[23.621px]">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="flex-none rotate-[359.865deg] skew-x-[0.807deg]">
      <p className="font-['Poppins:ExtraBold',sans-serif] h-[21.119px] leading-[normal] not-italic relative text-[20px] text-center text-white tracking-[0.2px] w-[185.524px]">{text}</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[1147px] top-[25px]">
      <div className="absolute inset-[6.05%_1.51%_80.87%_78.51%]" data-name="bg">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 292 54">
          <path clipRule="evenodd" d={svgPaths.p1cfd6280} fill="var(--fill-0, #5EB14E)" fillRule="evenodd" id="bg" />
        </svg>
      </div>
      <div className="absolute flex h-[21.553px] items-center justify-center left-[1291.34px] top-[36.67px] translate-x-[-50%] w-[185.871px]" style={{ "--transform-inner-width": "129.296875", "--transform-inner-height": "23" } as React.CSSProperties}>
        <Text text="Confirm Order" />
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[1140px] top-[99px]">
      <div className="absolute bg-[#f2f2f2] h-[282px] left-[1147px] rounded-[30px] top-[99px] w-[292px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[34px] leading-[normal] left-[1223px] not-italic text-[#979797] text-[24px] top-[149px] tracking-[0.24px] w-[169.66px]">Juan Pinoy</p>
      <ul className="absolute block font-['Poppins:SemiBold',sans-serif] h-[61px] leading-[0] left-[1181px] not-italic text-[#979797] text-[12px] top-[249px] tracking-[0.12px] w-[241.217px]">
        <li className="ms-[18px]">
          <span className="leading-[normal]">NCR National Capital Region, Metro Manila, Taguig, Fort Bonifacio, 1765 Mckinley St., 2005</span>
        </li>
      </ul>
      <div className="absolute left-[1171px] size-[40px] top-[148px]">
        <div className="absolute inset-[-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
            <g filter="url(#filter0_f_66_917)" id="Ellipse 972">
              <path d={svgPaths.p2f4993f0} fill="var(--fill-0, #32A928)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="60" id="filter0_f_66_917" width="60" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_66_917" stdDeviation="5" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[1172px] size-[38px] top-[149px]">
        <img alt="" className="block max-w-none size-full" height="38" src={imgEllipse973} width="38" />
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[33px] leading-[normal] left-[1274.46px] not-italic text-[#32a928] text-[24px] text-center top-[109px] translate-x-[-50%] w-[268.917px]">Buyer ID #00002</p>
      <ul className="absolute block font-['Poppins:SemiBold',sans-serif] h-[19px] leading-[0] left-[1181px] not-italic text-[#979797] text-[12px] top-[226px] tracking-[0.12px] w-[188.126px]">
        <li className="ms-[18px]">
          <span className="leading-[normal]">+(63) 999 999 9999</span>
        </li>
      </ul>
      <ul className="absolute block font-['Poppins:SemiBold',sans-serif] h-[23px] leading-[0] left-[1181px] not-italic text-[#979797] text-[12px] top-[202px] tracking-[0.12px] w-[236.601px]">
        <li className="ms-[18px]">
          <span className="leading-[normal]">juanpeenoy123@gmail.com</span>
        </li>
      </ul>
      <div className="absolute h-0 left-[1169.5px] top-[196.5px] w-[251.761px]" data-name="Divider Horizontal">
        <Wrapper additionalClassNames="inset-[-0.5px_-0.2%]">
          <path d="M0.5 0.5H252.262" id="Divider Horizontal" stroke="var(--stroke-0, #D1BCBC)" strokeLinecap="round" />
        </Wrapper>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[128px] top-[268.06px]">
      <div className="absolute bg-white h-[50.279px] left-[128px] rounded-[5px] shadow-[2px_3px_10px_0px_rgba(0,0,0,0.15)] top-[268.06px] w-[52.36px]" />
      <div className="absolute flex h-[12.619px] items-center justify-center left-[134.77px] top-[292.7px] w-[41.469px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.413deg] skew-x-[359.939deg]">
          <div className="h-[12.321px] relative w-[41.369px]">
            <div className="absolute inset-[-121.74%_-36.26%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 71.3685 42.3214">
                <g filter="url(#filter0_f_66_933)" id="Ellipse 968">
                  <ellipse cx="35.6843" cy="21.1607" fill="var(--fill-0, #E1A5AF)" rx="20.6843" ry="6.1607" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42.3214" id="filter0_f_66_933" width="71.3685" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_66_933" stdDeviation="7.5" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[26.914px] left-[128.92px] top-[278.84px] w-[50.513px]" data-name="image 18">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage18} />
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[30px] top-[99px]">
      <div className="absolute h-[282px] left-[30px] top-[99px] w-[473px]">
        <div className="absolute inset-[-2.13%_-2.33%_-4.96%_-1.9%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 493 302">
            <g filter="url(#filter0_d_66_923)" id="Rectangle 11272">
              <path d={svgPaths.p215cc400} fill="var(--fill-0, white)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="302" id="filter0_d_66_923" width="493" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1" dy="4" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_66_923" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_66_923" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute flex h-[20.73px] items-center justify-center left-[129px] top-[157.56px] w-[156.076px]" style={{ "--transform-inner-width": "104.0625", "--transform-inner-height": "23" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.723deg] skew-x-[0.181deg]">
          <p className="font-['Poppins:SemiBold',sans-serif] h-[19.977px] leading-[normal] not-italic relative text-[#32a928] text-[20px] tracking-[0.2px] w-[155.918px]">Crop Name</p>
        </div>
      </div>
      <div className="absolute bg-white h-[49.493px] left-[128px] rounded-[5px] shadow-[2px_3px_10px_0px_rgba(0,0,0,0.15)] top-[196.33px] w-[52.485px]" />
      <div className="absolute flex h-[11.431px] items-center justify-center left-[133.3px] top-[221.99px] w-[42.807px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.405deg] skew-x-[359.923deg]">
          <div className="h-[11.129px] relative w-[42.715px]">
            <div className="absolute inset-[-134.78%_-35.12%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72.7148 41.1292">
                <g filter="url(#filter0_f_66_927)" id="Ellipse 967">
                  <ellipse cx="36.3574" cy="20.5646" fill="var(--fill-0, #F39A39)" rx="21.3574" ry="5.5646" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="41.1292" id="filter0_f_66_927" width="72.7148" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_66_927" stdDeviation="7.5" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[41.323px] items-center justify-center left-[131.73px] top-[198.84px] w-[45.168px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[350.274deg]">
          <div className="h-[35.102px] relative w-[39.811px]" data-name="FarmLink Moodbo 3">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgFarmLinkMoodbo3} />
          </div>
        </div>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[17.447px] leading-[normal] left-[195px] not-italic text-[#353535] text-[16px] top-[206.99px] tracking-[0.16px] w-[89px]">Oranges</p>
      <Group />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[33.925px] leading-[normal] left-[195px] not-italic text-[#353535] text-[16px] top-[275.81px] tracking-[0.16px] w-[118px]">Kamote</p>
      <div className="absolute flex h-[20.569px] items-center justify-center left-[299px] top-[157.56px] w-[122.711px]" style={{ "--transform-inner-width": "76.09375", "--transform-inner-height": "23" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.723deg] skew-x-[0.181deg]">
          <p className="font-['Poppins:SemiBold',sans-serif] h-[19.977px] leading-[normal] not-italic relative text-[#32a928] text-[20px] tracking-[0.2px] w-[122.553px]">Quantity</p>
        </div>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23.263px] leading-[normal] left-[330px] not-italic text-[#353535] text-[16px] top-[206.99px] tracking-[0.16px] w-[69px]">1 kg</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[33.925px] leading-[normal] left-[330px] not-italic text-[#353535] text-[16px] top-[274.84px] tracking-[0.16px] w-[69px]">1 kg</p>
      <div className="absolute flex h-[20.315px] items-center justify-center left-[424px] top-[157.68px] w-[70.195px]" style={{ "--transform-inner-width": "46.578125", "--transform-inner-height": "23" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.723deg] skew-x-[0.181deg]">
          <p className="font-['Poppins:SemiBold',sans-serif] h-[19.977px] leading-[normal] not-italic relative text-[#32a928] text-[20px] tracking-[0.2px] w-[70.037px]">Price</p>
        </div>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[33.925px] leading-[normal] left-[424px] not-italic text-[#353535] text-[16px] top-[206.99px] tracking-[0.16px] w-[69px]">100.00</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[33.925px] leading-[normal] left-[425px] not-italic text-[#353535] text-[16px] top-[271.93px] tracking-[0.16px] w-[69px]">40.00</p>
      <div className="absolute flex h-[1.939px] items-center justify-center left-[55px] top-[257.39px] w-[425px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.739deg]">
          <div className="h-0 relative w-[425.005px]" data-name="Divider Horizontal">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 425.005 1">
                <line id="Divider Horizontal" stroke="var(--stroke-0, #D1BCBC)" strokeLinecap="round" x1="0.5" x2="424.505" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[20.09px] items-center justify-center left-[55px] top-[158.53px] w-[23.78px]" style={{ "--transform-inner-width": "20.40625", "--transform-inner-height": "23" } as React.CSSProperties}>
        <Group52589Text text="ID" />
      </div>
      <Wrapper1 additionalClassNames="top-[206.99px]" text="4" />
      <Wrapper1 additionalClassNames="top-[274.84px]" text="3" />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[30px] top-[99px]">
      <Group4 />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[33px] leading-[normal] left-[95px] not-italic text-[#32a928] text-[24px] text-center top-[115px] translate-x-[-50%] w-[100px]">Orders</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[523px] top-[99px]">
      <Helper additionalClassNames="left-[523px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[33px] leading-[normal] left-[599px] not-italic text-[#32a928] text-[24px] text-center top-[115px] translate-x-[-50%] w-[122px]">Delivery</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[43px] leading-[normal] left-[548px] not-italic text-[#32a928] text-[20px] top-[157px] w-[139px]">Bus Shipping</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[23px] leading-[normal] left-[547px] not-italic text-[#353535] text-[16px] top-[204px] tracking-[0.16px] w-[89px]">DropN’Go</p>
      <p className="absolute blur-[2px] filter font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[753px] not-italic text-[#353535] text-[16px] top-[202px] tracking-[0.16px] w-[49px]">20.00</p>
      <p className="absolute font-['Poppins:Italic',sans-serif] h-[23px] italic leading-[normal] left-[668.5px] text-[#353535] text-[16px] text-center top-[339px] tracking-[0.16px] translate-x-[-50%] w-[211px]">Free Shipping Applied</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[855px] top-[320px]">
      <Bg additionalClassNames="inset-[77.48%_24.3%_11.43%_58.52%]">
        <path clipRule="evenodd" d={svgPaths.p1e493680} fill="var(--fill-0, #EDEDED)" fillRule="evenodd" id="bg" />
      </Bg>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[35.863px] leading-[normal] left-[982.67px] not-italic text-[#4f4f4f] text-[20px] text-center top-[328px] tracking-[0.2px] translate-x-[-50%] w-[188.115px]">View Receipt</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[835px] top-[99px]">
      <Helper additionalClassNames="left-[835px]" />
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[33px] leading-[normal] left-[911px] not-italic text-[#32a928] text-[24px] text-center top-[115px] translate-x-[-50%] w-[122px]">Payment</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[23px] leading-[normal] left-[853px] not-italic text-[#353535] text-[16px] top-[204px] tracking-[0.16px] w-[89px]">Subtotal</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[1050px] not-italic text-[#353535] text-[16px] top-[202px] tracking-[0.16px] w-[55px]">140.00</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[43px] leading-[normal] left-[853px] not-italic text-[#32a928] text-[20px] top-[157px] w-[170px]">Bank Transfer</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[853px] not-italic text-[#a9a9a9] text-[16px] top-[227px] tracking-[0.16px] w-[89px]">Discounts</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[1050px] not-italic text-[#aaa7a7] text-[16px] top-[226px] tracking-[0.16px] w-[55px]">120.00</p>
      <div className="absolute h-0 left-[853px] top-[266px] w-[252.761px]" data-name="Divider Horizontal">
        <Wrapper additionalClassNames="inset-[-1px_0_0_0]">
          <line id="Divider Horizontal" stroke="var(--stroke-0, #D1BCBC)" strokeLinecap="round" x1="0.5" x2="252.262" y1="0.5" y2="0.5" />
        </Wrapper>
      </div>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] h-[23px] leading-[normal] left-[853px] not-italic text-[#353535] text-[16px] top-[285px] tracking-[0.16px] w-[165px]">Total Paid by Buyer</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[1050px] not-italic text-[#353535] text-[16px] top-[285px] tracking-[0.16px] w-[55px]">140.00</p>
      <Group1 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute flex h-[413px] items-center justify-center left-0 top-0 w-[1461px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[413px] relative w-[1461px]" data-name="Base Box per NGO & Products">
            <div className="absolute inset-[-0.97%_-0.89%_-3.87%_-0.48%]">
              <img alt="" className="block max-w-none size-full" height="433" src={imgBaseBoxPerNgoProducts} width="1481" />
            </div>
          </div>
        </div>
      </div>
      <p className="absolute font-['Poppins:Bold',sans-serif] h-[36px] leading-[normal] left-[30px] not-italic text-[#32a928] text-[40px] top-[22px] tracking-[0.4px] w-[392px]">Order #00002</p>
      <Group2 />
      <Group3 />
      <Group5 />
      <Group6 />
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group8 />
    </div>
  );
}

export default function Group10() {
  return (
    <div className="relative size-full">
      <Group9 />
      <Bg additionalClassNames="inset-[77.48%_2.81%_11.43%_80.01%]">
        <path clipRule="evenodd" d={svgPaths.p1e493680} fill="var(--fill-0, #73CF61)" fillRule="evenodd" id="bg" />
      </Bg>
      <div className="absolute flex h-[21.553px] items-center justify-center left-[1297.94px] top-[327px] translate-x-[-50%] w-[185.871px]" style={{ "--transform-inner-width": "135.828125", "--transform-inner-height": "23" } as React.CSSProperties}>
        <Text text="Send Message" />
      </div>
    </div>
  );
}