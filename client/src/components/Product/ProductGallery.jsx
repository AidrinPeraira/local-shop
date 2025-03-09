import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from "../../components/ui/aspect-ratio";
import { cn } from '../../lib/utils';


const ProductGallery = ({ images, video }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const mediaItems = video ? [...images, 'video'] : images;
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    setShowVideo(video ? mediaItems[currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1] === 'video' : false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    setShowVideo(video ? mediaItems[currentIndex === mediaItems.length - 1 ? 0 : currentIndex + 1] === 'video' : false);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setShowVideo(video ? mediaItems[index] === 'video' : false);
  };

  if (images.length === 0) {
    return (
      <div className="relative border rounded overflow-hidden bg-gray-100">
        <AspectRatio ratio={1 / 1}>
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No image available
          </div>
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Thumbnails */}
      <div className="col-span-1 flex flex-col space-y-3 max-h-[500px] overflow-y-auto">
        {images.map((image, index) => (
          <button
            key={`image-${index}`}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              "relative border rounded overflow-hidden h-20",
              currentIndex === index && !showVideo ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            )}
          >
            <AspectRatio ratio={1 / 1}>
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </button>
        ))}
        {video && (
          <button
            onClick={() => {
              setCurrentIndex(images.length);
              setShowVideo(true);
            }}
            className={cn(
              "relative border rounded overflow-hidden h-20",
              showVideo ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            )}
          >
            <AspectRatio ratio={1 / 1}>
              <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-primary">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </AspectRatio>
          </button>
        )}
      </div>

      {/* Main Display */}
      <div className="col-span-3 relative">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 border">
          <AspectRatio ratio={1 / 1}>
            {showVideo && video ? (
              <video 
                src={video} 
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={images[currentIndex]}
                alt={`Product ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </AspectRatio>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
