"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List } from "lucide-react";
import { CatCard } from "../components/CatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getCats } from "@/lib/api/cats";
import type { CatsResponse } from "@/types/cats";
import type { Cat } from "@/types/cats";
import { mapCatToCatCard } from "@/lib/adapters/catAdapter";

export function AdoptPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("all");
  const [age, setAge] = useState("all");
  const [gender, setGender] = useState("all");
  const [page, setPage] = useState(1);

  // 🔥 Debounce
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔁 Reset page when filters change
  const filterKey = `${debouncedSearch}-${breed}-${age}-${gender}`;

const prevFilterKey = useRef(filterKey);

useEffect(() => {
  if (prevFilterKey.current !== filterKey) {
    setPage(1);
    prevFilterKey.current = filterKey;
  }
}, [filterKey]);

  // 🚀 React Query
  const { data, isLoading } = useQuery<CatsResponse>({
    queryKey: ["cats", page, debouncedSearch, breed, age, gender],
    queryFn: () =>
      getCats({
        page,
        search: debouncedSearch,
        breed,
        age,
        gender,
      }),
    placeholderData: (prev) => prev,
  });

  const cats = data?.cats ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Pagination logic
  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) end = Math.min(totalPages, maxVisible);
    if (page > totalPages - 3)
      start = Math.max(1, totalPages - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Find Your Perfect Cat</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `Browse ${cats.length} cats`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="mb-4">Filters</h3>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <Label>Search</Label>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Breed */}
                <div>
                  <Label>Breed</Label>
                  <Select onValueChange={setBreed}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All breeds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All breeds</SelectItem>
                      <SelectItem value="persian">Persian</SelectItem>
                      <SelectItem value="siamese">Siamese</SelectItem>
                      <SelectItem value="maine-coon">Maine Coon</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="ragdoll">Ragdoll</SelectItem>
                      <SelectItem value="bengal">Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div>
                  <Label>Age</Label>
                  <Select onValueChange={setAge}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any age</SelectItem>
                      <SelectItem value="kitten">Kitten</SelectItem>
                      <SelectItem value="young">Young</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div>
                  <Label>Gender</Label>
                  <Select onValueChange={setGender}>
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

                {/* Distance (UI only for now) */}
                <div>
                  <Label className="mb-3 block">Distance (miles)</Label>
                  <Slider defaultValue={[25]} max={100} step={5} />
                </div>

                {/* Reset */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearch("");
                    setBreed("all");
                    setAge("all");
                    setGender("all");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
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
                      <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />

                      <Select onValueChange={setBreed}>
                        <SelectTrigger>
                          <SelectValue placeholder="Breed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="persian">Persian</SelectItem>
                          <SelectItem value="siamese">Siamese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* View Toggle */}
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

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : cats.length === 0 ? (
              <div className="text-center py-10">
                No cats found 😿
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {cats.map((cat: Cat) => (
                  <CatCard key={cat.id} {...mapCatToCatCard(cat)} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              {getPaginationRange().map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}