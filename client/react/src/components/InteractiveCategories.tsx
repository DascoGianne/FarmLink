import Group52624 from '../imports/Group52624';

interface InteractiveCategoriesProps {
  selectedCategory: string | null;
  onCategoryClick: (category: string) => void;
}

export function InteractiveCategories({ selectedCategory, onCategoryClick }: InteractiveCategoriesProps) {
  // Category positions based on the Group52624 component structure
  // Each category has a center point and we'll create a clickable circle around it
  const categories = [
    { name: 'Grains', centerX: 88, centerY: 88, radius: 88 },
    { name: 'Fruits', centerX: 289, centerY: 88, radius: 88 },
    { name: 'Root Crops', centerX: 497.5, centerY: 88, radius: 88 },
    { name: 'Native', centerX: 706, centerY: 88, radius: 88 },
    { name: 'Spices', centerX: 912, centerY: 90, radius: 88 },
    { name: 'Vegetable', centerX: 1117.5, centerY: 88, radius: 88 },
    { name: 'Greens', centerX: 1318, centerY: 90, radius: 91.5 },
    { name: 'Exotic', centerX: 1524, centerY: 90, radius: 91.5 },
  ];

  return (
    <div className="relative w-full h-full">
      {/* The base Figma component */}
      <Group52624 />
      
      {/* Clickable overlays */}
      {categories.map((category) => (
        <div
          key={category.name}
          onClick={() => onCategoryClick(category.name)}
          className="absolute cursor-pointer transition-all"
          style={{
            left: `${category.centerX - category.radius}px`,
            top: `${category.centerY - category.radius}px`,
            width: `${category.radius * 2}px`,
            height: `${category.radius * 2}px`,
          }}
        >
          {/* Active indicator - Multiple layers for visibility */}
          {selectedCategory === category.name && (
            <>
              {/* Outer glow layer */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: '0 0 30px 8px rgba(50, 169, 40, 0.8)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              {/* Middle ring */}
              <div 
                className="absolute inset-0 rounded-full border-[6px] border-[#32a928]"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(50, 169, 40, 0.4)',
                }}
              />
              {/* Inner highlight */}
              <div 
                className="absolute inset-2 rounded-full bg-[#32a928] opacity-20"
              />
            </>
          )}
          
          {/* Hover effect for non-selected categories */}
          {selectedCategory !== category.name && (
            <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity" />
          )}
        </div>
      ))}
    </div>
  );
}