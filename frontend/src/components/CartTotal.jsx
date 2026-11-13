import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
  } = useContext(ShopContext);

  // Calculate the subtotal of all cart products.
  const subtotal = Number(getCartAmount()) || 0;

  // Apply the delivery fee only when the cart is not empty.
  const shippingFee = subtotal > 0 ? Number(delivery_fee) || 0 : 0;

  // Calculate the final payable amount.
  const total = subtotal + shippingFee;

  // Format prices using Indian number formatting.
  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="text-2xl">
        <Title text1="CART" text2="TOTALS" />
      </div>

      {/* Price breakdown */}
      <div className="mt-4 flex flex-col gap-3 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>

          <p className="font-medium">
            {currency}
            {formatPrice(subtotal)}
          </p>
        </div>

        <hr className="border-gray-300" />

        {/* Delivery fee */}
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping Fee</p>

          <p className="font-medium">
            {currency}
            {formatPrice(shippingFee)}
          </p>
        </div>

        <hr className="border-gray-300" />

        {/* Final total */}
        <div className="flex justify-between text-base">
          <p className="font-semibold">Total</p>

          <b className="text-gray-900">
            {currency}
            {formatPrice(total)}
          </b>
        </div>

        {/* Delivery information */}
        {subtotal > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            Shipping charges are included in the total.
          </p>
        )}
      </div>
    </div>
  );
};

export default CartTotal;