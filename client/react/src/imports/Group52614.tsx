import imgRectangle11386 from "figma:asset/364807345685588370ef0db7efdd7992085e10bd.png";
import imgRectangle11398 from "figma:asset/92dba10b5578a3177cec9685959d4ea0704eb4a6.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[52px] left-0 top-0 w-[300px]">
        <img alt="" className="block max-w-none size-full" height="52" src={imgRectangle11386} width="300" />
      </div>
      <div className="absolute h-[42px] left-[5px] top-[5px] w-[77px]">
        <img alt="" className="block max-w-none size-full" height="42" src={imgRectangle11398} width="77" />
      </div>
      <div className="absolute h-[42px] left-[88px] top-[5px] w-[77px]">
        <img alt="" className="block max-w-none size-full" height="42" src={imgRectangle11398} width="77" />
      </div>
    </div>
  );
}