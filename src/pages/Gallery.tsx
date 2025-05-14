import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, MapPin, Utensils, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HorizontalScrollGallery from "@/components/HorizontalScrollGallery";

const Gallery = () => {
  // State for active category
  const [activeCategory, setActiveCategory] = useState("All");

  // Gallery images array with new categories
  const galleryImages = [
    // Attractions
    {
      src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2069",
      alt: "Eiffel Tower",
      category: "Attractions",
      description: "Famous landmark just a short drive from our hotel"
    },
    {
      src: "https://images.unsplash.com/photo-1564594736624-def7a10ab047?q=80&w=2574",
      alt: "Modern Art Museum",
      category: "Attractions",
      description: "Contemporary art exhibits within walking distance"
    },
    {
      src: "https://images.unsplash.com/photo-1569959220744-ff553533f492?q=80&w=2573",
      alt: "Historical Cathedral",
      category: "Attractions",
      description: "Gothic architecture from the 14th century"
    },
    {
      src: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2670",
      alt: "Amusement Park",
      category: "Attractions",
      description: "Family fun just 15 minutes from the hotel"
    },

    // Neighborhoods
    {
      src: "https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=2670",
      alt: "Historic District",
      category: "Neighborhoods",
      description: "Charming streets with boutique shops"
    },
    {
      src: "https://images.unsplash.com/photo-1603460217649-decaca7e73c4?q=80&w=2574",
      alt: "Riverside Quarter",
      category: "Neighborhoods",
      description: "Scenic walks along the waterfront"
    },
    {
      src: "https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=2670",
      alt: "Arts District",
      category: "Neighborhoods",
      description: "Vibrant area with galleries and cafes"
    },
    {
      src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2664",
      alt: "Local Market Square",
      category: "Neighborhoods",
      description: "Experience authentic local culture"
    },

    // Foods
    {
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670",
      alt: "Fine Dining Restaurant",
      category: "Foods",
      description: "Award-winning cuisine at our signature restaurant"
    },
    {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670",
      alt: "Local Delicacies",
      category: "Foods",
      description: "Traditional dishes prepared with local ingredients"
    },
    {
      src: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=2670",
      alt: "Artisanal Pastries",
      category: "Foods",
      description: "Freshly baked goods from our in-house patisserie"
    },
    {
      src: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2574",
      alt: "Coffee Experience",
      category: "Foods",
      description: "Premium coffee blends at our Macchiato Bar"
    },

    // Events
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2669",
      alt: "Wedding Reception",
      category: "Events",
      description: "Elegant venues for your special day"
    },
    {
      src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612",
      alt: "Business Conference",
      category: "Events",
      description: "State-of-the-art facilities for corporate events"
    },
    {
      src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670",
      alt: "Music Festival",
      category: "Events",
      description: "Annual cultural events near our hotel"
    },
    {
      src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2670",
      alt: "Cooking Workshop",
      category: "Events",
      description: "Interactive culinary experiences with our chefs"
    }
  ];

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

          <HorizontalScrollGallery
            images={galleryImages.filter(img => img.category === "Attractions")}
            speed="medium"
          />
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

          <HorizontalScrollGallery
            images={galleryImages.filter(img => img.category === "Neighborhoods")}
            speed="slow"
            reverse={true}
          />
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

          <HorizontalScrollGallery
            images={galleryImages.filter(img => img.category === "Foods")}
            speed="medium"
          />
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

          <HorizontalScrollGallery
            images={galleryImages.filter(img => img.category === "Events")}
            speed="fast"
            reverse={true}
          />
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
            <Button size="lg" className="bg-white text-[#C45D3A] hover:bg-neutral-100">
              Book Your Stay <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
