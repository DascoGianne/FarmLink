export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[20px] left-0 rounded-bl-[5px] rounded-br-[5px] rounded-tr-[15px] top-0 w-[248px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 248 20\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(34.05 -0.3 0.076377 8.6688 -92.5 13)\\\'><stop stop-color=\\\'rgba(251,212,70,1)\\\' offset=\\\'0.64087\\\'/><stop stop-color=\\\'rgba(252,164,52,1)\\\' offset=\\\'0.73065\\\'/><stop stop-color=\\\'rgba(253,116,35,1)\\\' offset=\\\'0.82043\\\'/><stop stop-color=\\\'rgba(254,69,17,1)\\\' offset=\\\'0.91022\\\'/><stop stop-color=\\\'rgba(254,45,9,1)\\\' offset=\\\'0.95511\\\'/><stop stop-color=\\\'rgba(255,21,0,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }} />
      <p className="absolute bg-clip-text font-['Teko',sans-serif] font-medium h-[20px] leading-[normal] left-[204px] text-[0px] top-0 w-[47px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(104.56deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
        <span className="text-[16px]">{`25% `}</span>
        <span className="bg-clip-text text-[10px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(104.56deg, rgb(255, 255, 255) 18.773%, rgb(230, 92, 26) 97.512%)" }}>
          OFF
        </span>
      </p>
    </div>
  );
}
