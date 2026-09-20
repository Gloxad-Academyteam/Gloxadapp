import { useEffect, useRef, useCallback } from "react";

type CarouselItem = {
  id: string;
  content: React.ReactNode;
};

type Carousel3DProps = {
  items: CarouselItem[];
  autoRotateSpeed?: number; // ms per full revolution
  radiusX?: number; // horizontal radius of the ellipse
  radiusZ?: number; // depth radius of the ellipse
  tiltY?: number; // vertical offset for the tilt
  itemSize?: number; // base size of each item container
};

const Carousel3D = ({
  items,
  autoRotateSpeed = 14000,
  radiusX = 300,
  radiusZ = 150,
  tiltY = 60,
  itemSize = 100,
}: Carousel3DProps) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotationRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const itemCount = items.length;
  const angleStep = (2 * Math.PI) / itemCount;
  const speed = (2 * Math.PI) / autoRotateSpeed; // radians per ms

  const updatePositions = useCallback(() => {
    const rotation = rotationRef.current;

    for (let i = 0; i < itemCount; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;

      const angle = rotation + i * angleStep;

      // Position on the ellipse
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ;

      // Normalize z to 0-1 range (1 = front, 0 = back)
      const normalizedZ = (z + radiusZ) / (2 * radiusZ);

      // Scale: front items are bigger, back items are smaller
      const scale = 0.5 + normalizedZ * 0.6;

      // Opacity: front items are fully visible, back items fade
      const opacity = 0.3 + normalizedZ * 0.7;

      // Y offset: back items go UP, front items go DOWN (tilted ring)
      const y = (normalizedZ - 0.5) * 2 * tiltY;

      // Z-index: front items on top
      const zIndex = Math.round(normalizedZ * 100);

      // Direct DOM update — no React re-render
      const tx = x + radiusX;
      el.style.transform = `translate3d(${tx}px, ${y}px, 0) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(zIndex);
    }
  }, [itemCount, angleStep, radiusX, radiusZ, tiltY]);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      rotationRef.current += speed * delta;
      updatePositions();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, updatePositions]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: radiusX * 2 + itemSize,
          height: itemSize + tiltY * 2 + 40,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              marginTop: -itemSize / 2,
              width: itemSize,
              height: itemSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform, opacity",
              pointerEvents: "none",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;
