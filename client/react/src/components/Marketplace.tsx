import { Suspense, lazy, useState } from 'react';
import imgRectangle11156 from "figma:asset/0f8589cd70791ebebeaf31de502cefadf99c92b1.png";
import imgRectangle11157 from "figma:asset/575e8f4f0dcd856a1a9113a2690256047d8a2758.png";
import imgLeaf from "figma:asset/b2b29d891a360c1c20df9597a06fd413e7d10568.png";
import imgSearchIcon from "figma:asset/aa6a6e43946d0edcbb0f5fabe90744e85c1e432f.png";
import imgRectangle11167 from "figma:asset/c60e4047629d26be481eeb7017cf0680e11730c1.png";
import imgPechay from "figma:asset/4cf36c090dc95fd820e7af6536a55457d2e584e7.png";
import imgTomatoes from "figma:asset/0837261331ef66bc9544b4be2c51c261a3bf313e.png";
import { Listing } from './ListingsTable';
import { MarketplaceBadges } from './MarketplaceBadges';
const ViewListingModal = lazy(() =>
  import('./ViewListingModal').then((module) => ({ default: module.ViewListingModal }))
);
import Group52573 from '../imports/Group52573';
import Group52624 from '../imports/Group52624';
import { InteractiveCategories } from './InteractiveCategories';

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  price: string;
  oldPrice?: string;
  freshness?: string;
  totalStocks?: string;
  description?: string;
  address?: string;
  quantitiesAvailable?: string[];
  quantityPriceEntries?: {
    quantity: string;
    unit: string;
    price: string;
    originalPrice?: string;
  }[];
  badge?: string;
  isRescueDeal?: boolean;
  photos?: (string | null)[];
  ngoName?: string;
  farmerName?: string;
  promos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
}

interface MarketplaceProps {
  listings: Listing[];
}

export function Marketplace({ listings }: MarketplaceProps) {
  // Convert listings to products format
  const products: Product[] = listings.map(listing => ({
    id: listing.id,
    name: listing.name,
    image: listing.image,
    category: listing.category,
    price: listing.price,
    oldPrice: listing.oldPrice,
    freshness: listing.freshness || undefined,
    totalStocks: listing.totalStocks,
    description: listing.description,
    address: listing.address,
    ngoName: listing.ngoName,
    farmerName: listing.farmerName,
    quantitiesAvailable: listing.quantitiesAvailable,
    quantityPriceEntries: listing.quantityPriceEntries,
    photos: listing.photos,
    promos: {
      limitedStocks: listing.promos?.limitedStocks || false,
      freeShipping: listing.promos?.freeShipping || false,
      discount25: listing.promos?.discount25 || false,
      discount50: listing.promos?.discount50 || false,
    },
  })).sort((a, b) => b.id - a.id); // Sort by ID descending (newest first)

  // Hardcoded Rescue Deals
  const rescueDeals: Product[] = [
    {
      id: 9001,
      name: 'Pechay',
      image: imgPechay,
      category: 'Greens',
      price: '45.00',
      oldPrice: '60.00',
      freshness: '3.6',
      totalStocks: '50 kg',
      address: 'Benguet, La Trinidad',
      description: 'Fresh pechay that needs to be sold soon! These greens are still perfectly nutritious and delicious, but we need to clear them out quickly. Ideal for stir-fries, soups, or salads. Get this rescue deal and save 25% while helping reduce food waste! Perfect for sinigang, chopsuey, or any Filipino vegetable dish.',
      quantitiesAvailable: ['1kg', '5kg', '10kg'],
      quantityPriceEntries: [
        { quantity: '1', unit: 'kg', price: '45.00', originalPrice: '60' },
        { quantity: '5', unit: 'kg', price: '215.25', originalPrice: '287' },
        { quantity: '10', unit: 'kg', price: '410.25', originalPrice: '547' },
      ],
      isRescueDeal: true,
      ngoName: 'IKOLANDIA Agri. Assoc.',
      farmerName: 'Farmer Danilo Ramos',
      promos: {
        limitedStocks: false,
        freeShipping: false,
        discount25: true,
        discount50: false,
      },
    },
    {
      id: 9002,
      name: 'Tomato',
      image: imgTomatoes,
      category: 'Vegetable',
      price: '37.50',
      oldPrice: '75.00',
      freshness: '3.4',
      totalStocks: '80 kg',
      address: 'Nueva Ecija, San Isidro',
      description: 'Ripe tomatoes at rescue price! These tomatoes are at peak ripeness and need to be sold quickly before they become overripe. Still fresh and flavorful - perfect for making sauces, salsa, or cooking immediately. Great deal at 25% off! Ideal for menudo, afritada, caldereta, or fresh salads.',
      quantitiesAvailable: ['1kg', '3kg', '5kg'],
      quantityPriceEntries: [
        { quantity: '1', unit: 'kg', price: '37.50', originalPrice: '75' },
        { quantity: '5', unit: 'kg', price: '180.00', originalPrice: '360' },
        { quantity: '10', unit: 'kg', price: '340.00', originalPrice: '680' },
      ],
      isRescueDeal: true,
      ngoName: 'Green Earth NGO',
      farmerName: 'Farmer Name',
      promos: {
        limitedStocks: false,
        freeShipping: false,
        discount25: false,
        discount50: true,
      },
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle category click - toggle filter on/off
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // Clicking the same category again removes the filter
      setSelectedCategory(null);
    } else {
      // Select the new category
      setSelectedCategory(category);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesSearch = (product: Product) => {
    if (!normalizedQuery) return true;
    return [
      product.name,
      product.category,
      product.address,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
  };

  // Filter products and rescue deals based on selected category + search
  const filteredProducts = (selectedCategory ? products.filter(p => p.category === selectedCategory) : products)
    .filter(matchesSearch);

  const filteredRescueDeals = (selectedCategory ? rescueDeals.filter(p => p.category === selectedCategory) : rescueDeals)
    .filter(matchesSearch);

  return (
    <div className="w-full">
      {/* Banner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Large Banner */}
        <div className="lg:col-span-2 relative h-[200px] lg:h-[247px] rounded-[10px] overflow-hidden shadow-lg">
          <img 
            src={imgRectangle11156} 
            alt="Rice Terraces" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h2 className="text-white text-4xl lg:text-6xl xl:text-7xl font-['Amatic_SC'] font-bold mb-2 drop-shadow-lg">
              Taste the Gold of the Terraces
            </h2>
            <p className="text-white text-lg lg:text-2xl xl:text-3xl font-['Amatic_SC'] font-bold">
              RICE DIRECTLY FROM THE terraces in the Cordillera region
            </p>
          </div>
        </div>

        {/* Right Column - Search Bar and Small Banner */}
        <div className="flex flex-col gap-4">
          {/* Search Bar - Standalone */}
          <div className="relative">
            {/* Colorful glow effect behind search */}
            <div className="absolute -inset-3 blur-[20px] opacity-50 rounded-[20px]">
              <img 
                alt="" 
                className="w-full h-full object-cover" 
                src={imgRectangle11167} 
              />
            </div>
            {/* White search box */}
            <div className="relative bg-white rounded-[15px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] flex items-center px-4 py-3">
              <img 
                src={imgSearchIcon} 
                alt="Search" 
                className="w-[24px] h-[24px] mr-3 flex-shrink-0 opacity-60" 
              />
              <input
                type="text"
                placeholder="Search Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#9ca3af] text-[16px] font-['Poppins'] font-normal placeholder:text-[#9ca3af]"
              />
            </div>
          </div>

          {/* Small Banner - Separate */}
          <div className="relative flex-1 min-h-[164px] rounded-[10px] overflow-hidden shadow-lg">
            <img 
              src={imgRectangle11157} 
              alt="Super Fruit" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <h3 className="text-white text-2xl lg:text-3xl xl:text-4xl font-['Amatic_SC'] font-bold text-center drop-shadow-lg">
                Heard of this SUPER FRUIT?!
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Rescue Deals Section */}
      <div className="mb-12">
        <h2 className="text-[#32a928] text-2xl font-bold mb-6">Rescue Deals!!!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredRescueDeals.map((product) => (
            <ProductCard key={product.id} product={product} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
      </div>

      {/* Listings Section */}
      <div className="mb-12">
        <h2 className="text-[#32a928] text-2xl font-bold mb-6">Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-[#32a928] text-2xl font-bold mb-6">Categories</h2>
        <div className="w-full">
          <div className="relative w-full max-w-[1400px]" style={{ height: '180px' }}>
            <div className="absolute inset-0">
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                <InteractiveCategories 
                  selectedCategory={selectedCategory} 
                  onCategoryClick={handleCategoryClick} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Listing Modal */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ViewListingModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </Suspense>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  setSelectedProduct: (product: Product | null) => void;
}

function ProductCard({ product, setSelectedProduct }: ProductCardProps) {
  // Scale for badges (same as promo badges)
  const scale = 1;
  const flashSaleWidth = 147.428 * scale;
  const flashSaleHeight = 20.202 * scale;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group cursor-pointer" onClick={() => setSelectedProduct(product)}>
      {/* Product Image */}
      <div className="relative bg-gray-50 py-6 px-4 h-[200px] flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain"
        />
        
        {/* Promo Badges - positioned at bottom-left */}
        <MarketplaceBadges promos={product.promos} />
        
        {/* Flash Sale Badge - positioned at top-right for rescue deals */}
        {product.isRescueDeal && (
          <div 
            className="absolute right-0 top-0 origin-top-right" 
            style={{ 
              transform: `scale(${scale})`,
              width: `${flashSaleWidth}px`,
              height: `${flashSaleHeight}px`
            }}
          >
            <Group52573 />
          </div>
        )}
        
        {product.freshness && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
            <img src={imgLeaf} alt="Leaf" className="w-3 h-3" />
            <span className="text-xs font-bold text-[#32a928]">{product.freshness}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-[rgb(0,0,0)] font-bold text-sm mb-1">{product.name}</h3>
        <p className="text-gray-600 text-xs mb-2">{product.address || '-'}</p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          {product.oldPrice && (
            <span className="text-gray-400 text-xs line-through">₱{product.oldPrice}</span>
          )}
          <span className="text-black font-bold text-sm">₱{product.price}</span>
        </div>
      </div>
    </div>
  );
}
