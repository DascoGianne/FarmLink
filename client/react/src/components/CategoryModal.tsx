interface CategoryModalProps {
  isOpen: boolean;
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryModal({
  isOpen,
  categories,
  selectedCategory,
  onSelect,
}: CategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
      <div
        className="absolute pointer-events-auto"
        style={{
          right: '50px',
          bottom: 'calc(var(--quantity-modal-bottom, 350px) + var(--quantity-modal-height, 0px) + 12px)',
        }}
      >
        <div className="w-[323px] rounded-[12px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.2)] p-4">
          <p className="font-['Poppins',sans-serif] font-semibold text-[#474747] text-[17px] mb-3">
            Crop Listing Category
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="listing-category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() =>
                    onSelect(selectedCategory === category ? '' : category)
                  }
                  className="w-[19px] h-[20px] border-2 border-[#c8c8c8] rounded-[3px] cursor-pointer"
                />
                <span className={`text-[15px] font-semibold ${selectedCategory === category ? 'text-black' : 'text-[#979797]'}`}>
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
