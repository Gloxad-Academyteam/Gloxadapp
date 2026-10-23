"use client";

import { useEffect } from "react";
import { usePaystackPayment } from "react-paystack";

type TInitializePayment = ReturnType<typeof usePaystackPayment>;

// react-paystack reads `window` as soon as it's imported, so it can't load during server rendering.
// The course page loads this with next/dynamic (ssr: false) and receives the payment starter via onReady.
const PaystackLauncher = ({ config, onReady }: { config: any; onReady: (initialize: TInitializePayment) => void }) => {
  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    onReady(initializePayment);
  }, [initializePayment, onReady]);

  return null;
};

export default PaystackLauncher;
