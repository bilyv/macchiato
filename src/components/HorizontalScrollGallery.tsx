import { useRef, useState, useEffect } from "react";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  description: string;
}

interface HorizontalScrollGalleryProps {
  images: GalleryImage[];
  speed?: "slow" | "medium" | "fast";
  reverse?: boolean;
}

const HorizontalScrollGallery = ({
  images,
  speed = "medium",
  reverse = false
}: HorizontalScrollGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine animation class based on speed and direction
  const getAnimationClass = () => {
    const direction = reverse ? "-reverse" : "";

    switch (speed) {
      case "slow":
        return `animate-scroll-slow${direction}`;
      case "fast":
        return `animate-scroll-fast${direction}`;
      default:
        return `animate-scroll${direction}`;
    }
  };

  // Check if animation should be enabled
  // Desktop: 4+ images, Mobile: 2+ images
  const shouldAnimate = () => {
    if (isMobile) {
      return images.length >= 2;
    }
    return images.length >= 4;
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full py-4"
    >
      {shouldAnimate() ? (
        // Animated scrolling gallery for 4+ images (desktop) or 2+ images (mobile)
        <div className="flex overflow-x-hidden w-full">
          <div className={`flex ${getAnimationClass()}`}>
            {/* First set of images */}
            {images.map((image, index) => (
              <div
                key={`${image.category}-${index}-first`}
                className="min-w-[300px] max-w-[300px] mx-3 overflow-hidden rounded-lg shadow-md group"
              >
                <div className="relative">
                  <div className="overflow-hidden h-[200px]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070';
                      }}
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-[#8A5A44] mb-1 truncate">{image.alt}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">{image.description}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#EEDFD0] text-[#8A5A44]">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicate set of images for seamless looping */}
            {images.map((image, index) => (
              <div
                key={`${image.category}-${index}-second`}
                className="min-w-[300px] max-w-[300px] mx-3 overflow-hidden rounded-lg shadow-md group"
              >
                <div className="relative">
                  <div className="overflow-hidden h-[200px]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070';
                      }}
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-[#8A5A44] mb-1 truncate">{image.alt}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">{image.description}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#EEDFD0] text-[#8A5A44]">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Static grid for fewer images
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {images.map((image, index) => (
              <div
                key={`${image.category}-${index}-static`}
                className="w-[300px] overflow-hidden rounded-lg shadow-md group"
              >
                <div className="relative">
                  <div className="overflow-hidden h-[200px]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070';
                      }}
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-[#8A5A44] mb-1 truncate">{image.alt}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">{image.description}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#EEDFD0] text-[#8A5A44]">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gradient overlays for smooth fade effect - only show when animating */}
      {shouldAnimate() && (
        <>
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default HorizontalScrollGallery;
