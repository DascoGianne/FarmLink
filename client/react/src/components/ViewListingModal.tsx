import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import imgHeaderBgRated from "figma:asset/10e6621269cc669b206bb9a0fb1f9f70249b00bc.png";
import imgHeaderBg from "figma:asset/f394064e8a6ce0cfed98517b9c37405371194eb2.png";
import imgLeaf from "figma:asset/b2b29d891a360c1c20df9597a06fd413e7d10568.png";
import imgEllipse971 from "figma:asset/ff1c3364a0ea8b0d0477ee0221561c76294067da.png";
import { PromoBadges } from './PromoBadges';
import Group52573 from '../imports/Group52573';

interface QuantityPriceEntry {
  quantity: string;
  unit: string;
  price: string;
  originalPrice?: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  price: string;
  oldPrice?: string;
  freshness?: string;
  description?: string;
  totalStocks?: string;
  quantitiesAvailable?: string[];
  quantityPriceEntries?: QuantityPriceEntry[];
  isRescueDeal?: boolean;
  photos?: (string | null)[];
  ngoName?: string;
  farmerName?: string;
  address?: string;
  promos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
}

interface ViewListingModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ViewListingModal({ product, onClose }: ViewListingModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantityIndex, setSelectedQuantityIndex] = useState(0);
  
  if (!product) return null;

  // Create an array of images from the photos array, filtering out nulls
  // If no photos array or all null, use the main product image
  const images = product.photos && product.photos.some(photo => photo !== null)
    ? product.photos.filter((photo): photo is string => photo !== null)
    : [product.image];
  
  const hasFreshness = product.freshness && parseFloat(product.freshness) > 0;
  const freshnessRating = hasFreshness ? parseFloat(product.freshness) : 0;
  const flashSaleBaseWidth = 147.428;
  const flashSaleBaseHeight = 20.202;
  const flashSaleScale = (45.841 * 0.7) / flashSaleBaseHeight;

  // Get the current price based on selected quantity
  const getCurrentPrice = () => {
    if (product.quantityPriceEntries && product.quantityPriceEntries.length > 0) {
      return product.quantityPriceEntries[selectedQuantityIndex]?.price || product.price;
    }
    return product.price;
  };

  // Get original price for rescue deals from stored originalPrice
  const getOriginalPrice = () => {
    if (!product.isRescueDeal) return null;
    
    // Check if we have quantityPriceEntries with originalPrice
    if (product.quantityPriceEntries && product.quantityPriceEntries.length > 0) {
      const entry = product.quantityPriceEntries[selectedQuantityIndex];
      if (entry?.originalPrice) {
        return entry.originalPrice;
      }
    }
    
    // Fallback to product.oldPrice if no specific entry found
    return product.oldPrice || null;
  };

  const getPromoBadges = () => {
    const original = getOriginalPrice() || product.oldPrice;
    const current = getCurrentPrice();
    const originalValue = original ? Number(String(original).replace(/[^\d.]/g, '')) : NaN;
    const currentValue = current ? Number(String(current).replace(/[^\d.]/g, '')) : NaN;
    let discount25 = false;
    let discount50 = false;

    if (Number.isFinite(originalValue) && originalValue > 0 && Number.isFinite(currentValue)) {
      const pct = Math.round((1 - currentValue / originalValue) * 100);
      discount25 = pct === 25;
      discount50 = pct === 50;
    }

    return {
      limitedStocks: product.promos?.limitedStocks || false,
      freeShipping: product.promos?.freeShipping || false,
      discount25: product.promos?.discount25 || discount25,
      discount50: product.promos?.discount50 || discount50,
    };
  };

  const formatHarvestDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-[20px] shadow-[2px_3px_10px_0px_rgba(0,0,0,0.25)] w-full max-w-[920px] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-1 z-30 text-white hover:text-gray-200 transition p-2 cursor-pointer"
        >
          <X size={32} strokeWidth={3} />
        </button>

        {/* Header with Freshness Rating */}
        {hasFreshness ? (
          <div className="relative h-[130px] rounded-t-[20px] overflow-hidden">
            {/* Background Image */}
            <img 
              src={imgHeaderBgRated} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-between h-full px-8">
              {/* Left - Leaf and Rating */}
              <div className="flex items-center gap-4">
                <img 
                  src={imgLeaf} 
                  alt="Leaf" 
                  className="w-[70px] h-[70px] drop-shadow-lg brightness-0 invert" 
                />
                <div className="text-white text-[80px] font-bold leading-none">
                  {freshnessRating.toFixed(1)}
                </div>
              </div>

              {/* Center - Title and Subtitle */}
              <div className="flex-1 flex flex-col items-center">
                <p className="text-white text-[18px] font-bold tracking-wide mb-1">
                  Freshness Rating By FarmLink
                </p>
                <p className="text-white text-[12px] italic">
                  *Consume within five days for best taste.
                </p>
              </div>

              {/* Right - Harvest Date */}
              <div className="flex items-center gap-3">
                <img 
                  src={imgLeaf} 
                  alt="Calendar" 
                  className="w-[50px] h-[50px] brightness-0 invert opacity-80" 
                />
                <div className="text-right">
                  <p className="text-white text-[14px] font-bold tracking-wide">
                    HARVEST DATE:
                  </p>
                  <p className="text-white text-[24px] font-bold leading-tight">
                    {formatHarvestDate()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[130px] rounded-t-[20px] overflow-hidden">
            {/* Background Image without rating */}
            <img 
              src={imgHeaderBg} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-6 px-8 py-6">
          {/* Left Column - Image Gallery */}
          <div className="w-[440px] shrink-0">
            <div className="flex flex-col gap-4">
              {/* Main Image Display */}
              <div className="relative bg-white rounded-[8px] h-[540px] flex items-center justify-center overflow-hidden">
                {/* Product Image */}
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-8"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition z-20 cursor-pointer"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition z-20 cursor-pointer"
                    >
                      <ChevronRight size={24} className="text-gray-700" />
                    </button>
                  </>
                )}

              {/* Promo Badges - Bottom Left */}
              {getPromoBadges() && (
                <div className="absolute bottom-4 left-4 z-20">
                  <PromoBadges selectedPromos={getPromoBadges()} showPlaceholder={false} />
                </div>
              )}

              {/* Flash Sale Badge - Top Right */}
              {product.isRescueDeal && (
                <div
                  className="absolute right-0 top-0 origin-top-right z-20"
                  style={{
                    transform: `scale(${flashSaleScale})`,
                    width: `${flashSaleBaseWidth}px`,
                    height: `${flashSaleBaseHeight}px`,
                  }}
                >
                  <Group52573 />
                </div>
              )}
            </div>

              {/* Thumbnail Gallery - Centered at bottom */}
              <div className="flex gap-3 justify-center">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-[60px] h-[60px] rounded-[8px] border-2 transition overflow-hidden cursor-pointer ${
                      currentImageIndex === index 
                        ? 'border-[#32a928] border-[3px]' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex-1 flex flex-col">
            {/* Profile Section */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-[60px] h-[60px] bg-[#9bdc8c] rounded-full flex items-center justify-center shrink-0">
                <img 
                  src={imgEllipse971} 
                  alt="Farmer" 
                  className="w-[50px] h-[50px] rounded-full" 
                />
              </div>
              <div>
                <h3 className="text-[#32a928] text-[20px] font-bold leading-tight mb-0.5">
                  {product.ngoName || 'NGO Account'}
                </h3>
                <p className="text-[#6b6b6b] text-[14px] font-semibold leading-tight mb-0.5">
                  {product.farmerName || 'Farmer Name'}
                </p>
                <p className="text-[#6b6b6b] text-[12px] leading-tight">
                  {product.address || 'Farm Address'}
                </p>
              </div>
            </div>

            {/* Product Name */}
            <h2 className="text-[#353535] text-[40px] font-bold leading-tight mb-4">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-3 mb-2">
              {/* For rescue deals, show dynamic original price (blurred) and discounted price (clear) */}
              {product.isRescueDeal && getOriginalPrice() ? (
                <>
                  <span className="text-[#353535]/50 text-[32px] font-medium blur-[1.5px]">
                    ₱{getOriginalPrice()}
                  </span>
                  <span className="text-[#353535] text-[32px] font-medium">
                    ₱{getCurrentPrice()}
                  </span>
                </>
              ) : (
                /* For regular listings, use the original logic */
                <>
                  {product.oldPrice && (
                    <span className="text-[#353535]/50 text-[32px] font-medium blur-[1.5px]">
                      ₱{product.oldPrice}
                    </span>
                  )}
                  <span className="text-[#353535] text-[32px] font-medium">
                    ₱{getCurrentPrice()}
                  </span>
                </>
              )}
            </div>

            {/* Stocks */}
            <p className="text-[#7d7d7d] text-[16px] font-medium mb-5">
              Stocks left: {product.totalStocks || '0 kg'}
            </p>

            {/* Description */}
            <p className="text-[#474747] text-[14px] leading-relaxed mb-6">
              {product.description || `Fresh ${product.name.toLowerCase()} from our local farms. High quality and carefully selected for your needs.`}
            </p>

            {/* Quantity */}
            <div>
              <h3 className="text-[#353535] text-[20px] font-semibold mb-3">
                Quantity
              </h3>
              <div className="flex flex-wrap gap-3 max-w-[600px]">
                {product.quantityPriceEntries && product.quantityPriceEntries.length > 0 ? (
                  product.quantityPriceEntries.map((entry, index) => (
                    <button 
                      key={`${entry.quantity}-${entry.unit}`}
                      onClick={() => setSelectedQuantityIndex(index)}
                      className={`${
                        index === selectedQuantityIndex 
                          ? 'bg-white border-2 border-black' 
                          : 'bg-[#e8e8e8] border-2 border-transparent'
                      } rounded-[8px] px-6 py-2 text-[16px] font-medium text-[#353535] hover:${
                        index === selectedQuantityIndex ? 'bg-gray-50' : 'bg-gray-300'
                      } transition flex-shrink-0`}
                      style={{ minWidth: '100px' }}
                    >
                      {entry.quantity}{entry.unit}
                    </button>
                  ))
                ) : (
                  <button className="bg-white border-2 border-black rounded-[8px] px-6 py-2 text-[16px] font-medium text-[#353535]">
                    1kg
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
