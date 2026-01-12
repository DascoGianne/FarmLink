import Group52354 from '../imports/Group52354-66-349'; // LIMITED STOCKS
import Group52353 from '../imports/Group52353'; // FREE SHIPPING
import Group52352New from '../imports/Group52352-66-383'; // 25% OFF (new design)
import Group52352 from '../imports/Group52352'; // 50% OFF
import Group52616 from '../imports/Group52616-66-500'; // ADDING PROMOS placeholder

interface PromoBadgesProps {
  selectedPromos: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
  showPlaceholder?: boolean; // Optional prop - defaults to true for MY LISTINGS compatibility
}

export function PromoBadges({ selectedPromos, showPlaceholder = true }: PromoBadgesProps) {
  const hasAnyPromo = selectedPromos.limitedStocks || selectedPromos.freeShipping || 
                       selectedPromos.discount25 || selectedPromos.discount50;

  // Scale for all badges
  const scale = 0.7;
  const containerWidth = 519.61 * scale;
  const containerHeight = 45.841 * scale;

  // If no badges selected, show placeholder only if showPlaceholder is true
  if (!hasAnyPromo) {
    if (!showPlaceholder) {
      return null; // For MARKETPLACE - show nothing
    }
    return (
      <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ 
          transform: `scale(${scale})`,
          width: '519.61px',
          height: '45.841px'
        }}>
          <Group52616 />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
      {/* All badges at the same position (0, 0) with z-index for layering */}
      {/* Order from bottom to top: 50% OFF -> 25% OFF -> FREE SHIPPING -> LIMITED STOCKS */}
      
      {/* 50% OFF - Bottom layer (z-index: 10) */}
      {selectedPromos.discount50 && (
        <div className="absolute left-0 top-0 origin-top-left" style={{ 
          zIndex: 10,
          transform: `scale(${scale})`,
          width: '519.61px',
          height: '45.841px'
        }}>
          <Group52352 />
        </div>
      )}
      
      {/* 25% OFF - Second layer (z-index: 20) */}
      {selectedPromos.discount25 && (
        <div className="absolute left-0 top-0 origin-top-left" style={{ 
          zIndex: 20,
          transform: `scale(${scale})`,
          width: '519.61px',
          height: '45.841px'
        }}>
          <Group52352New />
        </div>
      )}
      
      {/* FREE SHIPPING - Third layer (z-index: 30) */}
      {selectedPromos.freeShipping && (
        <div className="absolute left-0 top-0 origin-top-left" style={{ 
          zIndex: 30,
          transform: `scale(${scale})`,
          width: '424.924px',
          height: '45.841px'
        }}>
          <Group52353 />
        </div>
      )}
      
      {/* LIMITED STOCKS - Top layer (z-index: 40) */}
      {selectedPromos.limitedStocks && (
        <div className="absolute left-0 top-0 origin-top-left" style={{ 
          zIndex: 40,
          transform: `scale(${scale})`,
          width: '164.08px',
          height: '45.841px'
        }}>
          <Group52354 />
        </div>
      )}
    </div>
  );
}