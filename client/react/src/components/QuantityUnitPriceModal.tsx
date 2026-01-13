import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import svgPaths from "../imports/svg-3oymq2n4vl";
import svgPathsForm from "../imports/svg-87lv767i5v";
import imgRectangle11386 from "figma:asset/364807345685588370ef0db7efdd7992085e10bd.png";
import imgRectangle11398 from "figma:asset/92dba10b5578a3177cec9685959d4ea0704eb4a6.png";

export interface QuantityEntry {
  quantity: string;
  unit: string;
  price: string;
}

interface QuantityUnitPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: QuantityEntry) => void;
  onRemoveEntry: (index: number) => void;
  entries: QuantityEntry[];
  focusTrigger?: number; // Add a trigger to request focus
}

export function QuantityUnitPriceModal({ isOpen, onClose, onAddEntry, onRemoveEntry, entries, focusTrigger }: QuantityUnitPriceModalProps) {
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [priceWholePart, setPriceWholePart] = useState(''); // Store the whole number part
  const [priceDecimalPart, setPriceDecimalPart] = useState(''); // Store decimal part
  const [isEditingDecimals, setIsEditingDecimals] = useState(false);
  
  // Refs for form navigation
  const quantityRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus on quantity field when focusTrigger changes (not on modal open)
  useEffect(() => {
    if (focusTrigger && focusTrigger > 0 && quantityRef.current) {
      quantityRef.current.focus();
    }
  }, [focusTrigger]);

  useEffect(() => {
    if (isOpen) {
      setUnit('kg');
    }
  }, [isOpen]);

  // Manage cursor position to keep it before the decimal point when editing whole numbers
  useEffect(() => {
    if (priceRef.current && !isEditingDecimals && priceWholePart !== '') {
      const cursorPos = priceWholePart.length;
      priceRef.current.setSelectionRange(cursorPos, cursorPos);
    }
  }, [priceWholePart, isEditingDecimals]);

  useEffect(() => {
    const root = document.documentElement;
    if (!isOpen) {
      root.style.setProperty('--quantity-modal-height', '0px');
      return;
    }

    root.style.setProperty('--quantity-modal-bottom', '350px');
    const node = modalRef.current;
    if (!node) return;

    const updateHeight = () => {
      const height = node.getBoundingClientRect().height;
      root.style.setProperty('--quantity-modal-height', `${Math.round(height)}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isOpen, entries.length]);

  if (!isOpen) return null;

  // Get the display value for price
  const getPriceDisplayValue = () => {
    if (isEditingDecimals) {
      // When editing decimals, show what user is typing
      if (priceDecimalPart === '') {
        return priceWholePart + '.';
      } else if (priceDecimalPart.length === 1) {
        return priceWholePart + '.' + priceDecimalPart + '0';
      } else {
        return priceWholePart + '.' + priceDecimalPart;
      }
    } else {
      // When editing whole numbers, always show .00
      if (priceWholePart === '') {
        return '';
      } else {
        return priceWholePart + '.00';
      }
    }
  };

  // Get the final price value for saving
  const getFinalPriceValue = () => {
    if (priceWholePart === '') return '';
    
    if (isEditingDecimals) {
      if (priceDecimalPart === '') {
        return priceWholePart + '.00';
      } else if (priceDecimalPart.length === 1) {
        return priceWholePart + '.' + priceDecimalPart + '0';
      } else {
        return priceWholePart + '.' + priceDecimalPart;
      }
    } else {
      return priceWholePart + '.00';
    }
  };

  const handleAdd = () => {
    const finalPrice = getFinalPriceValue();
    if (quantity && unit && finalPrice) {
      onAddEntry({ quantity, unit, price: finalPrice });
      // Reset fields for next entry
      setQuantity('');
      setUnit('kg');
      setPriceWholePart('');
      setPriceDecimalPart('');
      setIsEditingDecimals(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value);
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPos = input.selectionStart || 0;
    const value = input.value;

    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
      // After adding, focus back to quantity for next entry
      setTimeout(() => quantityRef.current?.focus(), 0);
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (isEditingDecimals) {
        if (priceDecimalPart.length > 0) {
          // Remove last decimal digit
          setPriceDecimalPart(priceDecimalPart.slice(0, -1));
        } else {
          // Go back to whole number mode
          setIsEditingDecimals(false);
        }
      } else {
        // Remove last digit from whole number
        if (priceWholePart.length > 0) {
          setPriceWholePart(priceWholePart.slice(0, -1));
        }
      }
      return;
    }

    if (e.key === '.') {
      e.preventDefault();
      if (!isEditingDecimals && priceWholePart !== '') {
        setIsEditingDecimals(true);
        setPriceDecimalPart('');
      }
      return;
    }

    // Handle number input
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      
      if (isEditingDecimals) {
        // Add to decimal part (max 2 digits)
        if (priceDecimalPart.length < 2) {
          setPriceDecimalPart(priceDecimalPart + e.key);
        }
      } else {
        // Add to whole number part
        setPriceWholePart(priceWholePart + e.key);
      }
      return;
    }

    // Block all other keys
    if (e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
      <div className="absolute bottom-[350px] right-[50px] pointer-events-auto">
        <div ref={modalRef} className="relative w-[323px] bg-white rounded-[8px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-4 overflow-hidden">
          {/* Header */}
          <div className="mb-4">
            <p className="font-['Poppins',sans-serif] font-medium text-[#474747] text-[16px] tracking-[0.16px]">
              Quantity / Unit / Price
            </p>
          </div>

          {/* Display Added Entries - Moved to Top */}
          {entries.length > 0 && (
            <div className="max-h-[330px] overflow-y-auto overflow-x-hidden space-y-2 mb-3">
              {entries.map((entry, index) => (
                <div key={index} className="relative h-[52px] w-[295px] group">
                  {/* Background */}
                  <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 301 52">
                    <path d={svgPathsForm.p26b32c00} fill="#EDEDED" />
                  </svg>
                  
                  {/* Quantity Display */}
                  <div className="absolute h-[41px] left-[5.5px] top-[5px] w-[76px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 41">
                      <path d={svgPathsForm.p138fdb00} fill="white" />
                    </svg>
                  </div>
                  <p className="absolute font-['Poppins',sans-serif] font-medium h-[26px] leading-[normal] left-[42px] text-[#353535] text-[20px] text-center top-[12px] -translate-x-1/2 w-[44px]">
                    {entry.quantity}
                  </p>
                  
                  {/* Unit Display */}
                  <div className="absolute h-[41px] left-[88px] top-[5px] w-[76px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 41">
                      <path d={svgPathsForm.p138fdb00} fill="white" />
                    </svg>
                  </div>
                  <p className="absolute font-['Poppins',sans-serif] font-medium h-[36px] leading-[normal] left-[125.5px] text-[#353535] text-[20px] text-center top-[11px] -translate-x-1/2 w-[57px]">
                    {entry.unit}
                  </p>
                  
                  {/* Price Display */}
                  <p className="absolute font-['Poppins',sans-serif] font-medium h-[30px] leading-[normal] left-[173px] text-[24px] text-[rgba(6,6,6,0.8)] top-[7px] w-[90px]">
                    {entry.price}
                  </p>
                  
                  {/* Remove Button - appears on hover */}
                  <button
                    onClick={() => onRemoveEntry(index)}
                    className="absolute right-[3px] top-[50%] -translate-y-1/2 h-[38px] w-[38px] bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                    title="Remove entry"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Current Entry Row - Input Form */}
          <div className="relative h-[52px] w-[295px] mb-3">
            {/* Background */}
            <img alt="" className="absolute inset-0 w-full h-full" src={imgRectangle11386} />
            
            {/* Quantity Input */}
            <div className="absolute h-[42px] left-[5px] top-[5px] w-[77px]">
              <img alt="" className="absolute inset-0 w-full h-full" src={imgRectangle11398} />
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    priceRef.current?.focus();
                  }
                }}
                className="absolute inset-0 w-full h-full bg-transparent text-center text-[#353535] text-[20px] font-medium font-['Poppins',sans-serif] outline-none"
                placeholder="1"
                ref={quantityRef}
              />
            </div>
            
            {/* Unit Input */}
            <div className="absolute h-[42px] left-[88px] top-[5px] w-[77px]">
              <img alt="" className="absolute inset-0 w-full h-full" src={imgRectangle11398} />
              <input
                type="text"
                value={unit}
                readOnly
                tabIndex={-1}
                className="absolute inset-0 w-full h-full bg-transparent text-center text-[#353535] text-[20px] font-medium font-['Poppins',sans-serif] outline-none"
                ref={unitRef}
              />
            </div>
            
            {/* Price Input */}
            <input
              type="text"
              value={getPriceDisplayValue()}
              onKeyDown={handlePriceKeyDown}
              onChange={(e) => {
                // Prevent default onChange behavior - we handle everything in onKeyDown
                e.preventDefault();
              }}
              className="absolute h-[30px] left-[173px] top-[11px] w-[111px] bg-transparent text-[rgba(6,6,6,0.8)] text-[24px] font-medium font-['Poppins',sans-serif] outline-none"
              placeholder="0.00"
              ref={priceRef}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="w-full bg-[#5EB14E] hover:bg-[#4a9a3d] text-white text-[16px] font-semibold py-2 rounded transition"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
