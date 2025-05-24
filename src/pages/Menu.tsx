import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingFormDialog } from "@/components/BookingFormDialog";
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

// Menu item interface
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isSpecial?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  imageUrl?: string;
}

// Menu image interface
interface MenuImage {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  category: string;
}

const Menu = () => {
  const [activeTab, setActiveTab] = useState("breakfast");

  // Sample menu images data
  const menuImages: MenuImage[] = [
    {
      id: "mi1",
      title: "Seasonal Brunch Menu",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
      price: 24.99,
      category: "brunch"
    },
    {
      id: "mi2",
      title: "Chef's Special Dinner",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069",
      price: 39.99,
      category: "dinner"
    },
    {
      id: "mi3",
      title: "Signature Dessert Platter",
      imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964",
      price: 18.99,
      category: "dessert"
    },
    {
      id: "mi4",
      title: "Gourmet Lunch Selection",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080",
      price: 29.99,
      category: "lunch"
    },
    {
      id: "mi5",
      title: "Weekend Breakfast Special",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2080",
      price: 22.99,
      category: "breakfast"
    }
  ];

  // Sample menu data
  const menuItems: MenuItem[] = [
    // Breakfast items
    {
      id: "b1",
      name: "Continental Breakfast",
      description: "A selection of freshly baked pastries, seasonal fruits, yogurt, and granola. Served with your choice of coffee, tea, or juice.",
      price: 18,
      category: "breakfast",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070"
    },
    {
      id: "b2",
      name: "Eggs Benedict",
      description: "Poached eggs on toasted English muffins with Canadian bacon and hollandaise sauce. Served with roasted potatoes.",
      price: 22,
      category: "breakfast",
      imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=2070"
    },
    {
      id: "b3",
      name: "Avocado Toast",
      description: "Smashed avocado on artisanal sourdough bread with cherry tomatoes, microgreens, and a poached egg.",
      price: 19,
      category: "breakfast",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1603046891744-76e6481cf539?q=80&w=1974"
    },
    {
      id: "b4",
      name: "Belgian Waffles",
      description: "Fluffy waffles topped with fresh berries, whipped cream, and maple syrup.",
      price: 17,
      category: "breakfast",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f35b6?q=80&w=2025"
    },

    // Lunch items
    {
      id: "l1",
      name: "Macchiato Signature Burger",
      description: "Premium beef patty with aged cheddar, caramelized onions, lettuce, tomato, and our special sauce on a brioche bun. Served with truffle fries.",
      price: 26,
      category: "lunch",
      isSpecial: true,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899"
    },
    {
      id: "l2",
      name: "Mediterranean Salad",
      description: "Mixed greens with cherry tomatoes, cucumber, red onion, Kalamata olives, feta cheese, and lemon-herb vinaigrette.",
      price: 18,
      category: "lunch",
      isVegetarian: true,
      isGlutenFree: true,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1984"
    },
    {
      id: "l3",
      name: "Grilled Salmon",
      description: "Herb-crusted salmon fillet with quinoa, roasted vegetables, and lemon butter sauce.",
      price: 28,
      category: "lunch",
      isGlutenFree: true,
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070"
    },
    {
      id: "l4",
      name: "Truffle Mushroom Risotto",
      description: "Creamy Arborio rice with wild mushrooms, truffle oil, and Parmesan cheese.",
      price: 24,
      category: "lunch",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c7?q=80&w=1974"
    },

    // Dinner items
    {
      id: "d1",
      name: "Filet Mignon",
      description: "8oz grass-fed beef tenderloin with garlic mashed potatoes, seasonal vegetables, and red wine reduction.",
      price: 42,
      category: "dinner",
      isSpecial: true,
      isGlutenFree: true,
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070"
    },
    {
      id: "d2",
      name: "Seafood Linguine",
      description: "Fresh pasta with shrimp, scallops, mussels, and calamari in a white wine and tomato sauce.",
      price: 36,
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070"
    },
    {
      id: "d3",
      name: "Rack of Lamb",
      description: "Herb-crusted lamb with roasted fingerling potatoes, glazed carrots, and mint jus.",
      price: 38,
      category: "dinner",
      imageUrl: "https://images.unsplash.com/photo-1514516345957-556ca7c90a34?q=80&w=1935"
    },
    {
      id: "d4",
      name: "Vegetable Wellington",
      description: "Roasted vegetables and mushroom duxelles wrapped in puff pastry with truffle sauce and microgreens.",
      price: 32,
      category: "dinner",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1673845529415-f75f941a5499?q=80&w=1974"
    },

    // Desserts
    {
      id: "ds1",
      name: "Chocolate Soufflé",
      description: "Warm chocolate soufflé with vanilla bean ice cream and raspberry coulis.",
      price: 14,
      category: "dessert",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?q=80&w=1974"
    },
    {
      id: "ds2",
      name: "Tiramisu",
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
      price: 12,
      category: "dessert",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1974"
    },
    {
      id: "ds3",
      name: "Crème Brûlée",
      description: "Vanilla custard with a caramelized sugar crust, served with fresh berries.",
      price: 13,
      category: "dessert",
      isVegetarian: true,
      isGlutenFree: true,
      imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=2070"
    },
    {
      id: "ds4",
      name: "Seasonal Fruit Tart",
      description: "Buttery pastry shell filled with vanilla custard and topped with fresh seasonal fruits.",
      price: 11,
      category: "dessert",
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=2070"
    }
  ];

  // Filter menu items by category and limit to 3 items per category
  const breakfastItems = menuItems.filter(item => item.category === "breakfast").slice(0, 3);
  const lunchItems = menuItems.filter(item => item.category === "lunch").slice(0, 3);
  const dinnerItems = menuItems.filter(item => item.category === "dinner").slice(0, 3);
  const dessertItems = menuItems.filter(item => item.category === "dessert").slice(0, 3);

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
                <TabsTrigger value="dessert" className="data-[state=active]:bg-[#EEDFD0] data-[state=active]:text-[#8A5A44]">Dessert</TabsTrigger>
              </TabsList>
            </div>

            {/* Breakfast Menu */}
            <TabsContent value="breakfast" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                {breakfastItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-[#8A5A44]">{item.name}</h3>
                        <span className="font-medium text-[#C45D3A]">${item.price}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                      <div className="flex gap-2">
                        {item.isVegetarian && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Vegetarian</span>}
                        {item.isGlutenFree && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Gluten Free</span>}
                        {item.isSpecial && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Chef's Special</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Lunch Menu */}
            <TabsContent value="lunch" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                {lunchItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-[#8A5A44]">{item.name}</h3>
                        <span className="font-medium text-[#C45D3A]">${item.price}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                      <div className="flex gap-2">
                        {item.isVegetarian && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Vegetarian</span>}
                        {item.isGlutenFree && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Gluten Free</span>}
                        {item.isSpecial && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Chef's Special</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Dinner Menu */}
            <TabsContent value="dinner" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                {dinnerItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-[#8A5A44]">{item.name}</h3>
                        <span className="font-medium text-[#C45D3A]">${item.price}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                      <div className="flex gap-2">
                        {item.isVegetarian && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Vegetarian</span>}
                        {item.isGlutenFree && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Gluten Free</span>}
                        {item.isSpecial && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Chef's Special</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Dessert Menu */}
            <TabsContent value="dessert" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                {dessertItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg hover:bg-[#F9F5F2] transition-colors">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?q=80&w=1974"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-[#8A5A44]">{item.name}</h3>
                        <span className="font-medium text-[#C45D3A]">${item.price}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                      <div className="flex gap-2">
                        {item.isVegetarian && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Vegetarian</span>}
                        {item.isGlutenFree && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Gluten Free</span>}
                        {item.isSpecial && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Chef's Special</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            <Carousel className="w-full">
              <CarouselContent>
                {menuImages.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <div className="relative rounded-lg overflow-hidden group">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                          <h3 className="font-serif font-semibold text-lg">{item.title}</h3>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm opacity-90">{item.category}</span>
                            <span className="bg-[#C45D3A] px-3 py-1 rounded-full text-sm font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
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
