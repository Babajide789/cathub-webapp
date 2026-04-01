"use client"

import { useState } from "react";
import { Filter, Grid, List } from "lucide-react";
import { CatCard } from "../components/CatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { mockCats } from "../data/mockData";

export function AdoptPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Find Your Perfect Cat</h1>
          <p className="text-muted-foreground">Browse {mockCats.length} cats available for adoption</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="mb-4">Filters</h3>

              <div className="space-y-6">
                <div>
                  <Label>Search</Label>
                  <Input placeholder="Search by name..." className="mt-2" />
                </div>

                <div>
                  <Label>Breed</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All breeds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All breeds</SelectItem>
                      <SelectItem value="persian">Persian</SelectItem>
                      <SelectItem value="siamese">Siamese</SelectItem>
                      <SelectItem value="maine-coon">Maine Coon</SelectItem>
                      <SelectItem value="british">British Shorthair</SelectItem>
                      <SelectItem value="ragdoll">Ragdoll</SelectItem>
                      <SelectItem value="bengal">Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Age</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any age</SelectItem>
                      <SelectItem value="kitten">Kitten (0-1 year)</SelectItem>
                      <SelectItem value="young">Young (1-3 years)</SelectItem>
                      <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                      <SelectItem value="senior">Senior (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Gender</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Distance (miles)</Label>
                  <Slider defaultValue={[25]} max={100} step={5} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0</span>
                    <span>25 mi</span>
                    <span>100</span>
                  </div>
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
                        <Input placeholder="Search by name..." className="mt-2" />
                      </div>
                      <div>
                        <Label>Breed</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="All breeds" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All breeds</SelectItem>
                            <SelectItem value="persian">Persian</SelectItem>
                            <SelectItem value="siamese">Siamese</SelectItem>
                            <SelectItem value="maine-coon">Maine Coon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </SheetContent>
                </Sheet>
                <Select defaultValue="recent">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="distance">Nearest</SelectItem>
                    <SelectItem value="age-low">Age: Low to High</SelectItem>
                    <SelectItem value="age-high">Age: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Cats Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {mockCats.map((cat) => (
                <CatCard key={cat.id} {...cat} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
