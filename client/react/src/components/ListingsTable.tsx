import { useState, Fragment } from 'react';
import { ChevronDown as ChevronDownIcon, ChevronUp } from 'lucide-react';
import imgEdit from "figma:asset/dbefae533b37973b2630ab12e83db19f28241992.png";
import imgDelete from "figma:asset/758147f9f761536e5155612b2a41e41de566a9fb.png";
import imgChevronDown from "figma:asset/d636d9244afdbb71f8ed261cf9d9f1716ec38787.png";
import imgLeaf from "figma:asset/b2b29d891a360c1c20df9597a06fd413e7d10568.png";
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export interface QuantityPriceEntry {
  quantity: string;
  unit: string;
  price: string;
}

export interface Listing {
  id: number;
  image: string;
  name: string;
  category: string;
  totalStocks: string;
  price: string;
  freshness?: string;
  status: 'Active' | 'Sold out';
  ngoId?: number;
  ngoName?: string;
  farmerName?: string;
  address?: string;
  description?: string;
  oldPrice?: string;
  quantitiesAvailable?: string[];
  quantityPriceEntries?: QuantityPriceEntry[];
  photos?: (string | null)[];
  promos?: {
    limitedStocks: boolean;
    freeShipping: boolean;
    discount25: boolean;
    discount50: boolean;
  };
}


interface ListingsTableProps {
  onEdit: (listing: Listing) => void;
  listings: Listing[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'Active' | 'Sold out') => void;
}

export function ListingsTable({ onEdit, listings, onDelete, onStatusChange }: ListingsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<{ id: number; name: string } | null>(null);
  
  // Sort listings by ID descending (newest first)
  const sortedListings = [...listings].sort((a, b) => b.id - a.id);
  
  const handleDeleteClick = (id: number, name: string) => {
    setListingToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (listingToDelete) {
      onDelete(listingToDelete.id);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      <div className="overflow-x-auto">
        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <TableHeader label="ID" />
                <TableHeader label="Crop Listing" sortable />
                <TableHeader label="Category" sortable />
                <TableHeader label="Stocks Available" sortable />
                <TableHeader label="Price" sortable />
                <TableHeader label="Freshness" sortable />
                <TableHeader label="Status" />
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {sortedListings.map((listing, index) => (
                <Fragment key={listing.id}>
                  <tr
                    onClick={() => toggleRow(listing.id)}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-4 text-center text-gray-700 font-medium">
                      {listing.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                          <img
                            src={listing.image}
                            alt={listing.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 font-medium">{listing.name}</span>
                          {expandedRow === listing.id ? (
                            <ChevronUp size={18} className="text-gray-500" />
                          ) : (
                            <ChevronDownIcon size={18} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{listing.category}</td>
                    <td className="px-4 py-4 text-gray-700">{listing.totalStocks}</td>
                    <td className="px-4 py-4 text-gray-700 font-bold">
                      {listing.price ? `₱${listing.price}` : '-'}
                    </td>
                    <td className="px-4 py-4">{listing.freshness ? (
                        <div className="flex items-center gap-1.5">
                          <img src={imgLeaf} alt="Leaf" className="w-4 h-4" />
                          <span className="text-gray-700 font-medium">{listing.freshness}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown status={listing.status} onStatusChange={(status) => onStatusChange(listing.id, status)} />
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onEdit(listing)}
                          className="bg-[#5eb14e] hover:bg-[#4a9c3c] text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer"
                        >
                          <img src={imgEdit} alt="Edit" className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="bg-white hover:bg-red-50 border border-red-300 text-red-600 p-2 rounded-lg transition cursor-pointer" onClick={() => handleDeleteClick(listing.id, listing.name)}>
                          <img src={imgDelete} alt="Delete" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expandable Row - Stock Information */}
                  {expandedRow === listing.id && listing.quantityPriceEntries && listing.quantityPriceEntries.length > 0 && (
                    <tr className="bg-gray-100/50">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="pl-8 pr-4">
                          <h4 className="text-[#32a928] font-semibold text-base mb-3">Stock Information</h4>
                          <div className="space-y-2">
                            {listing.quantityPriceEntries.map((entry, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-gray-700">
                                <span className="font-medium">{entry.quantity} {entry.unit}</span>
                                <span>-</span>
                                <span className="font-semibold">₱{entry.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onEdit={onEdit} onDelete={handleDeleteClick} onStatusChange={onStatusChange} />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        listingName={listingToDelete?.name || ''}
      />
    </>
  );
}

interface TableHeaderProps {
  label: string;
  sortable?: boolean;
}

function TableHeader({ label, sortable }: TableHeaderProps) {
  return (
    <th className="px-4 py-4 text-left">
      <div className="flex items-center gap-2">
        <span className="text-[#32a928] font-semibold text-lg">{label}</span>
        {sortable && (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="cursor-pointer">
            <path d="M6 0L11 5H1L6 0Z" fill="#32a928" />
            <path d="M6 14L1 9H11L6 14Z" fill="#32a928" />
          </svg>
        )}
      </div>
    </th>
  );
}

interface StatusDropdownProps {
  status: string;
  onStatusChange: (status: 'Active' | 'Sold out') => void;
}

function StatusDropdown({ status, onStatusChange }: StatusDropdownProps) {
  return (
    <div className="relative inline-block">
      <select
        defaultValue={status}
        className="bg-white border border-black rounded-2xl px-4 py-2 pr-8 appearance-none cursor-pointer text-gray-800 outline-none hover:bg-gray-50 transition"
        onChange={(e) => onStatusChange(e.target.value as 'Active' | 'Sold out')}
      >
        <option value="Active">Active</option>
        <option value="Sold out">Sold out</option>
      </select>
      <img
        src={imgChevronDown}
        alt="Dropdown"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
      />
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (id: number, name: string) => void;
  onStatusChange: (id: number, status: 'Active' | 'Sold out') => void;
}

function ListingCard({ listing, onEdit, onDelete, onStatusChange }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={listing.image}
            alt={listing.name}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{listing.name}</h3>
              <p className="text-sm text-gray-600">ID: {listing.id}</p>
            </div>
            <StatusDropdown status={listing.status} onStatusChange={(status) => onStatusChange(listing.id, status)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Category</p>
          <p className="text-gray-800">{listing.category}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Total Stocks</p>
          <p className="text-gray-800">{listing.totalStocks}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Price</p>
          <p className="text-gray-800">{listing.price ? `₱${listing.price}` : '-'}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Freshness</p>
          {listing.freshness ? (
            <div className="flex items-center gap-1.5">
              <img src={imgLeaf} alt="Leaf" className="w-3 h-3" />
              <span className="text-gray-800">{listing.freshness}</span>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onEdit(listing)}
          className="flex-1 bg-[#5eb14e] hover:bg-[#4a9c3c] text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <img src={imgEdit} alt="Edit" className="w-4 h-4" />
          Edit
        </button>
        <button className="bg-white hover:bg-red-50 border border-red-300 text-red-600 p-2 rounded-lg transition cursor-pointer" onClick={() => onDelete(listing.id, listing.name)}>
          <img src={imgDelete} alt="Delete" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
