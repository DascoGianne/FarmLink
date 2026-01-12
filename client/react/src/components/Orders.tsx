import { useEffect, useMemo, useState } from 'react';
import BackgroundBlobs from '../imports/Group52557';
import { OrderCard } from './OrderCard';

interface AuthUser {
  role: 'NGO' | 'BUYER';
  id: number;
}

interface OrdersProps {
  authUser: AuthUser;
  authToken: string;
  onOrderCountChange?: (count: number) => void;
}

interface OrderApi {
  order_id: number;
  buyer_id: number;
  listing_id: number;
  quantity: number | string;
  subtotal: number | string;
  delivery_fee: number | string;
  total_amount: number | string;
  region?: string | null;
  province?: string | null;
  municipality_city?: string | null;
  barangay?: string | null;
  street_no?: string | null;
  order_date?: string | null;
  order_status?: string | null;
  crop_name?: string | null;
  image_1?: string | null;
  username?: string | null;
  email?: string | null;
  contact_number?: string | null;
}

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

const formatCurrency = (value: number) => value.toFixed(2);

const toNumber = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function Orders({ authUser, authToken, onOrderCountChange }: OrdersProps) {
  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser || !authToken) return;
    if (authUser.role !== 'NGO') {
      setError('Orders view is only available for NGO accounts.');
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/orders/ngo/${authUser.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load orders');
        }
        const data: OrderApi[] = payload?.data || [];
        setOrders(data);
        if (onOrderCountChange) {
          onOrderCountChange(data.length);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [authToken, authUser, onOrderCountChange]);

  const cards = useMemo(() => {
    return orders.map((order) => {
      const subtotal = toNumber(order.subtotal);
      const shipping = toNumber(order.delivery_fee);
      const total = toNumber(order.total_amount);
      const discountValue = Math.max(0, subtotal + shipping - total);

      const addressParts = [
        order.region,
        order.province,
        order.municipality_city,
        order.barangay,
        order.street_no,
      ].filter(Boolean);

      const buyerAddress = addressParts.length > 0 ? addressParts.join(', ') : '-';
      const orderStatus = order.order_status || 'Pending';

      return (
        <OrderCard
          key={order.order_id}
          orderNumber={String(order.order_id).padStart(5, '0')}
          buyerId={String(order.buyer_id).padStart(5, '0')}
          buyerName={order.username || 'Buyer'}
          buyerEmail={order.email || '-'}
          buyerPhone={order.contact_number || '-'}
          buyerAddress={buyerAddress}
          items={[
            {
              id: String(order.listing_id),
              name: order.crop_name || 'Listing',
              image: resolveImageUrl(order.image_1),
              quantity: String(order.quantity ?? '-'),
              price: formatCurrency(subtotal),
            },
          ]}
          subtotal={formatCurrency(subtotal)}
          discount={formatCurrency(discountValue)}
          total={formatCurrency(total)}
          shipping={formatCurrency(shipping)}
          orderStatus={orderStatus}
          onConfirm={orderStatus === 'Pending' ? async () => {
            try {
              const response = await fetch(`/api/orders/${order.order_id}/status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ order_status: 'Confirmed' }),
              });
              const payload = await response.json().catch(() => null);
              if (!response.ok) {
                throw new Error(payload?.message || 'Failed to confirm order');
              }
              setOrders((prev) =>
                prev.map((item) =>
                  item.order_id === order.order_id
                    ? { ...item, order_status: 'Confirmed' }
                    : item
                )
              );
            } catch (err) {
              alert(err instanceof Error ? err.message : 'Failed to confirm order');
            }
          } : undefined}
        />
      );
    });
  }, [authToken, orders]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBlobs />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#32a928] text-center mb-8">
          My Orders
        </h1>

        {!isLoading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!isLoading && !error && cards.length === 0 && (
          <p className="text-center text-gray-500">No orders found yet.</p>
        )}

        {!isLoading && !error && cards}
      </div>
    </div>
  );
}
