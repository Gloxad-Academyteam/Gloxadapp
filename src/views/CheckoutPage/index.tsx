"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLock, FiCheck } from "react-icons/fi";
import { FaCcPaypal, FaCcAmex, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import PaystackLogo from "@assets/images/Paystack_Logo 1.png";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export default function CheckoutPage() {
  const { id: courseId } = useParams()!;
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [saveDetails, setSaveDetails] = useState(false);

  // Fetch course details for order summary
  const { data: course, isLoading } = useQuery({
    queryKey: ["course.checkout", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });

  // Mock checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const dummyReference = `PAY-${Math.random().toString(36).substr(2, 9)}`;
      const res = await axiosInstance.post("/enrollments/checkout", {
        courseId,
        reference: dummyReference
      });
      return res.data;
    },
    onSuccess: () => {
      router.push(`/payment/success?courseId=${courseId}`);
    },
    onError: () => {
      router.push(`/payment/failure?courseId=${courseId}`);
    }
  });

  if (isLoading) return <div className="p-20 text-center text-[#717480]">Loading checkout...</div>;
  if (!course) return <div className="p-20 text-center text-[#717480]">Course not found.</div>;

  const price: number = course.price || 0;
  const priceLabel = price ? `₦${price.toLocaleString()}` : "Free";
  const instructor = [course.instructor?.firstName, course.instructor?.lastName].filter(Boolean).join(" ");

  const payTypes = [
    { id: "paypal", label: "PayPal", Icon: FaCcPaypal, color: "text-[#003087]" },
    { id: "amex", label: "American Express", Icon: FaCcAmex, color: "text-[#2e77bc]" },
    { id: "visa", label: "Visa", Icon: FaCcVisa, color: "text-[#1a1f71]" },
    { id: "mastercard", label: "Mastercard", Icon: FaCcMastercard, color: "text-[#eb001b]" },
    { id: "paystack", label: "Paystack", Icon: null, color: "" },
  ];

  const fieldClass =
    "h-[44px] w-full rounded-[10px] border border-[#e6e8ee] bg-white px-4 text-[14px] text-[#202127] outline-none transition placeholder:text-[#a5a8b3] focus:border-[#07004d] focus:ring-4 focus:ring-[#07004d]/10";
  const labelClass = "mb-2 block text-[13px] font-medium text-[#202127]";

  return (
    <div className="w-full bg-white text-[#202127]">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-5 py-8 md:px-10 lg:grid-cols-[1.3fr_1fr] lg:gap-8 lg:px-8 lg:py-12">
        {/* ===================== Checkout card ===================== */}
        {/* MOBILE: summary is shown first (order-2 on desktop keeps it on the right) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkoutMutation.mutate();
          }}
          className="order-2 rounded-[16px] border border-[#eceef3] bg-white p-5 sm:p-7 lg:order-1"
        >
          <h1 className="text-[22px] font-bold sm:text-[24px]">Checkout</h1>
          <p className="mt-1 text-[13px] text-[#717480]">Pay Type</p>

          <div role="radiogroup" aria-label="Pay type" className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {payTypes.map(({ id, label, Icon, color }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={paymentMethod === id}
                aria-label={label}
                onClick={() => setPaymentMethod(id)}
                className={`flex h-[56px] items-center justify-center rounded-[10px] border bg-white text-[36px] transition ${
                  paymentMethod === id ? "border-[#07004d] ring-4 ring-[#07004d]/10" : "border-[#e6e8ee] hover:border-[#c9cdd8]"
                } ${color}`}
              >
                {Icon ? <Icon /> : <img src={PaystackLogo.src} alt="Paystack" className="h-5 w-auto max-w-[80%] object-contain" />}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-5">
            <div>
              <label htmlFor="card-name" className={labelClass}>Name on Card</label>
              <input id="card-name" type="text" autoComplete="cc-name" placeholder="Enter name on card" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="card-number" className={labelClass}>Card Number</label>
              <input id="card-number" type="text" inputMode="numeric" autoComplete="cc-number" placeholder="Enter card number" className={fieldClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-exp" className={labelClass}>Expiration Date (MM/YY)</label>
                <input id="card-exp" type="text" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="card-cvv" className={labelClass}>CVV</label>
                <input id="card-cvv" type="text" inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" className={fieldClass} />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-[12px] text-[#717480]">
              <input
                type="checkbox"
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border-[#cfd2da] text-[#07004d] focus:ring-[#07004d]"
              />
              Save my card details for future checkouts
            </label>
          </div>

          <button
            type="submit"
            disabled={checkoutMutation.isPending}
            className="btn-interactive mt-7 flex h-[46px] w-full items-center justify-center rounded-full bg-[#07004d] text-[14px] font-medium text-white transition hover:bg-[#111456] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkoutMutation.isPending ? "Processing..." : "Confirm Payment"}
          </button>

          <p className="mt-4 flex items-start justify-center gap-2 text-center text-[11px] text-[#8a8c95]">
            <FiLock className="mt-0.5 shrink-0" />
            Payments are processed over a secure, encrypted connection.
          </p>
        </form>

        {/* ===================== Summary card ===================== */}
        <aside className="order-1 h-max rounded-[16px] border border-[#eceef3] bg-white p-5 sm:p-7 lg:sticky lg:top-[150px] lg:order-2">
          <h2 className="text-[15px] font-medium text-[#717480]">Summary</h2>

          <div className="mt-5 flex items-center gap-4">
            <img
              src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=200&fit=crop"}
              alt={course.title}
              className="h-[64px] w-[88px] shrink-0 rounded-[10px] object-cover"
            />
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-bold text-[#202127]">{course.title}</h3>
              {instructor && <p className="mt-0.5 truncate text-[12px] text-[#717480]">{instructor}</p>}
              <p className="mt-1 text-[13px] font-bold text-[#07004d]">{priceLabel}</p>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-[#f0f1f5] border-t border-[#f0f1f5] text-[13px]">
            <div className="flex justify-between py-3 text-[#4e515c]">
              <dt>Subtotal</dt>
              <dd className="font-medium text-[#202127]">{priceLabel}</dd>
            </div>
            <div className="flex justify-between py-3 text-[#4e515c]">
              <dt>Coupons (Discount)</dt>
              <dd className="text-[#10b981]">-₦0</dd>
            </div>
            <div className="flex justify-between py-3 text-[#4e515c]">
              <dt>Tax</dt>
              <dd>₦0</dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="text-[15px] font-bold text-[#202127]">Total</dt>
              <dd className="text-[20px] font-bold text-[#07004d]">{priceLabel}</dd>
            </div>
          </dl>

          <p className="mt-1 flex items-center gap-2 text-[12px] text-[#717480]">
            <FiCheck className="text-[#10b981]" /> 30-day money-back guarantee
          </p>
        </aside>
      </div>
    </div>
  );
}
