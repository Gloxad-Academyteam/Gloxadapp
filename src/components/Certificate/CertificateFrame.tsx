"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import Certificate from "./index";

type TProps = React.ComponentProps<typeof Certificate> & {
  // Show at full size (used while the PDF is being captured)
  full?: boolean;
};

// The certificate is drawn at 800 by 600. This shrinks it to fit narrow screens, so it never scrolls sideways.
const CertificateFrame = forwardRef<HTMLDivElement, TProps>(({ full, ...certificate }, ref) => {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / 800));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const s = full ? 1 : scale;
  return (
    <div ref={outer} className="mx-auto w-full max-w-[800px]" style={{ height: 600 * s }}>
      <div style={{ width: 800, height: 600, transform: `scale(${s})`, transformOrigin: "top left" }}>
        <Certificate ref={ref} {...certificate} />
      </div>
    </div>
  );
});

CertificateFrame.displayName = "CertificateFrame";

export default CertificateFrame;
