import { useState, useRef } from 'react';
import imgHeaderBg from "figma:asset/f394064e8a6ce0cfed98517b9c37405371194eb2.png";
import imgEllipse971 from "figma:asset/ff1c3364a0ea8b0d0477ee0221561c76294067da.png";
import imgTearOffCalendar from "figma:asset/13dbd4868e94ead4adc10a7d5d972370bb4b4067.png";

interface FreshnessFormModalProps {
  isOpen: boolean;
  onClose: (data?: {
    farmerName: string;
    farmAddress: string;
    harvestDate: string;
    category: string;
    freshnessRating: number;
  }) => void;
}

export function FreshnessFormModal({ isOpen, onClose }: FreshnessFormModalProps) {
  const [farmerName, setFarmerName] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [harvestDate, setHarvestDate] = useState('');

  // Refs for form navigation
  const farmerNameRef = useRef<HTMLInputElement>(null);
  const farmAddressRef = useRef<HTMLInputElement>(null);

  const categories = ['Greens', 'Grains', 'Vegetables', 'Fruits', 'Root Crops', 'Exotic', 'Spices', 'Native'];

  if (!isOpen) return null;

  // Check if all fields are filled
  const isFormValid = farmerName.trim() !== '' && 
                      farmAddress.trim() !== '' && 
                      selectedCategory !== '' && 
                      harvestDate !== '';

  const handleRate = () => {
    if (!isFormValid) return;
    
    // Generate random freshness rating between 3.5 and 5.0
    const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1);
    
    const formData = {
      farmerName,
      farmAddress,
      category: selectedCategory,
      harvestDate,
      freshnessRating: parseFloat(randomRating),
    };
    console.log('Freshness Form submitted:', formData);
    onClose(formData);
  };

  const handleBackClick = () => {
    onClose();
  };

  // Handle Enter key navigation
  const handleFarmerNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      farmAddressRef.current?.focus();
    }
  };

  const handleFarmAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Do nothing - stay in farm address field
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleBackClick}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-[15px] shadow-[2px_3px_10px_0px_rgba(0,0,0,0.25)] w-full max-w-[750px] max-h-[90vh] overflow-y-auto">
        
        {/* Header with Background Image */}
        <div className="relative h-[100px] rounded-t-[15px] overflow-hidden">
          <img 
            src={imgHeaderBg} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover blur-[5px]"
          />
          
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="absolute left-4 top-4 z-20 text-white hover:scale-110 transition-transform"
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
            <p className="text-white text-[22px] font-bold leading-tight mb-1">
              Freshness Form By FarmLink
            </p>
            <p className="text-white text-[11px] italic">
              We promote transparency on our crop listings to ensure buyers their orders expectations!
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-5">
            {/* Profile Picture */}
            <div className="relative w-[70px] h-[70px] shrink-0">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#32a928] rounded-full blur-[8px] opacity-50" />
              {/* Profile Image */}
              <img 
                src={imgEllipse971} 
                alt="Profile" 
                className="relative w-full h-full rounded-full object-cover" 
              />
            </div>

            {/* Form Fields */}
            <div className="flex-1">
              {/* Farmer Name */}
              <div className="mb-4">
                <label className="text-[#979797] text-[11px] font-semibold block mb-1.5">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Farmer Danilo Ramos"
                  className={`w-full border border-[#979797] rounded-[10px] px-4 py-2.5 text-[18px] font-semibold outline-none focus:border-[#32a928] placeholder:text-[#c8c8c8] ${
                    farmerName ? 'text-black' : 'text-[#979797]'
                  }`}
                  ref={farmerNameRef}
                  onKeyDown={handleFarmerNameKeyDown}
                />
              </div>

              {/* Farm Address */}
              <div className="mb-4">
                <label className="text-[#979797] text-[11px] font-semibold block mb-1.5">
                  Farm Address
                </label>
                <input
                  type="text"
                  value={farmAddress}
                  onChange={(e) => setFarmAddress(e.target.value)}
                  placeholder="Lot 16, Gintong Binhi St."
                  className={`w-full border border-[#979797] rounded-[10px] px-4 py-2.5 text-[18px] font-semibold outline-none focus:border-[#32a928] placeholder:text-[#c8c8c8] ${
                    farmAddress ? 'text-black' : 'text-[#979797]'
                  }`}
                  ref={farmAddressRef}
                  onKeyDown={handleFarmAddressKeyDown}
                />
              </div>

              {/* Crop Listing Category */}
              <div className="mb-4">
                <label className="text-[#979797] text-[11px] font-semibold block mb-2">
                  Crop Listing Category
                </label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative w-4 h-4">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="appearance-none w-4 h-4 border-2 border-[#c8c8c8] rounded-[3px] cursor-pointer checked:bg-black checked:border-[#c8c8c8]"
                        />
                      </div>
                      <span className={`text-[15px] font-semibold ${selectedCategory === category ? 'text-black' : 'text-[#979797]'}`}>
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date of Harvest */}
              <div className="mb-4">
                <label className="text-[#979797] text-[11px] font-semibold block mb-1.5">
                  Date of Harvest
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className={`w-full border border-[#979797] rounded-[10px] px-4 py-2.5 text-[18px] font-semibold outline-none focus:border-[#32a928] cursor-pointer ${
                    harvestDate ? 'text-black' : 'text-[#979797]'
                  }`}
                  style={{
                    colorScheme: 'light'
                  }}
                />
              </div>

              {/* Rate Button */}
              <div className="flex justify-end mt-5">
                <button
                  onClick={handleRate}
                  disabled={!isFormValid}
                  className={`text-white text-[17px] font-bold py-2.5 px-10 rounded-[10px] transition min-w-[160px] ${
                    isFormValid 
                      ? 'bg-[#5EB14E] hover:bg-[#4a9a3d] cursor-pointer' 
                      : 'bg-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
