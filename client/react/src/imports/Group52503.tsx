import imgRectangle11167 from "figma:asset/c60e4047629d26be481eeb7017cf0680e11730c1.png";
import imgSearch from "figma:asset/aa6a6e43946d0edcbb0f5fabe90744e85c1e432f.png";

function SearchBox() {
  return (
    <div className="absolute contents left-[19px] top-0" data-name="Search Box">
      <div className="absolute blur-[10px] filter h-[61.53px] left-[19px] rounded-[10px] top-0 w-[656px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[10px]">
          <img alt="" className="absolute h-[428.38%] left-[-17.11%] max-w-none top-[-255.66%] w-[139.37%]" src={imgRectangle11167} />
        </div>
      </div>
      <div className="absolute bg-white h-[52.74px] left-[34.14px] rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[0.88px] w-[624.462px]" />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <SearchBox />
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[46.587px] leading-[normal] left-[222.74px] not-italic text-[#969696] text-[32px] text-center top-[4.36px] tracking-[0.32px] translate-x-[-50%] w-[445.482px]">Search Product...</p>
      <div className="absolute h-[36.918px] left-[38px] top-[9.36px] w-[50.462px]" data-name="Search">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgSearch} />
      </div>
    </div>
  );
}