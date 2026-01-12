import Group52354 from '../imports/Group52354-66-349'; // LIMITED STOCKS
import Group52353 from '../imports/Group52353'; // FREE SHIPPING
import Group52352New from '../imports/Group52352-66-383'; // 25% OFF (new design)
import Group52352 from '../imports/Group52352'; // 50% OFF

interface MarketplaceBadgesProps {
  promos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
}

export function MarketplaceBadges({ promos }: MarketplaceBadgesProps) {
  if (!promos) return null;

  const hasAnyPromo = promos.limitedStocks || promos.freeShipping || 
                       promos.discount25 || promos.discount50;

  if (!hasAnyPromo) return null;

  // Smaller scale for marketplace cards
  const scale = 0.44;
  const containerWidth = 519.61 * scale;
  const containerHeight = 45.841 * scale;

  return (
    <div className="absolute bottom-0 left-0" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
      {/* All badges at the same position (0, 0) with z-index for layering */}
      {/* Order from bottom to top: 50% OFF -> 25% OFF -> FREE SHIPPING -> LIMITED STOCKS */}
      
      {/* 50% OFF - Bottom layer (z-index: 10) */}
      {promos.discount50 && (
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
      {promos.discount25 && (
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
      {promos.freeShipping && (
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
      {promos.limitedStocks && (
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
