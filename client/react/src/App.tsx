import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar, FilterOptions } from './components/FilterBar';
import { AddListingModal, ListingDraft, ListingPhoto } from './components/AddListingModal';
import { QuantityUnitPriceModal, QuantityEntry } from './components/QuantityUnitPriceModal';
import { ListingsTable, Listing } from './components/ListingsTable';
import { Orders } from './components/Orders';

const loadMarketplace = () => import('./components/Marketplace');
const loadHomePage = () => import('./components/HomePage');

const Marketplace = lazy(() =>
  loadMarketplace().then((module) => ({ default: module.Marketplace }))
);
const HomePage = lazy(() =>
  loadHomePage().then((module) => ({ default: module.HomePage }))
);

type AuthUser = {
  role: 'NGO' | 'BUYER';
  id: number;
  email: string;
};

type NgoProfile = {
  ngo_id: number;
  ngo_name: string;
  email: string;
};

type ListingApi = {
  listing_id: number;
  ngo_id: number;
  ngo_name?: string | null;
  promo_id?: number | null;
  promo_name?: string | null;
  discount_percent?: number | string | null;
  crop_name: string;
  category: string;
  description?: string | null;
  total_stocks?: number | string | null;
  status?: string | null;
  image_1?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  image_4?: string | null;
  image_5?: string | null;
  image_6?: string | null;
};

type PricingApi = {
  quantity: number | string;
  unit: string;
  price: number | string;
};

type TraceabilityApi = {
  freshness_score?: number | string | null;
  farmer_name?: string | null;
  farm_address?: string | null;
};

const TOKEN_KEY = 'farmlink_token';
const LEGACY_TOKEN_KEY = 'token';
const USER_KEY = 'farmlink_user';
const getLoginUrl = () => {
  if (typeof window === 'undefined') return '/client/views/layouts/login.html';
  const { protocol, hostname, port } = window.location;
  if (port && port !== '3000') {
    return `${protocol}//${hostname}:3000/client/views/layouts/login.html`;
  }
  return `${protocol}//${hostname}${port ? `:${port}` : ''}/client/views/layouts/login.html`;
};

const getStoredToken = () =>
  localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

const storeTokenFromUrl = () => {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  if (!token) return null;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  url.searchParams.delete('token');
  window.history.replaceState({}, document.title, url.toString());
  return token;
};

const parseJsonSafe = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const parseJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as { role?: 'NGO' | 'BUYER'; id?: number; email?: string };
  } catch {
    return null;
  }
};

const resolveImageUrl = (image: string | null | undefined) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const path = image.startsWith('/') ? image : `/${image}`;
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (port === '5173') {
      return `${protocol}//${hostname}:3000${path}`;
    }
  }
  return path;
};

const statusFromDb = (status: string | null | undefined) =>
  status === 'Sold Out' ? 'Sold out' : 'Active';

const statusToDb = (status: 'Active' | 'Sold out') =>
  status === 'Sold out' ? 'Sold Out' : 'Available';

const promosFromApi = (promoId?: number | null) => ({
  limitedStocks: promoId === 1,
  freeShipping: promoId === 2,
  discount25: promoId === 3,
  discount50: promoId === 4,
});

const promoIdFromSelection = (promos?: {
  limitedStocks: boolean;
  freeShipping: boolean;
  discount25: boolean;
  discount50: boolean;
}) => {
  if (!promos) return null;
  if (promos.limitedStocks) return 1;
  if (promos.freeShipping) return 2;
  if (promos.discount25) return 3;
  if (promos.discount50) return 4;
  return null;
};

const toNumber = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  return Number.isNaN(parsed) ? null : parsed;
};

const uploadListingImage = async (
  file: File,
  token: string,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('image', file);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/uploads/listing-image');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) return;
      const progress = event.loaded / event.total;
      if (onProgress) {
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const payload = JSON.parse(xhr.responseText || '{}');
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(payload?.message || 'Image upload failed'));
          return;
        }
        resolve(payload?.url as string);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Image upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Image upload failed'));
    });

    xhr.send(formData);
  });
};

const resolveListingImages = async (
  photos: (ListingPhoto | null)[],
  token: string,
  onProgress?: (progress: number) => void
) => {
  const uploadable = photos
    .map((photo, index) => (photo?.file ? { photo, index } : null))
    .filter((entry): entry is { photo: ListingPhoto; index: number } => Boolean(entry));
  const progressByIndex = new Map<number, number>();
  const totalUploads = uploadable.length;

  const updateOverall = () => {
    if (!onProgress || totalUploads === 0) return;
    const total = Array.from(progressByIndex.values()).reduce((sum, value) => sum + value, 0);
    onProgress(total / totalUploads);
  };

  const uploads = photos.map(async (photo, index) => {
    if (!photo) return null;
    if (photo.file) {
      return uploadListingImage(photo.file, token, (progress) => {
        progressByIndex.set(index, progress);
        updateOverall();
      });
    }
    return photo.url || null;
  });

  return Promise.all(uploads);
};

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [ngoProfile, setNgoProfile] = useState<NgoProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [currentTab, setCurrentTab] = useState<'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS'>('HOME');
  const [quantityEntries, setQuantityEntries] = useState<QuantityEntry[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [isSavingListing, setIsSavingListing] = useState(false);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [focusTrigger, setFocusTrigger] = useState(0); // Add focus trigger
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All Categories',
    status: 'All Status',
    priceRange: 'All Prices',
    searchQuery: ''
  });
  
  // Store the previous quantity modal state to restore it when returning from freshness form
  const [previousQuantityModalOpen, setPreviousQuantityModalOpen] = useState(false);
  const hasLoadedSession = useRef(false);
  const pendingDeletesRef = useRef(
    new Map<number, { listing: Listing; timeoutId: number }>()
  );
  const successTimerRef = useRef<number | null>(null);

  const showSuccessMessage = useCallback((message: string) => {
    setSuccessMessage(message);
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = window.setTimeout(() => {
      setSuccessMessage(null);
      successTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (!tabParam) return;

    const normalized = tabParam.replace(/[_-]/g, ' ').toUpperCase();
    if (normalized === 'MARKETPLACE') {
      setCurrentTab('MARKETPLACE');
    } else if (normalized === 'ORDERS') {
      setCurrentTab('ORDERS');
    } else if (normalized === 'MY LISTINGS') {
      setCurrentTab('MY LISTINGS');
    } else if (normalized === 'HOME') {
      setCurrentTab('HOME');
    }

    params.delete('tab');
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState({}, document.title, nextUrl);
  }, []);

  useEffect(() => {
    if (hasLoadedSession.current) return;
    hasLoadedSession.current = true;
    const token = storeTokenFromUrl() || getStoredToken();
    if (!token) {
      setAuthReady(true);
      return;
    }

    const loadSession = async () => {
      try {
        setAuthToken(token);
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await parseJsonSafe(response);

        if (!response.ok) {
          throw new Error(payload?.message || 'Session expired');
        }

        localStorage.setItem(TOKEN_KEY, token);
        setAuthUser({
          role: payload.user.role,
          id: payload.user.id,
          email: payload.user.email,
        });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setAuthReady(true);
      }
    };

    loadSession();
  }, []);

  const fetchListings = useCallback(async () => {
    if (!authUser || !authToken) return;
    setIsLoadingListings(true);
    setListingsError(null);

    try {
      const response = await fetch('/api/listings');
      const payload = await parseJsonSafe(response);

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to load listings');
      }

      const apiListings: ListingApi[] = payload?.data || [];
      const pricingResponses = await Promise.all(
        apiListings.map(async (listing) => {
          const res = await fetch(`/api/pricing/listing/${listing.listing_id}`);
          if (!res.ok) return { listingId: listing.listing_id, data: [] as PricingApi[] };
          const data = await parseJsonSafe(res);
          return { listingId: listing.listing_id, data: (data?.data || []) as PricingApi[] };
        })
      );

      const traceResponses = await Promise.all(
        apiListings.map(async (listing) => {
          const res = await fetch(`/api/traceability/listing/${listing.listing_id}`);
          if (!res.ok) return { listingId: listing.listing_id, data: null as TraceabilityApi | null };
          const data = await parseJsonSafe(res);
          return { listingId: listing.listing_id, data: (data?.data || null) as TraceabilityApi | null };
        })
      );

      const pricingMap = new Map<number, PricingApi[]>(
        pricingResponses.map((item) => [item.listingId, item.data])
      );
      const traceMap = new Map<number, TraceabilityApi | null>(
        traceResponses.map((item) => [item.listingId, item.data])
      );

      const mappedListings = apiListings.map((listing) => {
        const pricingEntries = pricingMap.get(listing.listing_id) || [];
        const traceEntry = traceMap.get(listing.listing_id);

        const quantityPriceEntries = pricingEntries.map((entry) => ({
          quantity: String(entry.quantity),
          unit: entry.unit,
          price: String(entry.price),
        }));

        const priceValues = quantityPriceEntries
          .map((entry) => toNumber(entry.price))
          .filter((value): value is number => value !== null);

        const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : null;

        const photos = [
          listing.image_1,
          listing.image_2,
          listing.image_3,
          listing.image_4,
          listing.image_5,
          listing.image_6,
        ].map((image) => (image ? resolveImageUrl(image) : null));

        return {
          id: listing.listing_id,
          ngoId: listing.ngo_id,
          ngoName: listing.ngo_name || undefined,
          image: resolveImageUrl(listing.image_1) || '',
          name: listing.crop_name,
          category: listing.category,
          totalStocks: listing.total_stocks !== null && listing.total_stocks !== undefined
            ? String(listing.total_stocks)
            : '',
          price: minPrice !== null ? minPrice.toFixed(2) : '',
          freshness: traceEntry?.freshness_score !== undefined && traceEntry?.freshness_score !== null
            ? String(traceEntry.freshness_score)
            : undefined,
          status: statusFromDb(listing.status),
          farmerName: traceEntry?.farmer_name || '',
          address: traceEntry?.farm_address || '',
          description: listing.description || '',
          promos: promosFromApi(listing.promo_id),
          quantityPriceEntries,
          quantitiesAvailable: quantityPriceEntries.map(
            (entry) => `${entry.quantity}${entry.unit}`
          ),
          photos,
        } satisfies Listing;
      });

      setListings(mappedListings);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load listings';
      setListingsError(message);
      toast.error(message);
    } finally {
      setIsLoadingListings(false);
    }
  }, [authToken, authUser]);

  useEffect(() => {
    if (!authReady) return;
    if (!authUser) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!authToken) return;
    fetchListings();
  }, [authReady, authUser, authToken, fetchListings]);

  useEffect(() => {
    if (!authReady || !authUser || !authToken) return;

    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/ngos/${authUser.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const payload = await parseJsonSafe(response);
        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load NGO profile');
        }
        setNgoProfile(payload?.data || null);
      } catch {
        setNgoProfile(null);
      }
    };

    loadProfile();
  }, [authReady, authToken, authUser]);

  useEffect(() => {
    if (!authReady || !authUser || !authToken) return;
    if (authUser.role !== 'NGO') {
      setOrderCount(0);
      return;
    }

    const loadOrderCount = async () => {
      try {
        const response = await fetch(`/api/orders/ngo/${authUser.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const payload = await parseJsonSafe(response);
        if (!response.ok) return;
        const data = payload?.data || [];
        setOrderCount(Array.isArray(data) ? data.length : 0);
      } catch {
        // Leave existing count if the request fails.
      }
    };

    loadOrderCount();
  }, [authReady, authToken, authUser]);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setAuthUser(null);
    window.location.href = getLoginUrl();
  };

  const handleAddClick = () => {
    setEditingListing(null);
    setQuantityEntries([]); // Reset quantity entries for new listing
    setIsModalOpen(true);
    setIsQuantityModalOpen(true);
  };

  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
    // Load existing quantity entries from the listing
    setQuantityEntries(listing.quantityPriceEntries || []);
    setIsModalOpen(true);
    setIsQuantityModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsQuantityModalOpen(false);
    setEditingListing(null);
  };

  const handleCloseQuantityModal = () => {
    setIsQuantityModalOpen(false);
  };

  const handleAddQuantityEntry = (entry: QuantityEntry) => {
    setQuantityEntries(prev => [...prev, entry]);
  };

  const handleRemoveQuantityEntry = (index: number) => {
    setQuantityEntries(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteListing = async (id: number) => {
    if (!authToken) return;

    const listing = listings.find((item) => item.id === id);
    if (!listing) return;

    setListings((prev) => prev.filter((item) => item.id !== id));

    const timeoutId = window.setTimeout(async () => {
      pendingDeletesRef.current.delete(id);
      try {
        const response = await fetch(`/api/listings/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const payload = await parseJsonSafe(response);
        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to delete listing');
        }
        showSuccessMessage('Listing deleted.');
        toast.success('Listing deleted.');
      } catch (error) {
        setListings((prev) => [listing, ...prev]);
        toast.error(error instanceof Error ? error.message : 'Failed to delete listing');
      }
    }, 4000);

    pendingDeletesRef.current.set(id, { listing, timeoutId });

    toast('Listing removed.');
  };

  const handleStatusChange = async (id: number, status: 'Active' | 'Sold out') => {
    if (!authToken) return;

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: statusToDb(status) }),
      });
      const payload = await parseJsonSafe(response);
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to update status');
      }
      setListings(prev => prev.map(listing =>
        listing.id === id ? { ...listing, status } : listing
      ));
      showSuccessMessage('Status updated.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Handle freshness form opening - close quantity modal
  const handleFreshnessFormOpen = () => {
    // Store current quantity modal state
    setPreviousQuantityModalOpen(isQuantityModalOpen);
    // Close quantity modal
    setIsQuantityModalOpen(false);
  };

  // Handle freshness form closing - restore quantity modal
  const handleFreshnessFormClose = () => {
    // Restore previous quantity modal state
    setIsQuantityModalOpen(previousQuantityModalOpen);
  };

  const handleSaveListing = async (updatedListing: ListingDraft) => {
    if (!authToken) {
      toast.error('Authentication required.');
      return;
    }

    setIsSavingListing(true);

    try {
      const uploadCount = updatedListing.photos.filter((photo) => photo?.file).length;
      if (uploadCount > 0) {
        setUploadProgress(0);
      }
      const imageUrls = await resolveListingImages(
        updatedListing.photos,
        authToken,
        uploadCount > 0 ? setUploadProgress : undefined
      );
      setUploadProgress(null);

      const payload = {
        promo_id: promoIdFromSelection(updatedListing.promos),
        crop_name: updatedListing.name,
        category: updatedListing.category,
        description: updatedListing.description || '',
        total_stocks: Number(updatedListing.totalStocks) || 0,
        status: statusToDb(updatedListing.status),
        image_1: imageUrls[0] || null,
        image_2: imageUrls[1] || null,
        image_3: imageUrls[2] || null,
        image_4: imageUrls[3] || null,
        image_5: imageUrls[4] || null,
        image_6: imageUrls[5] || null,
      };

      let listingId = updatedListing.id;
      const method = listingId ? 'PUT' : 'POST';
      const url = listingId ? `/api/listings/${listingId}` : '/api/listings';

      const listingResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const listingResult = await parseJsonSafe(listingResponse);

      if (!listingResponse.ok) {
        throw new Error(listingResult?.message || 'Failed to save listing');
      }

      if (!listingId) {
        listingId = listingResult?.data?.listing_id;
      }

      if (!listingId) {
        throw new Error('Listing ID missing from response');
      }

      const pricingPayload = {
        entries: quantityEntries.map((entry) => ({
          quantity: Number(entry.quantity),
          unit: entry.unit,
          price: Number(entry.price),
        })),
      };

      const pricingResponse = await fetch(`/api/pricing/listing/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(pricingPayload),
      });
      const pricingResult = await parseJsonSafe(pricingResponse);
      if (!pricingResponse.ok) {
        throw new Error(pricingResult?.message || 'Failed to save pricing');
      }

      const tracePayload = {
        farmer_name: updatedListing.freshnessData.farmerName,
        farm_address: updatedListing.freshnessData.farmAddress,
        harvest_date: updatedListing.freshnessData.harvestDate,
        freshness_score: Number(updatedListing.freshnessData.freshnessRating.toFixed(1)),
        freshness_countdown: null,
      };

      const traceResponse = await fetch(`/api/traceability/listing/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(tracePayload),
      });
      const traceResult = await parseJsonSafe(traceResponse);
      if (!traceResponse.ok) {
        throw new Error(traceResult?.message || 'Failed to save traceability');
      }

      await fetchListings();
      setIsModalOpen(false);
      setIsQuantityModalOpen(false);
      setEditingListing(null);
      const successText = updatedListing.id ? 'Listing updated.' : 'New listing successful.';
      showSuccessMessage(successText);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save listing');
    } finally {
      setIsSavingListing(false);
      setUploadProgress(null);
    }
  };

  const handleOrdersClick = () => {
    // Navigate to orders page
    setCurrentTab('ORDERS');
  };

  const handleTabHover = useCallback(
    (tab: 'HOME' | 'MARKETPLACE' | 'MY LISTINGS' | 'ORDERS') => {
      if (tab === 'HOME') {
        loadHomePage();
      } else if (tab === 'MARKETPLACE') {
        loadMarketplace();
      }
    },
    []
  );

  // Get unique categories from listings
  const myListings = useMemo(() => {
    if (!authUser) return [];
    return listings.filter((listing) => listing.ngoId === authUser.id);
  }, [authUser, listings]);

  const listingsForFilters = useMemo(() => {
    return currentTab === 'MY LISTINGS' ? myListings : listings;
  }, [currentTab, listings, myListings]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(listingsForFilters.map(l => l.category)));
    return uniqueCategories;
  }, [listingsForFilters]);

  // Filter listings based on filter options
  const filteredListings = useMemo(() => {
    return listingsForFilters.filter(listing => {
      // Category filter - check if it starts with "All Categories" to handle dynamic count
      const matchesCategory = filters.category.startsWith('All Categories') || listing.category === filters.category;
      
      // Status filter
      const matchesStatus = filters.status === 'All Status' || listing.status === filters.status;
      
      // Price range filter
      let matchesPriceRange = true;
      if (filters.priceRange !== 'All Prices') {
        const price = parseFloat(listing.price);
        if (filters.priceRange === '0 - 50') {
          matchesPriceRange = price >= 0 && price <= 50;
        } else if (filters.priceRange === '50 - 100') {
          matchesPriceRange = price > 50 && price <= 100;
        } else if (filters.priceRange === '100 - 200') {
          matchesPriceRange = price > 100 && price <= 200;
        } else if (filters.priceRange === '200+') {
          matchesPriceRange = price > 200;
        }
      }
      
      // Search query filter
      const matchesSearchQuery = filters.searchQuery === '' || 
        listing.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesPriceRange && matchesSearchQuery;
    });
  }, [listingsForFilters, filters]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600" />
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600" />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Toast Notifications */}
      <Toaster 
        position="top-center" 
        expand={true}
        richColors
        closeButton
      />
      
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onTabHover={handleTabHover}
        orderCount={orderCount ?? 0}
        onLogout={handleLogout}
        accountName={ngoProfile?.ngo_name}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onTabHover={handleTabHover}
          onAddClick={handleAddClick} 
          onOrdersClick={handleOrdersClick}
          orderCount={orderCount ?? 0}
          successMessage={successMessage}
        />
        <main className="flex-1">
          {listingsError && (
            <div className="px-4 py-3 text-sm text-red-600">
              Failed to load listings: {listingsError}
            </div>
          )}
          {currentTab === 'HOME' && (
            <Suspense fallback={null}>
              <HomePage 
                onNavigateToMarketplace={() => setCurrentTab('MARKETPLACE')}
                onNavigateToOrders={() => setCurrentTab('ORDERS')}
                onNavigateToListings={() => setCurrentTab('MY LISTINGS')}
              />
            </Suspense>
          )}
          
          {currentTab === 'MARKETPLACE' && (
            <div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
              <Suspense fallback={null}>
                <Marketplace listings={listings} />
              </Suspense>
            </div>
          )}
          
          {currentTab === 'MY LISTINGS' && (
            <div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
              <FilterBar 
                filters={filters} 
                onFilterChange={setFilters} 
                categories={categories}
              />
              {isLoadingListings && listings.length === 0 ? (
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                  No listings yet. Create your first crop listing to get started.
                </div>
              ) : (
                <ListingsTable 
                  listings={filteredListings} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteListing} 
                  onStatusChange={handleStatusChange} 
                />
              )}
            </div>
          )}
          
          {currentTab === 'ORDERS' && (
            <div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
              {authToken ? (
                <Orders
                  authUser={authUser}
                  authToken={authToken}
                  onOrderCountChange={setOrderCount}
                />
              ) : (
                <div className="text-sm text-gray-600">Authentication required to load orders.</div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Listing Modal */}
      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        editingListing={editingListing}
        quantityEntries={quantityEntries}
        onSave={handleSaveListing}
        onRequestQuantityFocus={() => setFocusTrigger(prev => prev + 1)}
        onFreshnessFormOpen={handleFreshnessFormOpen}
        onFreshnessFormClose={handleFreshnessFormClose}
        ngoName={ngoProfile?.ngo_name}
        isSaving={isSavingListing}
        uploadProgress={uploadProgress}
      />

      {/* Quantity/Unit/Price Modal */}
      <QuantityUnitPriceModal 
        isOpen={isQuantityModalOpen}
        onClose={handleCloseQuantityModal}
        onAddEntry={handleAddQuantityEntry}
        onRemoveEntry={handleRemoveQuantityEntry}
        entries={quantityEntries}
        focusTrigger={focusTrigger}
      />
    </div>
  );
}
