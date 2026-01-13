import imgHeroImage from "figma:asset/7780ab19259eb47755557109017c22660b87e305.png";
import img3DLink from "figma:asset/be1c494da78f298ce58620707ad2a117719e489a.png";
import imgTomato from "figma:asset/9266bf2c93dc5d79b53e68007d0881f86fc1109a.png";
import imgBellPepper from "figma:asset/50267485564013475399ace9403f448ae5364ce9.png";
import imgGrapes from "figma:asset/243df2e9dbbe1e34ff018c87f70694fc4b325b93.png";
import imgOnlineStore from "figma:asset/89fe1b41e38a01e1a4328a96a7808268c78476a2.png";
import imgListView from "figma:asset/0b57bc8fc9b04a1ac518fad357f49032214fb59e.png";
import imgPurchaseOrder from "figma:asset/ba4478b997a157421a73c1cfc35928d2700f81ef.png";
import imgCoconut from "figma:asset/f001c34ca8b61d98f366eba998cd2b5daf4e4e24.png";
import svgPaths from "../imports/svg-964m6s4oud";

interface HomePageProps {
  onNavigateToMarketplace: () => void;
  onNavigateToOrders: () => void;
  onNavigateToListings: () => void;
}

export function HomePage({
  onNavigateToMarketplace,
  onNavigateToOrders,
  onNavigateToListings,
}: HomePageProps) {
  // Adjustable background settings
  const backgroundYPosition = -165; // Adjust Y position (negative moves up, positive moves down)
  const backgroundScale = 0.76; // Adjust scale (1 = original size, 1.5 = 150%, etc.)

  const resolveStaticUrl = (path: string) => {
    if (typeof window === 'undefined') return path;
    const { protocol, hostname, port } = window.location;
    if (port === '5173') {
      return `${protocol}//${hostname}:3000${path}`;
    }
    return `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-white">
      {/* Full Page Background - Anchored to Right */}
      <div
        className="absolute right-0 pointer-events-none z-0"
        style={{
          top: `${backgroundYPosition}px`,
          transform: `scale(${backgroundScale})`,
          transformOrigin: "right center",
          width: "1382.531px",
          height: "1157px",
        }}
      >
        {/* Radial Gradient 1 */}
        <div className="absolute h-[816.654px] left-0 top-[341.35px] w-[1382.531px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1382.53 816.654"
          >
            <path
              d={svgPaths.p7c21c70}
              fill="url(#paint0_radial_172_783)"
            />
            <defs>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="matrix(945.07 487.712 -335.284 691.484 973.979 254.821)"
                gradientUnits="userSpaceOnUse"
                id="paint0_radial_172_783"
                r="1"
              >
                <stop
                  offset="0.213474"
                  stopColor="#D9D9D9"
                  stopOpacity="0"
                />
                <stop offset="0.451459" stopColor="#A2E043" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Radial Gradient 2 */}
        <div className="absolute h-[816.654px] left-0 top-[341.35px] w-[1382.531px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1382.53 816.654"
          >
            <path
              d={svgPaths.p7c21c70}
              fill="url(#paint0_radial_172_773)"
            />
            <defs>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="matrix(1234.58 -436.397 700.076 2107.91 147.946 494.729)"
                gradientUnits="userSpaceOnUse"
                id="paint0_radial_172_773"
                r="1"
              >
                <stop
                  offset="0.644157"
                  stopColor="#25A218"
                  stopOpacity="0"
                />
                <stop offset="0.795081" stopColor="#25A218" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Hero Background Image */}
        <div className="absolute h-[1157px] left-0 top-0 w-[1382.531px]">
          <img
            alt=""
            className="block max-w-none size-full object-cover"
            src={imgHeroImage}
          />
        </div>

        {/* Radial Gradient 3 */}
        <div className="absolute h-[816.654px] left-0 top-[341.35px] w-[1382.531px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1382.53 816.654"
          >
            <path
              d={svgPaths.p7c21c70}
              fill="url(#paint0_radial_172_755)"
            />
            <defs>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="matrix(200.663 1070.6 -1717.47 342.609 1071.76 -180.26)"
                gradientUnits="userSpaceOnUse"
                id="paint0_radial_172_755"
                r="1"
              >
                <stop
                  offset="0.644157"
                  stopColor="#25A218"
                  stopOpacity="0"
                />
                <stop offset="0.795081" stopColor="#25A218" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mt-0">
            {/* Left Side - Welcome Content */}
            <div className="space-y-6 -mt-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight whitespace-nowrap">
                <span className="text-gray-800">
                  Welcome to{" "}
                </span>
                <span className="text-[#32a928]">FarmLink</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 italic font-medium">
                Your direct connection to consumers, sure buyers
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed font-bold font-normal italic">
                Get in touch with the consumers and make loyal
                customers and strong farmer-to-buyer
                relationships with just a few clicks.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={onNavigateToMarketplace}
                  className="bg-[#32a928] hover:bg-[#2a8f21] text-white font-semibold px-[60px] py-[12px] rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  Explore Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = resolveStaticUrl("/client/views/layouts/Home page - Buyer/about.html");
                  }}
                  className="bg-white hover:bg-gray-50 text-[#32a928] font-semibold px-[60px] py-[12px] rounded-full border-2 border-[#32a928] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  Learn About FarmLink
                </button>
              </div>
            </div>

            {/* Right Side - Floating Icons */}
            <div className="relative h-[400px] md:h-[500px] hidden lg:block">
              {/* 3D Link Icon */}
              <div className="absolute top-8 left-16 w-40 md:w-56 h-40 md:h-56 z-20">
                <img
                  src={img3DLink}
                  alt="FarmLink 3D"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            
              {/* Floating Category Icons */}
            
              {/* Grapes - Top Right (glow ring) */}
              <div className="absolute top-4 right-36 z-20">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                  {/* glow */}
                  <div className="absolute -inset-1 rounded-full blur-md bg-[#BEED65]/70" />
                  {/* white circle */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-md overflow-hidden flex items-center justify-center">
                    <img
                      src={imgGrapes}
                      alt="Grapes"
                      className="w-35 h-35 object-contain p-2"
                    />
                  </div>
                </div>
              </div>
            
              {/* Tomato - Middle Right (glow ring) */}
              <div className="absolute top-[calc(25%+4rem)] right-0 z-20">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center">
                  {/* glow */}
                  <div className="absolute -inset-1 rounded-full blur-md bg-[#B9E84E]/70" />
              
                  {/* white circle */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-md overflow-hidden flex items-center justify-center">
                    <img
                      src={imgTomato}
                      alt="Tomato"
                      className="max-w-35 max-h-35 object-contain p-2"
                    />
                  </div>
                </div>
              </div>
                          
              {/* Bell Pepper - Middle Left (glow ring) */}
              <div className="absolute top-[calc(66.67%+2rem)] -left-16 z-20">
                <div className="relative w-22 h-22 md:w-26 md:h-26 rounded-full flex items-center justify-center">
                  {/* glow */}
                  <div className="absolute -inset-1 rounded-full blur-md bg-[#33AB17]/60" />
                  {/* white circle */}
                  <div className="relative w-18 h-18 md:w-22 md:h-22 bg-white rounded-full shadow-md overflow-hidden flex items-center justify-center">
                    <img
                      src={imgBellPepper}
                      alt="Bell Pepper"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Let's Get Started Section */}
        <div className="relative px-8 md:px-12 lg:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#65CB1C] mb-8 md:mb-12 flex items-center gap-4">
              <span className="italic">
                Let's Get Started !
              </span>
            </h2>

            {/* Three Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Browse Marketplace Card */}
              <div
                onClick={onNavigateToMarketplace}
                className="group relative bg-white rounded-[40px] md:rounded-[60px] p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-[#32a928]/20 hover:border-[#32a928] hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img
                      src={imgOnlineStore}
                      alt="Browse Marketplace"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#32a928]">
                    Browse Marketplace
                  </h3>
                  <p className="text-[#32a928] italic font-medium text-xs md:text-sm">
                    Explore the market of your fellow local
                    farmers and growers
                  </p>
                </div>
              </div>

              {/* View My Orders Card */}
              <div
                onClick={onNavigateToOrders}
                className="group relative bg-white rounded-[40px] md:rounded-[60px] p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-[#32a928]/20 hover:border-[#32a928] hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img
                      src={imgPurchaseOrder}
                      alt="View Orders"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#32a928]">
                    View My Orders
                  </h3>
                  <p className="text-[#32a928] italic font-medium text-xs md:text-sm">
                    Check your incoming orders
                  </p>
                </div>
              </div>

              {/* View My Listings Card */}
              <div
                onClick={onNavigateToListings}
                className="group relative bg-white rounded-[40px] md:rounded-[60px] p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-[#32a928]/20 hover:border-[#32a928] hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img
                      src={imgListView}
                      alt="View Listings"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#32a928]">
                    View My Listings
                  </h3>
                  <p className="text-[#32a928] italic font-medium text-xs md:text-sm">
                    Create, Update and Delete your crops
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
