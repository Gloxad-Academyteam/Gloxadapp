"use client";

import { ReactNode, useEffect, useState } from "react";

type CategoryImageProps = {
  src?: string;
  className?: string;
  fallback: ReactNode;
};

// Shows the fallback when there is no image or it fails to load, instead of a broken-image icon.
// The <img> only renders after mount: a server-rendered one can fail before React attaches onError.
const CategoryImage = ({ src, className, fallback }: CategoryImageProps) => {
  const [mounted, setMounted] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string>();

  useEffect(() => setMounted(true), []);

  if (!mounted || !src || failedSrc === src) return <>{fallback}</>;

  return <img src={src} alt="" className={className} onError={() => setFailedSrc(src)} />;
};

export default CategoryImage;
