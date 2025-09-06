"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, easeOut } from "framer-motion";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Draggable3DImageRingProps {
  images: string[];
  width?: number;
  perspective?: number;
  imageDistance?: number;
  initialRotation?: number;
  animationDuration?: number;
  staggerDelay?: number;
  hoverOpacity?: number;
  containerClassName?: string;
  ringClassName?: string;
  imageClassName?: string;
  backgroundColor?: string;
  draggable?: boolean;
  ease?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate";
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  mobileScaleFactor?: number;
  tabletScaleFactor?: number;
  inertiaPower?: number;
  inertiaTimeConstant?: number;
  inertiaVelocityMultiplier?: number;
  rotationSpeed?: number;
  rotationDirection?: "clockwise" | "counter-clockwise";
}

export function Draggable3DImageRing({
  images,
  width = 300,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 180,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  hoverOpacity = 0.5,
  containerClassName,
  ringClassName,
  imageClassName,
  backgroundColor,
  draggable = true,
  mobileBreakpoint = 640,
  tabletBreakpoint = 1024,
  mobileScaleFactor = 0.6,
  tabletScaleFactor = 0.8,
  inertiaPower = 0.8,
  inertiaTimeConstant = 300,
  inertiaVelocityMultiplier = 20,
  rotationSpeed = 0,
  rotationDirection = "clockwise"
}: Draggable3DImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationY = useMotionValue(initialRotation);
  const startX = useRef<number>(0);
  const currentRotationY = useRef<number>(initialRotation);
  const isDragging = useRef<boolean>(false);
  const velocity = useRef<number>(0);
  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);
  const [responsiveDimensions, setResponsiveDimensions] = useState({ width, perspective: perspective, imageDistance });

  const angle = useMemo(() => 360 / images.length, [images.length]);

  const getBgPos = (imageIndex: number, currentRot: number, scale: number) => {
    const scaledImageDistance = responsiveDimensions.imageDistance * scale;
    const effectiveRotation = currentRot - 180 - imageIndex * angle;
    const parallaxOffset = ((effectiveRotation % 360 + 360) % 360) / 360;
    return `${-(parallaxOffset * (scaledImageDistance / 1.5))}px 0px`;
  };

  useEffect(() => {
    let animationFrameId: number;
    const continuousRotation = () => {
      if (!isDragging.current && rotationSpeed > 0) {
        const direction = rotationDirection === 'clockwise' ? 1 : -1;
        rotationY.set(rotationY.get() + rotationSpeed * direction);
      }
      animationFrameId = requestAnimationFrame(continuousRotation);
    };
    if (rotationSpeed > 0) {
      animationFrameId = requestAnimationFrame(continuousRotation);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [rotationSpeed, rotationDirection, rotationY]);

  useEffect(() => {
    const unsubscribe = rotationY.on("change", (latestRotation) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((imgElement, i) => {
          if (imgElement instanceof HTMLElement) {
            imgElement.style.backgroundPosition = getBgPos(
              i,
              latestRotation,
              currentScale
            );
          }
        });
      }
      currentRotationY.current = latestRotation;
    });
    return () => unsubscribe();
  }, [rotationY, images.length, currentScale, angle, responsiveDimensions.imageDistance]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      let newScale = 1;
      let newWidth = width;
      let newPerspective = perspective;
      let newImageDistance = imageDistance;

      if (viewportWidth <= mobileBreakpoint) {
        newScale = mobileScaleFactor;
        newWidth = Math.min(width * 0.7, viewportWidth * 0.8);
        newPerspective = perspective * 0.6;
        newImageDistance = imageDistance * 0.6;
      } else if (viewportWidth <= tabletBreakpoint) {
        newScale = tabletScaleFactor;
        newWidth = Math.min(width * 0.85, viewportWidth * 0.7);
        newPerspective = perspective * 0.8;
        newImageDistance = imageDistance * 0.8;
      }

      setCurrentScale(newScale);
      setResponsiveDimensions({
        width: newWidth,
        perspective: newPerspective,
        imageDistance: newImageDistance
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint, tabletBreakpoint, mobileScaleFactor, tabletScaleFactor, width, perspective, imageDistance]);

  useEffect(() => {
    setShowImages(true);
  }, []);

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!draggable || !isDragging.current) return;
    const clientX = "touches" in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    const deltaX = clientX - startX.current;
    velocity.current = -deltaX * 0.5;
    rotationY.set(currentRotationY.current + velocity.current);
    startX.current = clientX;
    currentRotationY.current = rotationY.get();
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (ringRef.current) {
      ringRef.current.style.cursor = "grab";
    }
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", handleDragEnd);
    if (draggable) {
      const velocityBoost = velocity.current * inertiaVelocityMultiplier;
      animate(rotationY, rotationY.get() + velocityBoost, {
        type: "inertia",
        velocity: velocityBoost,
        power: inertiaPower,
        timeConstant: inertiaTimeConstant,
        restDelta: 0.5,
        modifyTarget: (target) => Math.round(target / angle) * angle,
      });
    }
    velocity.current = 0;
  };

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    isDragging.current = true;
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    startX.current = clientX;
    velocity.current = 0;
    rotationY.stop();

    if (ringRef.current) {
      (ringRef.current as HTMLElement).style.cursor = "grabbing";
    }
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", handleDragEnd);
  };

  const imageVariants = {
    hidden: { y: 200, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * staggerDelay,
        duration: animationDuration,
        ease: easeOut,
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full max-w-full overflow-hidden select-none relative flex items-center justify-center px-2 sm:px-4",
        containerClassName
      )}
      style={{
        backgroundColor,
        minHeight: "300px",
      }}
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          perspective: `${responsiveDimensions.perspective}px`,
          width: `${responsiveDimensions.width}px`,
          height: `${responsiveDimensions.width * 1.2}px`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <motion.div
          ref={ringRef}
          className={cn(
            "w-full h-full absolute",
            ringClassName
          )}
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotationY,
            cursor: draggable ? "grab" : "default",
          }}
        >
          <AnimatePresence>
            {showImages && images.map((imageUrl, index) => (
              <motion.div
                key={index}
                className={cn(
                  "w-full h-full absolute rounded-lg overflow-hidden shadow-lg",
                  imageClassName
                )}
                style={{
                  transformStyle: "preserve-3d",
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backfaceVisibility: "hidden",
                  rotateY: index * -angle,
                  z: -responsiveDimensions.imageDistance * currentScale,
                  transformOrigin: `50% 50% ${responsiveDimensions.imageDistance * currentScale}px`,
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={imageVariants}
                custom={index}
                transition={{
                  opacity: { duration: 0.15 }
                }}
                whileHover={{ opacity: 1 }}
                onHoverStart={() => {
                  if (isDragging.current || !draggable) return;
                  if (ringRef.current) {
                    Array.from(ringRef.current.children).forEach((imgEl, i) => {
                      if (i !== index) {
                        (imgEl as HTMLElement).style.opacity = `${hoverOpacity}`;
                      }
                    });
                  }
                }}
                onHoverEnd={() => {
                  if (isDragging.current || !draggable) return;
                  if (ringRef.current) {
                    Array.from(ringRef.current.children).forEach((imgEl) => {
                      (imgEl as HTMLElement).style.opacity = `1`;
                    });
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
