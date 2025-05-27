import { Button } from "@/components/ui/button";
import {
  Heart,
  Award,
  Users,
  Star,
  Shield,
  Coffee,
  Building,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingFormDialog } from "@/components/BookingFormDialog";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A5A44]/80 to-[#C45D3A]/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              About <span className="text-[#E8C3A3]">Macchiato Suites</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Where luxury meets comfort, and every stay becomes an unforgettable experience
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Coffee className="h-6 w-6 text-[#E8C3A3]" />
              <span>Crafting exceptional hospitality since 2015</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-[#8A5A44]">
                  Our Story
                </h2>
                <div className="space-y-4 text-lg text-neutral-600">
                  <p>
                    Born from a passion for exceptional hospitality, Macchiato Suites began as a vision
                    to create more than just accommodation – we wanted to craft experiences that linger
                    in the hearts of our guests long after they've departed.
                  </p>
                  <p>
                    Founded in 2015 by hospitality veterans Maria and Alessandro Romano, our boutique
                    hotel represents the perfect fusion of contemporary luxury and timeless elegance.
                    Every detail, from our carefully curated interiors to our personalized service,
                    reflects our commitment to excellence.
                  </p>
                  <p>
                    Today, Macchiato Suites stands as a beacon of refined hospitality, welcoming
                    travelers from around the world to experience the warmth and sophistication
                    that defines our brand.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080"
                    alt="Macchiato Suites founders"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#C45D3A] text-white p-6 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold">8+</div>
                    <div className="text-sm">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                Our Core Values
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                These principles guide everything we do, ensuring every guest experiences
                the very best of what hospitality can offer.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Excellence */}
              <div className="bg-white p-8 rounded-lg shadow-sm text-center group hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C45D3A] transition-colors">
                  <Award className="h-8 w-8 text-[#C45D3A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Excellence</h3>
                <p className="text-neutral-600">
                  We pursue perfection in every detail, from our immaculate rooms to our
                  exceptional service standards.
                </p>
              </div>

              {/* Warmth */}
              <div className="bg-white p-8 rounded-lg shadow-sm text-center group hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C45D3A] transition-colors">
                  <Heart className="h-8 w-8 text-[#C45D3A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Warmth</h3>
                <p className="text-neutral-600">
                  Our genuine care and personal attention make every guest feel welcomed
                  and valued as part of our family.
                </p>
              </div>

              {/* Innovation */}
              <div className="bg-white p-8 rounded-lg shadow-sm text-center group hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C45D3A] transition-colors">
                  <Sparkles className="h-8 w-8 text-[#C45D3A] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Innovation</h3>
                <p className="text-neutral-600">
                  We continuously evolve our offerings, embracing new technologies and
                  trends to enhance the guest experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                Awards & Recognition
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Our commitment to excellence has been recognized by industry leaders and guests alike.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Award 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="h-12 w-12 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-[#C45D3A]" />
                </div>
                <h3 className="font-semibold mb-2 text-[#8A5A44]">TripAdvisor</h3>
                <p className="text-sm text-neutral-600 mb-2">Travelers' Choice Award</p>
                <p className="text-xs text-neutral-500">2023</p>
              </div>

              {/* Award 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="h-12 w-12 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-[#C45D3A]" />
                </div>
                <h3 className="font-semibold mb-2 text-[#8A5A44]">Green Key</h3>
                <p className="text-sm text-neutral-600 mb-2">Eco-Certification</p>
                <p className="text-xs text-neutral-500">2022-2024</p>
              </div>

              {/* Award 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="h-12 w-12 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-[#C45D3A]" />
                </div>
                <h3 className="font-semibold mb-2 text-[#8A5A44]">Booking.com</h3>
                <p className="text-sm text-neutral-600 mb-2">Guest Review Award</p>
                <p className="text-xs text-neutral-500">2023</p>
              </div>

              {/* Award 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="h-12 w-12 rounded-full bg-[#EEDFD0] flex items-center justify-center mx-auto mb-4">
                  <Building className="h-6 w-6 text-[#C45D3A]" />
                </div>
                <h3 className="font-semibold mb-2 text-[#8A5A44]">Hospitality Awards</h3>
                <p className="text-sm text-neutral-600 mb-2">Best Boutique Hotel</p>
                <p className="text-xs text-neutral-500">2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-[#8A5A44] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Our Journey in Numbers
              </h2>
              <p className="text-xl text-white/80">
                Every number tells a story of dedication and excellence
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#E8C3A3]">50,000+</div>
                <p className="text-lg">Happy Guests</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#E8C3A3]">4.9</div>
                <p className="text-lg">Average Rating</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#E8C3A3]">95%</div>
                <p className="text-lg">Return Rate</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#E8C3A3]">24/7</div>
                <p className="text-lg">Concierge Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Experience the Macchiato Difference
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have made Macchiato Suites their home away from home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingFormDialog
              buttonText="Book Your Stay Today"
              buttonSize="lg"
              buttonClassName="bg-white text-[#C45D3A] hover:bg-neutral-100"
              showArrow={true}
            />
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Take a Virtual Tour
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;