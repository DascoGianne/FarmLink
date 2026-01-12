function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-gradient-to-r from-[#321bb8] h-[45.841px] left-0 rounded-bl-[5px] rounded-tr-[25px] to-[#1c1646] top-0 w-[424.924px]" />
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <Group />
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[#bbb0ff] from-[47.95%] h-[46.118px] leading-[normal] left-[169.35px] text-[34px] to-white top-[0.72px] w-[161.882px]" style={{ WebkitTextFillColor: "transparent" }}>{`FREE SHIPPING `}</p>
      <div className="absolute font-['Teko',sans-serif] font-medium h-[27.294px] leading-[12px] left-[332.18px] text-[16px] text-white top-[11.96px] tracking-[1.12px] w-[118.588px]">
        <p className="mb-0">WITHIN</p>
        <p>METRO MANILA</p>
      </div>
    </div>
  );
}
