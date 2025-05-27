import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Utensils, ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

// Menu item interface (matching admin panel structure)
interface MenuItem {
  id: string;
  item_name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner';
  preparation_time: number;
  tags: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Menu image interface (matching admin panel structure)
interface MenuImage {
  id: string;
  title: string;
  category: 'drinks' | 'desserts' | 'others';
  image_url: string;
  created_at: string;
  updated_at: string;
}

const Menu = () => {
  const [activeTab, setActiveTab] = useState("breakfast");

  // State for API data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuImages, setMenuImages] = useState<MenuImage[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      // Fetch menu items
      try {
        const itemsResponse = await api.menu.getAllItems();
        console.log('Menu items response:', itemsResponse);

        if (itemsResponse && itemsResponse.data && Array.isArray(itemsResponse.data)) {
          // Validate and sanitize the data
          const validatedItems = itemsResponse.data.map((item: any) => ({
            ...item,
            id: item.id || '',
            item_name: item.item_name || '',
            category: item.category || 'breakfast',
            description: item.description || '',
            price: typeof item.price === 'number' ? item.price : (typeof item.price === 'string' ? parseFloat(item.price) || 0 : 0),
            preparation_time: typeof item.preparation_time === 'number' ? item.preparation_time : (typeof item.preparation_time === 'string' ? parseInt(item.preparation_time) || 0 : 0),
            tags: Array.isArray(item.tags) ? item.tags : [],
            image_url: item.image_url || null,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString()
          }));
          setMenuItems(validatedItems);
          setItemsError(null);
        } else {
          console.warn('Invalid menu items response structure:', itemsResponse);
          setMenuItems([]);
          setItemsError('No menu items available');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems([]);
        setItemsError('Failed to load menu items');
      } finally {
        setIsLoadingItems(false);
      }

      // Fetch menu images
      try {
        const imagesResponse = await api.menu.getAllImages();
        console.log('Menu images response:', imagesResponse);

        if (imagesResponse && imagesResponse.data && Array.isArray(imagesResponse.data)) {
          // Validate and sanitize the data
          const validatedImages = imagesResponse.data.map((image: any) => ({
            ...image,
            id: image.id || '',
            title: image.title || '',
            category: image.category || 'others',
            image_url: image.image_url || '',
            created_at: image.created_at || new Date().toISOString(),
            updated_at: image.updated_at || new Date().toISOString()
          }));
          setMenuImages(validatedImages);
          setImagesError(null);
        } else {
          console.warn('Invalid menu images response structure:', imagesResponse);
          setMenuImages([]);
          setImagesError('No menu images available');
        }
      } catch (error) {
        console.error('Error fetching menu images:', error);
        setMenuImages([]);
        setImagesError('Failed to load menu images');
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter menu items by category and limit to 3 items per category
  const breakfastItems = menuItems.filter(item => item.category === "breakfast").slice(0, 3);
  const lunchItems = menuItems.filter(item => item.category === "lunch").slice(0, 3);
  const dinnerItems = menuItems.filter(item => item.category === "dinner").slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A5A44]">
              Our Restaurant Menu
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Experience culinary excellence at Macchiato Suites. Our restaurant offers a diverse menu of gourmet dishes prepared with the finest locally-sourced ingredients.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#EEDFD0] mb-3">
              <Utensils className="h-5 w-5 text-[#C45D3A]" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-[#8A5A44]">Suggested for You</h3>
          </div>
          <Tabs defaultValue="breakfast" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#F9F5F2]">
                <TabsTrigger value="breakfast" className="data-[state=active]:bg-[#EEDFD0] data-[state=active]:text-[#8A5A44]">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch" className="data-[state=active]:bg-[#EEDFD0] data-[state=active]:text-[#8A5A44]">Lunch</TabsTrigger>
                <TabsTrigger value="dinner" className="data-[state=active]:bg-[#EEDFD0] data-[state=active]:text-[#8A5A44]">Dinner</TabsTrigger>
              </TabsList>
            </div>

            {/* Breakfast Menu */}
            <TabsContent value="breakfast" className="animate-fade-in">
              {isLoadingItems ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#8A5A44]" />
                  <span className="ml-2 text-[#8A5A44]">Loading breakfast items...</span>
                </div>
              ) : itemsError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{itemsError}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : breakfastItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600">No breakfast items available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {breakfastItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070"}
                          alt={item.item_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                          <h3 className="text-base sm:text-lg font-semibold text-[#8A5A44] break-words">{item.item_name}</h3>
                          <span className="font-medium text-[#C45D3A] text-sm sm:text-base flex-shrink-0">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 mb-3 break-words leading-relaxed">{item.description}</p>
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                            {item.preparation_time} min
                          </span>
                          {item.tags.map((tag, index) => (
                            <span key={index} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full break-words">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Lunch Menu */}
            <TabsContent value="lunch" className="animate-fade-in">
              {isLoadingItems ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#8A5A44]" />
                  <span className="ml-2 text-[#8A5A44]">Loading lunch items...</span>
                </div>
              ) : itemsError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{itemsError}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : lunchItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600">No lunch items available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {lunchItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899"}
                          alt={item.item_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                          <h3 className="text-base sm:text-lg font-semibold text-[#8A5A44] break-words">{item.item_name}</h3>
                          <span className="font-medium text-[#C45D3A] text-sm sm:text-base flex-shrink-0">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 mb-3 break-words leading-relaxed">{item.description}</p>
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                            {item.preparation_time} min
                          </span>
                          {item.tags.map((tag, index) => (
                            <span key={index} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full break-words">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Dinner Menu */}
            <TabsContent value="dinner" className="animate-fade-in">
              {isLoadingItems ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#8A5A44]" />
                  <span className="ml-2 text-[#8A5A44]">Loading dinner items...</span>
                </div>
              ) : itemsError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{itemsError}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : dinnerItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600">No dinner items available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dinnerItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070"}
                          alt={item.item_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                          <h3 className="text-base sm:text-lg font-semibold text-[#8A5A44] break-words">{item.item_name}</h3>
                          <span className="font-medium text-[#C45D3A] text-sm sm:text-base flex-shrink-0">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 mb-3 break-words leading-relaxed">{item.description}</p>
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                            {item.preparation_time} min
                          </span>
                          {item.tags.map((tag, index) => (
                            <span key={index} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full break-words">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>


          </Tabs>
        </div>
      </section>

      {/* Menu Navigation Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4 text-[#8A5A44]">Our Menu</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Browse through our carefully crafted menus featuring seasonal ingredients and chef's specialties.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {isLoadingImages ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#8A5A44]" />
                <span className="ml-2 text-[#8A5A44]">Loading menu images...</span>
              </div>
            ) : imagesError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{imagesError}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : menuImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No menu images available at the moment.</p>
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {menuImages.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-2">
                        <div className="relative rounded-lg overflow-hidden group">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                            <h3 className="font-serif font-semibold text-lg">{item.title}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm opacity-90 capitalize">{item.category}</span>
                            </div>
                          </div>

                          {/* View Button */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
                                <Eye className="h-4 w-4" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
                              <div className="relative">
                                <img
                                  src={item.image_url}
                                  alt={item.title}
                                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070";
                                  }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                                  <h3 className="font-serif font-semibold text-xl text-white mb-2">{item.title}</h3>
                                  <span className="text-sm text-white/90 capitalize bg-[#C45D3A] px-3 py-1 rounded-full">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-6 gap-4">
                  <CarouselPrevious className="relative inset-0 translate-y-0 bg-white hover:bg-[#EEDFD0] border-[#E8C3A3] text-[#8A5A44]" />
                  <CarouselNext className="relative inset-0 translate-y-0 bg-white hover:bg-[#EEDFD0] border-[#E8C3A3] text-[#8A5A44]" />
                </div>
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Chef's Note Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#EEDFD0] mb-4">
              <Utensils className="h-6 w-6 text-[#C45D3A]" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 text-[#8A5A44]">A Note from Our Chef</h2>
            <p className="text-lg text-neutral-600 mb-6">
              "At Macchiato Suites Restaurant, we are committed to creating memorable dining experiences. Our menu celebrates seasonal ingredients sourced from local farmers and producers. Each dish is crafted with passion and precision, honoring traditional techniques while embracing innovative flavors."
            </p>
            <p className="text-lg font-medium text-[#8A5A44]">— Chef Isabella Martinez</p>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Reserve Your Table
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience our exquisite menu and impeccable service. Make a reservation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingFormDialog
              buttonText="Book a Table"
              buttonSize="lg"
              buttonClassName="bg-white text-[#C45D3A] hover:bg-neutral-100"
              showArrow={true}
            />
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Special Events
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
