"use client"

import { useState } from "react";
import { Filter } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from "../data/mockData";

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = selectedCategory === "all"
    ? mockProducts
    : mockProducts.filter((p) => p.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Cat Supplies & Accessories</h1>
          <p className="text-muted-foreground">Everything your cat needs to live their best life</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="toys">Toys</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="furniture">Furniture</TabsTrigger>
              <TabsTrigger value="grooming">Grooming</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="mb-4">Filters</h3>

              <div className="space-y-6">
                <div>
                  <Label>Search</Label>
                  <Input placeholder="Search products..." className="mt-2" />
                </div>

                <div>
                  <Label>Price Range</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any price</SelectItem>
                      <SelectItem value="0-20">Under $20</SelectItem>
                      <SelectItem value="20-50">$20 - $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100+">$100+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rating</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any rating</SelectItem>
                      <SelectItem value="4+">4★ & above</SelectItem>
                      <SelectItem value="3+">3★ & above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Availability</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products</SelectItem>
                      <SelectItem value="in-stock">In Stock Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full">Reset</Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div>
                        <Label>Search</Label>
                        <Input placeholder="Search products..." className="mt-2" />
                      </div>
                      <div>
                        <Label>Price Range</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Any price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any price</SelectItem>
                            <SelectItem value="0-20">Under $20</SelectItem>
                            <SelectItem value="20-50">$20 - $50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </SheetContent>
                </Sheet>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
