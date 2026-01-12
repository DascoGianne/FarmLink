function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-gradient-to-r from-[#321bb8] h-[20px] left-0 rounded-bl-[5px] rounded-tr-[15px] to-[#1c1646] top-0 w-[202px]" />
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <Group />
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[#bbb0ff] from-[47.95%] h-[20px] leading-[normal] left-[81px] text-[16px] to-white top-0 w-[111.246px]" style={{ WebkitTextFillColor: "transparent" }}>{`FREE SHIPPING `}</p>
      <div className="absolute font-['Teko',sans-serif] font-medium leading-[6px] left-[158px] text-[7px] text-white top-[4px] tracking-[0.49px] w-[39px]">
        <p className="mb-0">WITHIN</p>
        <p>METRO MANILA</p>
      </div>
    </div>
  );
}
