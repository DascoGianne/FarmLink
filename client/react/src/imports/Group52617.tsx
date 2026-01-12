function Group2() {
  return (
    <div className="absolute contents left-[2.1px] top-0">
      <div className="absolute h-[45.841px] left-[2.1px] rounded-bl-[5px] rounded-br-[5px] rounded-tr-[25px] top-0 w-[519.61px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 519.61 45.841\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(71.342 -0.68761 0.16003 19.869 -193.81 29.797)\\\'><stop stop-color=\\\'rgba(251,212,70,1)\\\' offset=\\\'0.64087\\\'/><stop stop-color=\\\'rgba(252,164,52,1)\\\' offset=\\\'0.73065\\\'/><stop stop-color=\\\'rgba(253,116,35,1)\\\' offset=\\\'0.82043\\\'/><stop stop-color=\\\'rgba(254,69,17,1)\\\' offset=\\\'0.91022\\\'/><stop stop-color=\\\'rgba(254,45,9,1)\\\' offset=\\\'0.95511\\\'/><stop stop-color=\\\'rgba(255,21,0,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }} />
      <p className="absolute bg-clip-text font-['Teko',sans-serif] font-medium h-[45.841px] leading-[normal] left-[429.52px] text-[0px] top-0 w-[98.475px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(103.357deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
        <span className="text-[36px]">{`50% `}</span>
        <span className="text-[24px]">OFF</span>
      </p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-gradient-to-r from-[#321bb8] h-[45.841px] left-0 rounded-bl-[5px] rounded-tr-[25px] to-[#1c1646] top-0 w-[424.924px]" />
    </div>
  );
}

function Group3() {
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

function Group4() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group1 />
    </div>
  );
}

export default function Group5() {
  return (
    <div className="relative size-full">
      <Group2 />
      <Group3 />
      <Group4 />
    </div>
  );
}
