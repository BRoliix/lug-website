"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface MarqueeImage {
  src: string;
  alt: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  "data-ai-hint"?: string;
}

export interface ThreeDMarqueeProps {
  images: MarqueeImage[];
  className?: string;
  cols?: number;
  onImageClick?: (image: MarqueeImage, index: number) => void;
}

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images,
  className = "",
  cols = 4,
  onImageClick,
}) => {
  const isMobile = useIsMobile();
  const [numCols, setNumCols] = useState(cols);

  useEffect(() => {
    setNumCols(isMobile ? 2 : cols);
  }, [isMobile, cols]);

  if (!images || images.length === 0) {
    return null;
  }

  const groupSize = Math.ceil(images.length / numCols);
  const imageGroups = Array.from({ length: numCols }, (_, index) => {
    const start = index * groupSize;
    const end = start + groupSize;
    return images.slice(start, end);
  });

  const handleImageClick = (image: MarqueeImage, globalIndex: number) => {
    if (onImageClick) {
      onImageClick(image, globalIndex);
    } else if (image.href) {
      window.open(image.href, image.target || "_self");
    }
  };

  const MarqueeColumn = ({
    images,
    columnIndex,
  }: {
    images: MarqueeImage[];
    columnIndex: number;
  }) => {
    const isEven = columnIndex % 2 === 0;
    const duration = isEven ? 30 : 40;

    const columnContent = (
      <>
        {images.map((image, imgIdx) => {
          const globalIndex = columnIndex * groupSize + imgIdx;
          const isClickable = image.href || onImageClick;
          return (
            <div
              key={`img-col-${columnIndex}-${imgIdx}`}
              className="relative mb-4 sm:mb-6"
            >
              <motion.img
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                src={image.src}
                alt={image.alt}
                className={cn(
                  "w-full max-w-none sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] rounded-lg object-cover ring-1 ring-gray-300/30 dark:ring-gray-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-video",
                  isClickable ? "cursor-pointer" : ""
                )}
                onClick={() => handleImageClick(image, globalIndex)}
                data-ai-hint={image["data-ai-hint"]}
              />
            </div>
          );
        })}
      </>
    );

    return (
      <div className="flex flex-col items-center gap-0 overflow-hidden">
        <motion.div
          className="flex flex-col"
          animate={{
            y: isEven ? ["0%", "-100%"] : ["-100%", "0%"],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="flex flex-col pb-4 sm:pb-6">{columnContent}</div>
          <div className="flex flex-col pb-4 sm:pb-6">{columnContent}</div>
        </motion.div>
      </div>
    );
  };

  return (
    <section
      className={cn("mx-auto block h-full overflow-hidden w-full max-w-full", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        className="flex w-full h-full items-center justify-center px-2 sm:px-4"
        style={{
          transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg)",
        }}
      >
        <div className="w-full overflow-hidden scale-110 sm:scale-125 md:scale-100 max-w-full">
          <div
            className={`relative grid h-full w-full origin-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 transform`}
          >
            {imageGroups.map((imagesInGroup, idx) => (
              <MarqueeColumn
                key={`column-${idx}`}
                images={imagesInGroup}
                columnIndex={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
