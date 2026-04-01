
import Link from "next/link";
import { Search, Heart, ShoppingBag, Stethoscope, BookOpen, ArrowRight } from "lucide-react";
import { CatCard } from "../components/CatCard";
import { ProductCard } from "../components/ProductCard";
import { ServiceCard } from "../components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockCats, mockProducts, mockServices } from "../data/mockData";
import { Input } from "@/components/ui/input";

export function HomePage() {
  const featuredCats = mockCats.slice(0, 4);
  const recommendedProducts = mockProducts.slice(0, 4);
  const nearbyServices = mockServices.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-4">Find Your Purrfect Companion</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with cats looking for homes, shop for supplies, and join a community of cat lovers
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by breed, location, or keyword..."
                  className="pl-12 h-12 text-base bg-white"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/adopt">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-sm">Adopt a Cat</h3>
              </Card>
            </Link>
            <Link href="/shop">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm">Shop Supplies</h3>
              </Card>
            </Link>
            <Link href="/services">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm">Find Services</h3>
              </Card>
            </Link>
            <Link href="/community">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-sm">Community</h3>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Featured Cats for Adoption</h2>
              <p className="text-muted-foreground">Find your new best friend</p>
            </div>
            <Link href="/adopt">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCats.map((cat) => (
              <CatCard key={cat.id} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Recommended Products</h2>
              <p className="text-muted-foreground">Everything your cat needs</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Nearby Vets & Services</h2>
              <p className="text-muted-foreground">Professional care for your cat</p>
            </div>
            <Link href="/services">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {nearbyServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Resources */}
      <section className="py-12 bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center">Cat Care Tips & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-2">First-Time Owner Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Everything you need to know about bringing a cat home for the first time.
              </p>
              <Button variant="link" className="p-0 h-auto">
                Learn More →
              </Button>
            </Card>
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2">Health & Wellness</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tips for keeping your cat healthy, happy, and thriving.
              </p>
              <Button variant="link" className="p-0 h-auto">
                Learn More →
              </Button>
            </Card>
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-2">Adoption Process</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Step-by-step guide to adopting your perfect feline companion.
              </p>
              <Button variant="link" className="p-0 h-auto">
                Learn More →
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
