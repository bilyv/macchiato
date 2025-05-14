import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Gallery = () => {
  // Gallery images array
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
      alt: "Hotel Exterior",
      category: "Exterior"
    },
    {
      src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070",
      alt: "Luxury Suite",
      category: "Rooms"
    },
    {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
      alt: "Penthouse Bedroom",
      category: "Rooms"
    },
    {
      src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074",
      alt: "Bathroom",
      category: "Rooms"
    },
    {
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
      alt: "Hotel Restaurant",
      category: "Dining"
    },
    {
      src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070",
      alt: "Swimming Pool",
      category: "Amenities"
    },
    {
      src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070",
      alt: "Spa Treatment Room",
      category: "Spa"
    },
    {
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070",
      alt: "Hotel Lobby",
      category: "Interior"
    },
    {
      src: "https://images.unsplash.com/photo-1540304453527-62f979142a17?q=80&w=2070",
      alt: "Hotel Bar",
      category: "Dining"
    },
    {
      src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070",
      alt: "Fitness Center",
      category: "Amenities"
    },
    {
      src: "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070",
      alt: "Executive Meeting Room",
      category: "Business"
    },
    {
      src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070",
      alt: "Ocean View",
      category: "Views"
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
              Photo Gallery
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Explore our elegant spaces through our carefully curated photo gallery showcasing the beauty of Macchiato Suites.
            </p>
          </div>
        </div>
      </section>
      
      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg group">
                <div className="relative">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-semibold">{image.alt}</p>
                      <p className="text-sm text-white/80">{image.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Virtual Tour Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-[#8A5A44]">
              Virtual Tour
            </h2>
            <p className="text-lg text-neutral-600">
              Take a virtual walk through our luxurious hotel and experience the elegance of Macchiato Suites.
            </p>
          </div>
          
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
            {/* This would typically be an iframe with a virtual tour or video */}
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-[#8A5A44]">Virtual Tour Experience</h3>
                <p className="text-neutral-600 mb-6">Our interactive virtual tour is currently being updated.</p>
                <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
                  Notify Me When Available
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Experience the Beauty in Person
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Pictures can only tell part of the story. Book your stay today to experience the true luxury of Macchiato Suites.
          </p>
          <Button size="lg" className="bg-white text-[#C45D3A] hover:bg-neutral-100">
            Book Your Stay <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Gallery;
