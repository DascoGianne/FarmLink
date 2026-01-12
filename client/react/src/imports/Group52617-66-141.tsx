function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-gradient-to-r from-[#321bb8] h-[45.841px] left-0 rounded-bl-[5px] rounded-tr-[25px] to-[#1c1646] top-0 w-[424.924px]" />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group />
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[#bbb0ff] from-[47.95%] h-[46.118px] leading-[normal] left-[169.35px] text-[34px] to-white top-[0.72px] w-[161.882px]" style={{ WebkitTextFillColor: "transparent" }}>{`FREE SHIPPING `}</p>
      <div className="absolute font-['Teko',sans-serif] font-medium h-[27.294px] leading-[12px] left-[332.18px] text-[16px] text-white top-[11.96px] tracking-[1.12px] w-[118.588px]">
        <p className="mb-0">WITHIN</p>
        <p>METRO MANILA</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-gradient-to-r from-[#1bb81b] h-[45.841px] left-0 rounded-bl-[5px] rounded-tr-[25px] to-[#2f2] top-0 w-[164.08px]" />
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[#21f321] from-[37.225%] h-[25.212px] leading-[normal] left-[3.95px] text-[30px] to-[#1bba1b] to-[50.551%] top-[4.58px] w-[160.126px]" style={{ WebkitTextFillColor: "transparent" }}>
        LIMITED STOCKS
      </p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group1 />
    </div>
  );
}

export default function Group4() {
  return (
    <div className="relative size-full">
      <Group2 />
      <Group3 />
    </div>
  );
}
