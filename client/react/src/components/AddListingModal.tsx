import { useState, useEffect, useRef } from 'react';
import imgHeaderBg from "figma:asset/f394064e8a6ce0cfed98517b9c37405371194eb2.png";
import imgHeaderBgRated from "figma:asset/10e6621269cc669b206bb9a0fb1f9f70249b00bc.png";
import imgEllipse971 from "figma:asset/ff1c3364a0ea8b0d0477ee0221561c76294067da.png";
import imgLeaf from "figma:asset/b2b29d891a360c1c20df9597a06fd413e7d10568.png";
import imgImage from "figma:asset/c0b5003c0cc5716f11a5c44caa4174cdb398de48.png";
import { FreshnessFormModal } from './FreshnessFormModal';
import { CategoryModal } from './CategoryModal';
import { QuantityEntry } from './QuantityUnitPriceModal';
import { PromosModal } from './PromosModal';
import { PromoBadges } from './PromoBadges';
import Group52616 from '../imports/Group52616';

export interface Listing {
  id: number;
  image: string;
  name: string;
  category: string;
  totalStocks: string;
  price: string;
  freshness?: string;
  status: 'Active' | 'Sold out';
  address?: string;
  description?: string;
  photos?: (string | null)[];
  promos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
}

export interface ListingPhoto {
  file?: File;
  url?: string;
  preview?: string;
}

export interface ListingDraft {
  id: number;
  name: string;
  category: string;
  totalStocks: string;
  price: string;
  status: 'Active' | 'Sold out';
  description?: string;
  photos: (ListingPhoto | null)[];
  freshnessData: {
    farmerName: string;
    farmAddress: string;
    harvestDate: string;
    category: string;
    freshnessRating: number;
  };
  promos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
}

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingListing?: Listing | null;
  quantityEntries: QuantityEntry[];
  onSave: (listing: ListingDraft) => void;
  onRequestQuantityFocus?: () => void;
  onFreshnessFormOpen?: () => void;
  onFreshnessFormClose?: () => void;
  ngoName?: string;
  isSaving?: boolean;
  uploadProgress?: number | null;
}

export function AddListingModal({ isOpen, onClose, editingListing, quantityEntries, onSave, onRequestQuantityFocus, onFreshnessFormOpen, onFreshnessFormClose, ngoName, isSaving, uploadProgress }: AddListingModalProps) {
  const [cropName, setCropName] = useState('');
  const [price, setPrice] = useState('');
  const [totalStocks, setTotalStocks] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photos, setPhotos] = useState<(ListingPhoto | null)[]>(Array(6).fill(null));
  const [isFreshnessFormOpen, setIsFreshnessFormOpen] = useState(false);
  const [hideAddListing, setHideAddListing] = useState(false);
  const [isPromosModalOpen, setIsPromosModalOpen] = useState(false);
  const [showPromosModal, setShowPromosModal] = useState(true); // Control promos modal visibility
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPromos, setSelectedPromos] = useState({
    limitedStocks: false,
    freeShipping: false,
    discount25: false,
    discount50: false,
  });
  const [freshnessData, setFreshnessData] = useState<{
    farmerName: string;
    farmAddress: string;
    harvestDate: string;
    category: string;
    freshnessRating: number;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<{
    cropName?: string;
    price?: string;
    totalStocks?: string;
    description?: string;
    quantities?: string;
    freshness?: string;
    photos?: string;
  }>({});

  // Refs for form navigation
  const cropNameRef = useRef<HTMLInputElement>(null);
  const totalStocksRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryOptions = ['Greens', 'Grains', 'Vegetables', 'Fruits', 'Root Crops', 'Exotic', 'Spices', 'Native'];

  // Auto-focus on Crop Name field when modal opens
  useEffect(() => {
    if (isOpen && cropNameRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => cropNameRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Pre-populate form when editing
  useEffect(() => {
    if (editingListing) {
      setCropName(editingListing.name);
      setPrice(editingListing.price);
      // Remove "kg" suffix from totalStocks for editing
      setTotalStocks(editingListing.totalStocks.replace(' kg', ''));
      setDescription(editingListing.description || '');
      setQuantity('1kg');
      
      // Load all photos from the listing
      if (editingListing.photos && editingListing.photos.length > 0) {
        const mapped = editingListing.photos.map((url) => (url ? { url } : null));
        const padded = [...mapped, ...Array(6).fill(null)].slice(0, 6);
        setPhotos(padded);
      } else {
        // Fallback: if no photos array, use the main image
        const newPhotos = Array(6).fill(null);
        newPhotos[0] = editingListing.image ? { url: editingListing.image } : null;
        setPhotos(newPhotos);
      }
      
      // If listing has freshness rating, set freshness data
      if (editingListing.freshness) {
        setFreshnessData({
          farmerName: editingListing.farmerName || 'Farmer Name',
          farmAddress: editingListing.address || 'Farm Address',
          harvestDate: new Date().toISOString().split('T')[0],
          category: editingListing.category,
          freshnessRating: parseFloat(editingListing.freshness),
        });
      }
      
      // Load existing promos if available
      if (editingListing.promos) {
        setSelectedPromos(editingListing.promos);
      }
      setSelectedCategory(editingListing.category || '');
    } else {
      // Reset form for new listing
      setCropName('');
      setPrice('');
      setTotalStocks('');
      setDescription('');
      setQuantity('');
      setPhotos(Array(6).fill(null));
      setFreshnessData(null);
      setSelectedPromos({
        limitedStocks: false,
        freeShipping: false,
        discount25: false,
        discount50: false,
      });
      setSelectedCategory('');
      setFormErrors({});
    }
  }, [editingListing, isOpen]);

  // Auto-calculate price from lowest quantity entry
  useEffect(() => {
    if (quantityEntries.length > 0) {
      // Find the entry with the lowest quantity (when parsed as number)
      const lowestEntry = quantityEntries.reduce((lowest, current) => {
        const lowestQty = parseFloat(lowest.quantity);
        const currentQty = parseFloat(current.quantity);
        return currentQty < lowestQty ? current : lowest;
      });
      setPrice(lowestEntry.price);
      if (formErrors.quantities) {
        setFormErrors((prev) => ({ ...prev, quantities: undefined, price: undefined }));
      }
    } else {
      // Reset price when no entries exist
      setPrice('');
    }
  }, [quantityEntries]);

  if (!isOpen) return null;

  const getPhotoSrc = (photo: ListingPhoto | null) => {
    if (!photo) return '';
    return photo.preview || photo.url || '';
  };

  const handlePhotoUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[index] = {
          file,
          preview: reader.result as string,
        };
        setPhotos(newPhotos);
        if (formErrors.photos) {
          setFormErrors((prev) => ({ ...prev, photos: undefined }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleFinish = () => {
    const errors: typeof formErrors = {};
    // Validation
    if (!cropName.trim()) {
      errors.cropName = 'Crop name is required.';
    }
    if (!price.trim()) {
      errors.price = 'Price is required.';
    }
    if (!totalStocks.trim()) {
      errors.totalStocks = 'Total stocks is required.';
    }
    if (!freshnessData) {
      errors.freshness = 'Complete the freshness form to continue.';
    }
    
    // Get the first photo or use the existing image if editing
    const firstPhoto = photos.find(p => p?.preview || p?.url);
    if (!firstPhoto && !editingListing) {
      errors.photos = 'Upload at least one photo.';
    }

    if (quantityEntries.length === 0) {
      errors.quantities = 'Add at least one quantity and price entry.';
    }

    if (!description.trim()) {
      errors.description = 'Description is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Determine the category from freshness data or existing listing
    const category = freshnessData?.category || selectedCategory || editingListing?.category || 'Vegetables';
    
    // Create the listing object
    const updatedListing: ListingDraft = {
      id: editingListing?.id || 0, // ID will be set by the parent if creating new
      name: cropName,
      category: category,
      totalStocks: totalStocks ? totalStocks : '0',
      price: price,
      status: editingListing?.status || 'Active',
      description: description,
      photos: photos,
      freshnessData: freshnessData,
      promos: selectedPromos,
    };
    
    onSave(updatedListing);
  };

  const handleOpenFreshnessForm = () => {
    setIsFreshnessFormOpen(true);
    setHideAddListing(true);
    setShowPromosModal(false); // Hide promos modal
    if (onFreshnessFormOpen) {
      onFreshnessFormOpen();
    }
  };

  const handleCloseFreshnessForm = (data?: {
    farmerName: string;
    farmAddress: string;
    harvestDate: string;
    category: string;
    freshnessRating: number;
  }) => {
    setIsFreshnessFormOpen(false);
    setHideAddListing(false);
    setShowPromosModal(true); // Show promos modal again
    if (data) {
      setFreshnessData(data);
      if (formErrors.freshness) {
        setFormErrors((prev) => ({ ...prev, freshness: undefined }));
      }
    }
    if (onFreshnessFormClose) {
      onFreshnessFormClose();
    }
  };

  const handleOpenPromosModal = () => {
    setIsPromosModalOpen(true);
    setHideAddListing(true);
  };

  const handleClosePromosModal = (selected: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  }) => {
    setIsPromosModalOpen(false);
    setHideAddListing(false);
    setSelectedPromos(selected);
  };

  // Format date to "MMM DD" format
  const formatHarvestDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const hasPhoto = photos.some(p => p?.preview || p?.url) || editingListing;
    const hasCropName = cropName.trim().length > 0;
    const hasPrice = price.trim().length > 0;
    const hasTotalStocks = totalStocks.trim().length > 0;
    const hasDescription = description.trim().length > 0;
    const hasQuantityEntries = quantityEntries.length > 0;
    const hasFreshnessData = freshnessData !== null;
    const hasCategory = selectedCategory.trim().length > 0;
    
    return hasPhoto && hasCropName && hasPrice && hasTotalStocks && hasDescription && hasQuantityEntries && hasFreshnessData && hasCategory;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      {!hideAddListing && (
        <div className="relative z-10 bg-white rounded-[20px] shadow-[2px_3px_10px_0px_rgba(0,0,0,0.25)] w-full max-w-[920px] max-h-[90vh] overflow-y-auto">
        
          {/* Header with Background Image */}
          {!freshnessData ? (
            <div className="relative h-[130px] rounded-t-[20px] overflow-hidden">
              <img 
                src={imgHeaderBg} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <p className="text-white text-[16px] font-bold tracking-wide mb-2">
                  Get your Crop Rated and Transparent!
                </p>
                <button 
                  onClick={handleOpenFreshnessForm}
                  className="hover:scale-110 transition-transform mb-1"
                >
                  <img 
                    src={imgLeaf} 
                    alt="Leaf" 
                    className="w-[55px] h-[55px] drop-shadow-lg brightness-0 invert" 
                  />
                </button>
                <p className="text-white text-[12px] tracking-wide">
                  Click the leaf to learn more about the Freshness Form!
                </p>
              </div>
            </div>
          ) : (
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
                    {freshnessData.freshnessRating.toFixed(1)}
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
                      {formatHarvestDate(freshnessData.harvestDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6 px-8 py-6">
            {/* Left Column - Photo Uploads */}
            <div className="w-[400px] shrink-0">
              {/* Photo Uploads - Takes full height */}
              <div className="flex flex-col gap-4">
                {/* Row 1 */}
                <div className="flex gap-4">
                  {[0, 1].map((index) => (
                    <div key={index} className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(index, e)}
                        className="hidden"
                        id={`photo-${index}`}
                      />
                      <label
                        htmlFor={`photo-${index}`}
                        className="block w-full h-[155px] border-2 border-dashed border-gray-400 rounded cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200 transition"
                      >
                        {photos[index] ? (
                          <img src={getPhotoSrc(photos[index])} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <img 
                              src={imgImage} 
                              alt="Upload" 
                              className="w-[55px] h-[59px] mb-2 opacity-60" 
                            />
                            <span className="text-gray-400 text-[15px] font-medium">
                              Upload Photo
                            </span>
                          </div>
                        )}
                      </label>
                      {photos[index] && (
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Row 2 */}
                <div className="flex gap-4">
                  {[2, 3].map((index) => (
                    <div key={index} className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(index, e)}
                        className="hidden"
                        id={`photo-${index}`}
                      />
                      <label
                        htmlFor={`photo-${index}`}
                        className="block w-full h-[155px] border-2 border-dashed border-gray-400 rounded cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200 transition"
                      >
                        {photos[index] ? (
                          <img src={getPhotoSrc(photos[index])} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <img 
                              src={imgImage} 
                              alt="Upload" 
                              className="w-[55px] h-[59px] mb-2 opacity-60" 
                            />
                            <span className="text-gray-400 text-[15px] font-medium">
                              Upload Photo
                            </span>
                          </div>
                        )}
                      </label>
                      {photos[index] && (
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Row 3 */}
                <div className="flex gap-4">
                  {[4, 5].map((index) => (
                    <div key={index} className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(index, e)}
                        className="hidden"
                        id={`photo-${index}`}
                      />
                      <label
                        htmlFor={`photo-${index}`}
                        className="block w-full h-[155px] border-2 border-dashed border-gray-400 rounded cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200 transition"
                      >
                        {photos[index] ? (
                          <img src={getPhotoSrc(photos[index])} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <img 
                              src={imgImage} 
                              alt="Upload" 
                              className="w-[55px] h-[59px] mb-2 opacity-60" 
                            />
                            <span className="text-gray-400 text-[15px] font-medium">
                              Upload Photo
                            </span>
                          </div>
                        )}
                      </label>
                      {photos[index] && (
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {formErrors.photos && (
                <p className="mt-2 text-[12px] text-red-500">{formErrors.photos}</p>
              )}
            </div>

            {/* Right Column - Form Fields and Buttons */}
            <div className="flex-1 flex flex-col">
              {/* Form Fields */}
              <div className="flex-1">
                {/* Profile Section */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-[60px] h-[60px] bg-[#9bdc8c] rounded-full flex items-center justify-center shrink-0">
                    <img 
                      src={imgEllipse971} 
                      alt="Profile" 
                      className="w-[50px] h-[50px] rounded-full" 
                    />
                  </div>
                  <div>
                    <p className="text-[#32a928] text-[18px] font-bold tracking-wide leading-tight mb-0.5">
                      {ngoName || 'NGO Account'}
                    </p>
                    <p className="text-[#6b6b6b] text-[13px] font-medium leading-tight mb-0.5">
                      {freshnessData ? freshnessData.farmerName : 'Farmer Name'}
                    </p>
                    <p className="text-[#6b6b6b] text-[12px] leading-tight">
                      {freshnessData ? freshnessData.farmAddress : 'Farm Address'}
                    </p>
                  </div>
                </div>
                {formErrors.freshness && (
                  <p className="mb-4 text-[12px] text-red-500">{formErrors.freshness}</p>
                )}

                {/* Crop Name */}
                <div className="mb-4">
                  <div className="relative inline-flex items-center gap-3">
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => {
                        setCropName(e.target.value);
                        if (formErrors.cropName) {
                          setFormErrors((prev) => ({ ...prev, cropName: undefined }));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (onRequestQuantityFocus) {
                            onRequestQuantityFocus();
                          }
                        }
                      }}
                      placeholder="Crop Name"
                      className={`text-[22px] font-bold text-center border-2 border-dashed border-black rounded-[12px] px-6 py-2 outline-none w-[240px] h-[42px] placeholder:text-gray-400 focus:border-[#32a928] ${
                        cropName ? 'text-black' : 'text-[#353535]'
                      }`}
                      ref={cropNameRef}
                    />
                    <svg className="w-6 h-6 text-[#32a928]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  {formErrors.cropName && (
                    <p className="mt-1 text-[12px] text-red-500">{formErrors.cropName}</p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="relative inline-flex items-center gap-3">
                    <input
                      type="text"
                      value={price}
                      readOnly
                      placeholder="Price"
                      className={`text-[18px] font-medium border-2 border-dashed border-black rounded-[12px] px-4 py-1.5 outline-none w-[120px] h-[38px] placeholder:text-gray-400 bg-gray-50 cursor-not-allowed text-center ${
                        price ? 'text-black' : 'text-[#353535]'
                      }`}
                    />
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  {formErrors.price && (
                    <p className="mt-1 text-[12px] text-red-500">{formErrors.price}</p>
                  )}
                </div>

                {/* Total Stocks Available */}
                <div className="mb-5">
                  <label className="text-[#474747] text-[15px] font-semibold block mb-1.5">
                    Total Stocks Available
                  </label>
                  <div className="relative inline-flex items-center gap-3">
                    <input
                      type="text"
                      value={totalStocks}
                      onChange={(e) => {
                        // Only allow numbers and decimal point
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setTotalStocks(value);
                          if (formErrors.totalStocks) {
                            setFormErrors((prev) => ({ ...prev, totalStocks: undefined }));
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          descriptionRef.current?.focus();
                        }
                      }}
                      placeholder="0"
                      className={`text-[16px] font-medium border-2 border-dashed border-black rounded-[12px] px-4 py-1.5 outline-none w-[120px] h-[38px] placeholder:text-gray-400 focus:border-[#32a928] ${
                        totalStocks ? 'text-black' : 'text-[#353535]'
                      }`}
                      ref={totalStocksRef}
                    />
                    <svg className="w-6 h-6 text-[#32a928]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  {formErrors.totalStocks && (
                    <p className="mt-1 text-[12px] text-red-500">{formErrors.totalStocks}</p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-5">
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value.slice(0, 100));
                        if (formErrors.description) {
                          setFormErrors((prev) => ({ ...prev, description: undefined }));
                        }
                      }}
                      placeholder="Type your crop Description in here...."
                      className={`w-full h-[95px] border-2 border-dashed border-black rounded-[12px] px-4 py-3 text-[13px] italic outline-none resize-none placeholder:text-gray-400 placeholder:italic focus:border-[#32a928] ${
                        description ? 'text-black' : 'text-[#6b6b6b]'
                      }`}
                      maxLength={100}
                      ref={descriptionRef}
                    />

                    <p className="absolute bottom-3 right-4 text-[#6b6b6b] text-[11px]">
                      {description.length}/100
                    </p>
                  </div>
                  {formErrors.description && (
                    <p className="mt-1 text-[12px] text-red-500">{formErrors.description}</p>
                  )}
                </div>

                {/* Quantities Available */}
                <div className="mb-5">
                  <label className="text-[#474747] text-[15px] font-semibold block mb-1.5">
                    Quantities Available
                  </label>
                  {quantityEntries.length > 0 ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      {quantityEntries.map((entry, index) => (
                        <div key={index} className="bg-[#e8e8e8] rounded-[8px] px-4 py-1.5 h-[38px] flex items-center justify-center">
                          <span className="text-[#353535] text-[15px] font-medium whitespace-nowrap">
                            {entry.quantity} {entry.unit}
                          </span>
                        </div>
                      ))}
                      <svg className="w-6 h-6 text-[#32a928]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="relative inline-flex items-center gap-3">
                      <div className="bg-[#e8e8e8] rounded-[8px] px-4 py-1.5 w-[85px] h-[38px] flex items-center justify-center cursor-default select-none">
                        <span className="text-[#b0b0b0] text-[15px] font-medium"></span>
                      </div>
                      <svg className="w-6 h-6 text-[#32a928]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  )}
                  {formErrors.quantities && (
                    <p className="mt-2 text-[12px] text-red-500">{formErrors.quantities}</p>
                  )}
                </div>

                {/* Promotional Banners */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Promo Badges - Replaces "ADDING PROMOS" */}
                  <PromoBadges selectedPromos={selectedPromos} />
                </div>
              </div>

              {/* Buttons at the bottom of right column */}
              <div className="flex flex-col gap-3 mt-6">
                {typeof uploadProgress === 'number' && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-[#5EB14E] transition-all"
                        style={{ width: `${Math.round(uploadProgress * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      Uploading {Math.round(uploadProgress * 100)}%
                    </span>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-[#e5e5e5] hover:bg-gray-300 text-[#4f4f4f] text-[20px] font-bold py-3 rounded-[10px] transition h-[50px] flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={!isFormValid() || isSaving}
                    className={`flex-1 text-[20px] font-bold py-3 rounded-[10px] transition h-[50px] flex items-center justify-center ${
                      isFormValid() && !isSaving
                        ? 'bg-[#5EB14E] hover:bg-[#4a9a3d] text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      'Finish'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Freshness Form Modal */}
      <FreshnessFormModal 
        isOpen={isFreshnessFormOpen} 
        category={selectedCategory}
        onClose={handleCloseFreshnessForm} 
      />

      {/* Category Modal - Conditionally Visible */}
      {isOpen && showPromosModal && (
        <CategoryModal
          isOpen={true}
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {/* Promos Modal - Conditionally Visible */}
      {isOpen && showPromosModal && (
        <PromosModal 
          isOpen={true} 
          onClose={(selected) => setSelectedPromos(selected)} 
          selectedPromos={selectedPromos}
        />
      )}
    </div>
  );
}
