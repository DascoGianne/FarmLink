import imgAddNew from "figma:asset/355238b429cd3e10ea73200a9851d3218e01a0a0.png";
import { OrdersButton } from './OrdersButton';

interface HeaderProps {
  currentTab: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS';
  onTabChange: (tab: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS') => void;
  onTabHover?: (tab: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS') => void;
  onAddClick: () => void;
  orderCount?: number;
  onOrdersClick?: () => void;
}

export function Header({ currentTab, onTabChange, onTabHover, onAddClick, orderCount, onOrdersClick }: HeaderProps) {
  return (
    <header className="bg-white">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <nav className="flex items-center px-2 md:px-6 py-3">
          <NavTab label="HOME" active={currentTab === 'HOME'} onClick={() => onTabChange('HOME')} onHover={() => onTabHover?.('HOME')} />
          <div className="w-0.5 h-8 md:h-12 bg-[#32a928] mx-2 md:mx-4"></div>
          <NavTab label="MARKETPLACE" active={currentTab === 'MARKETPLACE'} onClick={() => onTabChange('MARKETPLACE')} onHover={() => onTabHover?.('MARKETPLACE')} />
          <div className="w-0.5 h-8 md:h-12 bg-[#32a928] mx-2 md:mx-4"></div>
          <NavTab label="MY LISTINGS" active={currentTab === 'MY LISTINGS'} onClick={() => onTabChange('MY LISTINGS')} onHover={() => onTabHover?.('MY LISTINGS')} />
        </nav>
        
        {/* Add New Button - Only show on MY LISTINGS tab */}
        {currentTab === 'MY LISTINGS' && (
          <button 
            onClick={onAddClick}
            className="bg-[#32a928] hover:bg-[#2a8f21] transition rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        
        {/* Orders Button - Show on HOME and MARKETPLACE tabs */}
        {(currentTab === 'HOME' || currentTab === 'MARKETPLACE') && onOrdersClick && (
          <OrdersButton orderCount={orderCount || 0} onClick={onOrdersClick} />
        )}
      </div>
    </header>
  );
}

interface NavTabProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  onHover?: () => void;
}

function NavTab({ label, active, onClick, onHover }: NavTabProps) {
  return (
    <button onClick={onClick} onMouseEnter={onHover} className="relative hover:opacity-80 transition">
      <span className="text-2xl md:text-3xl font-bold text-[#32a928]">
        {label}
      </span>
      {active && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#32a928]" />
      )}
    </button>
  );
}
