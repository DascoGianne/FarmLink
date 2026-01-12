import imgChevronDown from "figma:asset/d636d9244afdbb71f8ed261cf9d9f1716ec38787.png";
import imgFilterBg from "figma:asset/d7cd1a12057aaee58b3b8bf6bcbff4f0c3e107d3.png";
import imgSearchIcon from "figma:asset/a2117a1e4eddd38971eb9fc26723405caa2464a1.png";

export interface FilterOptions {
  category: string;
  status: string;
  priceRange: string;
  searchQuery: string;
}

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

export function FilterBar({ filters, onFilterChange, categories }: FilterBarProps) {
  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    onFilterChange({ ...filters, priceRange });
  };

  const handleSearchChange = (searchQuery: string) => {
    onFilterChange({ ...filters, searchQuery });
  };

  return (
    <div className="mb-6 -mx-4 md:-mx-8">
      {/* Filter Section with Green Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <img 
          src={imgFilterBg} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Content */}
        <div className="relative px-8 md:px-12 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Category
              </label>
              <FilterDropdown 
                placeholder="All Categories"
                value={filters.category}
                onChange={handleCategoryChange}
                options={['Greens', 'Vegetables', 'Root Crops', 'Spices', 'Grains', 'Fruits', 'Exotic', 'Native']}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Status
              </label>
              <FilterDropdown 
                placeholder="All Status"
                value={filters.status}
                onChange={handleStatusChange}
                options={['Active', 'Sold out']}
              />
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Price
              </label>
              <FilterDropdown 
                placeholder="All Prices"
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                options={['0 - 50', '50 - 100', '100 - 200', '200+']}
              />
            </div>

            {/* Search Listing */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Search Listing
              </label>
              <div className="bg-white rounded-2xl shadow-md flex items-center px-4 py-3">
                <img src={imgSearchIcon} alt="Search" className="w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 ml-3 outline-none text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterDropdownProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function FilterDropdown({ placeholder, value, onChange, options }: FilterDropdownProps) {
  return (
    <div className="relative">
      <select 
        className="w-full bg-white rounded-2xl shadow-md px-4 py-3 pr-10 appearance-none cursor-pointer text-gray-600 outline-none hover:bg-gray-50 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option>{placeholder}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <img
        src={imgChevronDown}
        alt="Dropdown"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
      />
    </div>
  );
}