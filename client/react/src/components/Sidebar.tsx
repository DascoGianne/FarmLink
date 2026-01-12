import imgFarmlinkLogo from "figma:asset/8dd172e5553a887b7dccdd063f0aeab48ca479e2.png";
import imgLogoToggle from "figma:asset/be1c494da78f298ce58620707ad2a117719e489a.png";
import imgLogoGlow from "figma:asset/c60e4047629d26be481eeb7017cf0680e11730c1.png";
import imgHeaderBg from "figma:asset/3e2b823e8f438f7494b005246a9a1a38abf53005.png";
import imgEllipse971 from "figma:asset/c92ba9aa109a5878878d4b7f1c4ffdc614c72770.png";
import imgSearch from "figma:asset/aa6a6e43946d0edcbb0f5fabe90744e85c1e432f.png";
import imgUserMale from "figma:asset/bccec939e6cd4bbc393117fb1103f348eddcfd02.png";
import imgListView from "figma:asset/0b57bc8fc9b04a1ac518fad357f49032214fb59e.png";
import imgMyOrders from "figma:asset/ba4478b997a157421a73c1cfc35928d2700f81ef.png";
import imgOnlineStore from "figma:asset/89fe1b41e38a01e1a4328a96a7808268c78476a2.png";
import imgAbout from "figma:asset/d848a8cca1bc0b4033e52f65951796c1d0ec01c9.png";
import imgSiren from "figma:asset/216bfe68de88ff964fafafb887752215d5d040c4.png";
import imgLeaf from "figma:asset/b2b29d891a360c1c20df9597a06fd413e7d10568.png";
import imgTermsAndConditions from "figma:asset/0872e9d3fb5a3b389d6a2bab1e4023b49d8ae96d.png";

interface SidebarProps {
  currentTab?: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS';
  onTabChange?: (tab: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS') => void;
  onTabHover?: (tab: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS') => void;
  orderCount?: number;
  onLogout?: () => void;
  accountName?: string;
}

export function Sidebar({ currentTab, onTabChange, onTabHover, orderCount, onLogout, accountName }: SidebarProps) {
  const resolveStaticUrl = (path: string) => {
    if (typeof window === 'undefined') return path;
    const { protocol, hostname, port } = window.location;
    if (port === '5173') {
      return `${protocol}//${hostname}:3000${path}`;
    }
    return `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;
  };

  const buyerBase = "/client/views/layouts/Home page - Buyer";
  return (
    <aside className="hidden lg:flex flex-col w-[240px] xl:w-[280px] bg-[#f2f2f2] h-screen sticky top-0 shadow-[4px_0_10px_0px_rgba(0,0,0,0.1)]">
      {/* Header with Logo */}
      <div className="w-full">
        <img 
          src={imgFarmlinkLogo} 
          alt="FarmLink" 
          className="w-full h-auto block"
        />
      </div>

      <div className="px-5 pb-4 flex-1 flex flex-col overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          {/* Colorful glow effect behind search */}
          <div className="absolute -inset-3 blur-[20px] opacity-50 rounded-full">
            <img 
              alt="" 
              className="w-full h-full object-cover" 
              src={imgLogoGlow} 
            />
          </div>
          {/* White search box */}
          <div className="relative bg-white rounded-full shadow-md flex items-center px-4 py-2.5 border-2 border-[#32a928]">
            <img src={imgSearch} alt="Search" className="w-4 h-4 text-[#32a928]" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 ml-3 outline-none text-gray-600 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Account Section */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Account</p>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={imgEllipse971}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-sm font-bold text-[#32a928]">{accountName || 'NGO Account'}</h2>
          </div>
        </div>

        {/* Main Menu */}
        <div className="mb-4 flex-1">
          <p className="text-xs text-gray-400 mb-2">Main Menu</p>
          <nav className="space-y-1">
            <MenuItem icon={imgUserMale} label="My Account" href="/client/views/layouts/Home page - NGO/MyProfile.html" />
            <MenuItem icon={imgListView} label="My Listings" active={currentTab === 'MY LISTINGS'} onClick={() => onTabChange?.('MY LISTINGS')} onHover={() => onTabHover?.('MY LISTINGS')} />
            <MenuItem icon={imgMyOrders} label="My Orders" active={currentTab === 'ORDERS'} onClick={() => onTabChange?.('ORDERS')} onHover={() => onTabHover?.('ORDERS')} badge={orderCount ? String(orderCount) : undefined} />
            <MenuItem icon={imgOnlineStore} label="Marketplace" active={currentTab === 'MARKETPLACE'} onClick={() => onTabChange?.('MARKETPLACE')} onHover={() => onTabHover?.('MARKETPLACE')} />
            <MenuItem icon={imgAbout} label="About FarmLink" href={resolveStaticUrl(`${buyerBase}/about.html`)} />
            <MenuItem icon={imgSiren} label="What is Rescue Alert" href={resolveStaticUrl(`${buyerBase}/Rescue.html`)} />
            <MenuItem icon={imgLeaf} label="What is Freshness Rating" href={resolveStaticUrl(`${buyerBase}/Rating.html`)} />
            <MenuItem icon={imgTermsAndConditions} label="Terms and Conditions" href={resolveStaticUrl(`${buyerBase}/Terms.html`)} />
          </nav>
        </div>

        {/* Bottom Buttons - Anchored to bottom */}
        <div className="mt-auto">
          {/* Create New Account Button */}
          <a
            href={resolveStaticUrl("/client/views/layouts/Sign-up-optionn.html")}
            className="w-full bg-[#ededed] text-gray-600 font-semibold py-2.5 rounded-lg mb-2 hover:bg-gray-300 transition text-sm text-center block"
          >
            Create New Account
          </a>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full bg-[#5eb14e] text-white font-bold py-2.5 rounded-lg hover:bg-[#4a9c3c] transition text-sm"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

interface MenuItemProps {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
  onClick?: () => void;
  onHover?: () => void;
}

function MenuItem({ icon, label, active, badge, href, onClick, onHover }: MenuItemProps) {
  const className = `
        flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
        transition-colors relative
        ${active ? 'bg-white shadow-sm' : 'hover:bg-white hover:bg-opacity-50'}
      `;

  const content = (
    <>
      <img src={icon} alt={label} className="w-5 h-5" />
      <span className="text-[#32a928] text-sm font-medium">{label}</span>
      {badge && (
        <div className="ml-auto bg-[#2fab17] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
          {badge}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} onMouseEnter={onHover}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`${className} w-full text-left bg-transparent border-0`}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {content}
    </button>
  );
}
