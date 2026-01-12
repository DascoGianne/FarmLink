function Group2() {
  return (
    <div className="absolute contents left-[2.1px] top-0">
      <div className="absolute h-[45.841px] left-[2.1px] rounded-bl-[5px] rounded-br-[5px] rounded-tr-[25px] top-0 w-[519.61px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 519.61 45.841\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(71.342 -0.68761 0.16003 19.869 -193.81 29.797)\\\'><stop stop-color=\\\'rgba(255,255,255,1)\\\' offset=\\\'0.64087\\\'/><stop stop-color=\\\'rgba(223,223,223,1)\\\' offset=\\\'0.68576\\\'/><stop stop-color=\\\'rgba(191,191,191,1)\\\' offset=\\\'0.73065\\\'/><stop stop-color=\\\'rgba(159,159,159,1)\\\' offset=\\\'0.77554\\\'/><stop stop-color=\\\'rgba(128,128,128,1)\\\' offset=\\\'0.82043\\\'/><stop stop-color=\\\'rgba(96,96,96,1)\\\' offset=\\\'0.86533\\\'/><stop stop-color=\\\'rgba(64,64,64,1)\\\' offset=\\\'0.91022\\\'/><stop stop-color=\\\'rgba(48,48,48,1)\\\' offset=\\\'0.93266\\\'/><stop stop-color=\\\'rgba(32,32,32,1)\\\' offset=\\\'0.95511\\\'/><stop stop-color=\\\'rgba(16,16,16,1)\\\' offset=\\\'0.97755\\\'/><stop stop-color=\\\'rgba(8,8,8,1)\\\' offset=\\\'0.98878\\\'/><stop stop-color=\\\'rgba(0,0,0,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }} />
      <p className="absolute bg-clip-text font-['Teko',sans-serif] font-medium h-[29px] leading-[normal] left-[422px] text-[0px] top-[5.72px] w-[212px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90.0969deg, rgb(0, 0, 0) 12.508%, rgb(193, 193, 193) 31.079%)" }}>
        <span className="text-[30px]">{`CHECK `}</span>
        <span className="text-[16px]">HERE</span>
      </p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-px top-0">
      <div className="absolute bg-gradient-to-r from-white h-[45.841px] left-px rounded-bl-[5px] rounded-tr-[25px] to-black top-0 w-[414px]" />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-px top-0">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-gradient-to-r from-[#c8c8c8] h-[45.841px] left-0 rounded-bl-[5px] rounded-tr-[25px] to-[#031103] top-0 w-[164.08px]" />
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[37.225%] from-black h-[35px] leading-[normal] left-[4px] text-[30px] to-[#c1c1c1] to-[50.551%] top-[4.72px] w-[160px]" style={{ WebkitTextFillColor: "transparent" }}>
        ADDING PROMOS
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
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Teko',sans-serif] font-medium from-[37.225%] from-black h-[30px] leading-[normal] left-[181px] text-[30px] to-[#c1c1c1] to-[50.551%] top-[4.72px] w-[212px]" style={{ WebkitTextFillColor: "transparent" }}>
        FOR ADVERTISEMENT
      </p>
    </div>
  );
}
