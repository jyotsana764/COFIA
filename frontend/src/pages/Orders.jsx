
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const getTrackingSteps = (status) => {
  const steps = [
    'Order Placed',
    'Packing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  // Map common statuses returned by the backend.
  const aliases = {
    'order placed': 'Order Placed',
    'order confirmed': 'Order Placed',
    'processing': 'Packing',
    'packed': 'Packing',
    'packing': 'Packing',
    'shipped': 'Shipped',
    'out for delivery': 'Out for Delivery',
    'delivered': 'Delivered',
  };

  const normalized = String(status || 'Order Placed').trim().toLowerCase();
  const currentStatus = aliases[normalized] || status || 'Order Placed';
  const currentIndex = steps.indexOf(currentStatus);

  return { steps, currentStatus, currentIndex };
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrderData = useCallback(async () => {
    if (!token) {
      setOrderData([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Unable to load orders');
      }

      const allOrderItems = [];

      (response.data.orders || []).forEach((order, orderIndex) => {
        (order.items || []).forEach((item, itemIndex) => {
          allOrderItems.push({
            ...item,
            status: order.status || 'Order Placed',
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            orderId: order._id,
            itemKey: `${order._id || orderIndex}-${item._id || itemIndex}`,
          });
        });
      });

      setOrderData(allOrderItems.reverse());
    } catch (err) {
      console.error('Load orders error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to load your orders. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  const openTracking = (item) => {
    setSelectedOrder(item);
  };

  const closeTracking = () => {
    setSelectedOrder(null);
  };

  const tracking = selectedOrder
    ? getTrackingSteps(selectedOrder.status)
    : null;

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {error && (
        <div className="my-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        {loading && orderData.length === 0 && (
          <p className="py-8 text-gray-500">Loading your orders...</p>
        )}

        {!loading && !error && orderData.length === 0 && (
          <p className="py-8 text-gray-500">
            You have not placed any orders yet.
          </p>
        )}

        {orderData.map((item) => (
          <div
            key={item.itemKey}
            className="flex flex-col gap-4 border-b border-t py-4 text-gray-700 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                className="w-16 object-contain sm:w-20"
                src={item.image?.[0] || '/placeholder.png'}
                alt={item.name || 'Product'}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/placeholder.png';
                }}
              />

              <div>
                <p className="font-medium sm:text-base">{item.name}</p>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-base text-gray-700">
                  <p>{currency}{Number(item.price || 0).toLocaleString('en-IN')}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>

                <p className="mt-1">
                  Date:{' '}
                  <span className="text-gray-400">
                    {item.date
                      ? new Date(item.date).toDateString()
                      : 'Not available'}
                  </span>
                </p>

                <p className="mt-1">
                  Payment:{' '}
                  <span className="text-gray-400">
                    {item.paymentMethod || 'Not available'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:w-1/2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-sm md:text-base">{item.status}</p>
              </div>

              <button
                type="button"
                onClick={() => openTracking(item)}
                className="rounded-sm border px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && tracking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeTracking}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tracking-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest text-gray-500">
                  COFIA ORDER TRACKING
                </p>
                <h2 id="tracking-title" className="mt-1 text-xl font-semibold">
                  Track your order
                </h2>
              </div>

              <button
                type="button"
                onClick={closeTracking}
                aria-label="Close tracking"
                className="px-2 text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 border-b pb-5">
              <img
                src={selectedOrder.image?.[0] || '/placeholder.png'}
                alt={selectedOrder.name || 'Product'}
                className="h-20 w-16 object-contain"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/placeholder.png';
                }}
              />

              <div>
                <p className="font-medium">{selectedOrder.name}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Quantity: {selectedOrder.quantity} · Size: {selectedOrder.size}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Order date:{' '}
                  {selectedOrder.date
                    ? new Date(selectedOrder.date).toDateString()
                    : 'Not available'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-5 font-semibold">
                Current status: {tracking.currentStatus}
              </p>

              <div className="space-y-5">
                {tracking.steps.map((step, index) => {
                  const completed =
                    tracking.currentIndex >= 0 &&
                    index <= tracking.currentIndex;

                  return (
                    <div key={step} className="flex items-start gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                          completed
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 text-gray-400'
                        }`}
                      >
                        {completed ? '✓' : index + 1}
                      </div>

                      <div>
                        <p
                          className={
                            completed
                              ? 'font-medium text-gray-900'
                              : 'text-gray-400'
                          }
                        >
                          {step}
                        </p>

                        {index === tracking.currentIndex && (
                          <p className="mt-1 text-sm text-gray-500">
                            Latest status reported by the store.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {tracking.currentIndex === -1 && (
                <p className="mt-4 text-sm text-amber-700">
                  Your store returned a status not recognized by this timeline.
                  Current status: {String(selectedOrder.status)}
                </p>
              )}
            </div>

            <div className="mt-6 rounded bg-gray-50 p-4 text-sm">
              <p>
                <span className="text-gray-500">Payment method:</span>{' '}
                {selectedOrder.paymentMethod || 'Not available'}
              </p>
              <p className="mt-2">
                <span className="text-gray-500">Payment status:</span>{' '}
                {selectedOrder.payment || 'Not available'}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={async () => {
                  await loadOrderData();
                }}
                className="flex-1 rounded border px-4 py-3 text-sm font-medium hover:bg-gray-100"
              >
                Refresh status
              </button>

              <button
                type="button"
                onClick={closeTracking}
                className="flex-1 rounded bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
