import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Utensils, Calendar, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HorizontalScrollGallery from "@/components/HorizontalScrollGallery";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

// Interface for gallery images from API
interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  category: 'attractions' | 'neighbourhood' | 'foods' | 'events';
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Interface for transformed images for HorizontalScrollGallery
interface TransformedGalleryImage {
  src: string;
  alt: string;
  category: string;
  description: string;
}

const Gallery = () => {
  // State for active category
  const [activeCategory, setActiveCategory] = useState("All");

  // State for gallery images from API
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to map API categories to display categories
  const mapCategoryToDisplay = (apiCategory: string): string => {
    switch (apiCategory) {
      case 'attractions':
        return 'Attractions';
      case 'neighbourhood':
        return 'Neighborhoods';
      case 'foods':
        return 'Foods';
      case 'events':
        return 'Events';
      default:
        return apiCategory;
    }
  };

  // Function to transform API images to component format
  const transformGalleryImages = (images: GalleryImage[]): TransformedGalleryImage[] => {
    return images.map(image => ({
      src: image.image_url,
      alt: image.title,
      category: mapCategoryToDisplay(image.category),
      description: image.description || ''
    }));
  };

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.gallery.getAll();
        if (response.data) {
          setGalleryImages(response.data);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setError('Failed to load gallery images. Please try again later.');
        toast.error('Failed to load gallery images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Get transformed images for display
  const transformedImages = transformGalleryImages(galleryImages);

  // Function to get images by category
  const getImagesByCategory = (category: string): TransformedGalleryImage[] => {
    return transformedImages.filter(img => img.category === category);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#8A5A44]" />
            <p className="text-lg text-neutral-600">Loading gallery images...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A5A44]">
              Discover Our Surroundings
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Explore the beauty of our hotel's surroundings through our curated gallery showcasing local attractions, vibrant neighborhoods, culinary delights, and exciting events.
            </p>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${activeCategory === "Attractions" ? "bg-[#EEDFD0]" : "hover:bg-gray-50"}`}
              onClick={() => {
                setActiveCategory(activeCategory === "Attractions" ? "All" : "Attractions");
                document.getElementById("attractions-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="h-12 w-12 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mb-2">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-[#8A5A44]">Attractions</h3>
            </div>

            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${activeCategory === "Neighborhoods" ? "bg-[#EEDFD0]" : "hover:bg-gray-50"}`}
              onClick={() => {
                setActiveCategory(activeCategory === "Neighborhoods" ? "All" : "Neighborhoods");
                document.getElementById("neighborhoods-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="h-12 w-12 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-[#8A5A44]">Neighborhoods</h3>
            </div>

            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${activeCategory === "Foods" ? "bg-[#EEDFD0]" : "hover:bg-gray-50"}`}
              onClick={() => {
                setActiveCategory(activeCategory === "Foods" ? "All" : "Foods");
                document.getElementById("foods-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="h-12 w-12 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mb-2">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-[#8A5A44]">Foods</h3>
            </div>

            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${activeCategory === "Events" ? "bg-[#EEDFD0]" : "hover:bg-gray-50"}`}
              onClick={() => {
                setActiveCategory(activeCategory === "Events" ? "All" : "Events");
                document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="h-12 w-12 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-[#8A5A44]">Events</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions Gallery */}
      <section id="attractions-section" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mr-3">
              <Camera className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#8A5A44]">Attractions</h2>
          </div>

          {getImagesByCategory("Attractions").length > 0 ? (
            <HorizontalScrollGallery
              images={getImagesByCategory("Attractions")}
              speed="medium"
            />
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Attractions Yet</h3>
              <p className="text-gray-500">We're currently updating our attractions gallery. Check back soon for amazing local sights!</p>
            </div>
          )}
        </div>
      </section>

      {/* Neighborhoods Gallery */}
      <section id="neighborhoods-section" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mr-3">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#8A5A44]">Neighborhoods</h2>
          </div>

          {getImagesByCategory("Neighborhoods").length > 0 ? (
            <HorizontalScrollGallery
              images={getImagesByCategory("Neighborhoods")}
              speed="slow"
              reverse={true}
            />
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Neighborhoods Yet</h3>
              <p className="text-gray-500">We're currently updating our neighborhoods gallery. Check back soon for local area highlights!</p>
            </div>
          )}
        </div>
      </section>

      {/* Foods Gallery */}
      <section id="foods-section" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mr-3">
              <Utensils className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#8A5A44]">Foods</h2>
          </div>

          {getImagesByCategory("Foods").length > 0 ? (
            <HorizontalScrollGallery
              images={getImagesByCategory("Foods")}
              speed="medium"
            />
          ) : (
            <div className="text-center py-12">
              <Utensils className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Food Gallery Yet</h3>
              <p className="text-gray-500">We're currently updating our food gallery. Check back soon for delicious culinary experiences!</p>
            </div>
          )}
        </div>
      </section>

      {/* Events Gallery */}
      <section id="events-section" className="py-8 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-[#C45D3A] text-white flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#8A5A44]">Events</h2>
          </div>

          {getImagesByCategory("Events").length > 0 ? (
            <HorizontalScrollGallery
              images={getImagesByCategory("Events")}
              speed="fast"
              reverse={true}
            />
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Events Yet</h3>
              <p className="text-gray-500">We're currently updating our events gallery. Check back soon for exciting upcoming events!</p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-[#8A5A44]">
              Explore the Area
            </h2>
            <p className="text-lg text-neutral-600">
              Discover the vibrant surroundings of Macchiato Suites with our interactive map highlighting local points of interest.
            </p>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
            {/* This would typically be an iframe with an interactive map */}
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-[#8A5A44]">Interactive Area Map</h3>
                <p className="text-neutral-600 mb-6">Our interactive map is currently being updated with the latest local attractions.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
                    Download Area Guide
                  </Button>
                  <Button variant="outline" className="border-[#C45D3A] text-[#C45D3A] hover:bg-[#EEDFD0]">
                    Contact Concierge
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Explore the City from Our Central Location
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stay at Macchiato Suites and enjoy easy access to the city's best attractions, neighborhoods, restaurants, and events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingFormDialog
              buttonText="Book Your Stay"
              buttonSize="lg"
              buttonClassName="bg-white text-[#C45D3A] hover:bg-neutral-100"
              showArrow={true}
            />
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Our Concierge
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
