"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCats } from "../data/mockData";

export function CatDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const cat = mockCats.find((item) => item.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [shareStatus, setShareStatus] = useState("");

  if (!cat) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2>Cat not found</h2>
        <Link href="/adopt">
          <Button className="mt-4">Back to Adoption</Button>
        </Link>
      </div>
    );
  }

  const ownerPhoneHref = `tel:${cat.ownerPhone.replace(/[^\d+]/g, "")}`;
  const messageHref = `/messages?conversationId=cat-${cat.id}&recipient=${encodeURIComponent(
    cat.ownerName
  )}&avatar=${encodeURIComponent(cat.ownerAvatar)}&draft=${encodeURIComponent(
    `Hi ${cat.ownerName}, I'm interested in adopting ${cat.name}. Is ${cat.name} still available?`
  )}`;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `Adopt ${cat.name} on CatHub`,
      text: `Meet ${cat.name}, a ${cat.age} ${cat.breed} in ${cat.location}.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Shared");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Share unavailable");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-14 z-40 border-b bg-white lg:top-16">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link href="/adopt">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Adoption
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100 sm:mb-4 md:aspect-video">
                <Image
                  src={cat.gallery[selectedImage]}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                  width={1200}
                  height={800}
                  priority
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {cat.gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={`h-18 w-18 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${cat.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={160}
                      height={160}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Card className="p-4 sm:p-6">
              <Tabs defaultValue="about">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="health">Health Info</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-6">
                  <h3 className="mb-3 text-xl font-semibold">About {cat.name}</h3>
                  <p className="leading-relaxed text-muted-foreground">{cat.description}</p>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Breed</p>
                      <p className="font-medium">{cat.breed}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{cat.age}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{cat.gender}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Location</p>
                      <p className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3 w-3" />
                        {cat.location.split(",")[0]}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="health" className="mt-6">
                  <h3 className="mb-4 text-xl font-semibold">Health Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        className={`h-5 w-5 ${cat.vaccinated ? "text-green-600" : "text-gray-300"}`}
                      />
                      <div>
                        <p className="font-medium">Vaccinated</p>
                        <p className="text-sm text-muted-foreground">
                          {cat.vaccinated ? "Up to date on all vaccinations" : "Not vaccinated"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        className={`h-5 w-5 ${cat.neutered ? "text-green-600" : "text-gray-300"}`}
                      />
                      <div>
                        <p className="font-medium">Spayed/Neutered</p>
                        <p className="text-sm text-muted-foreground">{cat.neutered ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>

                  {cat.health.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h4 className="mb-3 font-semibold">Health Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.health.map((status) => (
                            <Badge key={status} variant="secondary">
                              {status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <Card className="p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h1 className="mb-2 text-3xl font-semibold">{cat.name}</h1>
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{cat.age}</span>
                    <span>&bull;</span>
                    <span>{cat.breed}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{cat.location}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <p className="mb-3 text-sm text-muted-foreground">Posted by</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={cat.ownerAvatar} alt={cat.ownerName} />
                      <AvatarFallback>{cat.ownerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{cat.ownerName}</p>
                      <p className="text-sm capitalize text-muted-foreground">{cat.ownerType}</p>
                      <p className="text-sm text-muted-foreground">{cat.ownerPhone}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Link href={messageHref}>
                    <Button className="w-full" size="lg">
                      <Heart className="mr-2 h-4 w-4" />
                      Adopt {cat.name}
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={ownerPhoneHref}>
                      <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </Link>
                    <Link href={messageHref}>
                      <Button variant="outline" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                  </div>
                  <Button variant="ghost" className="w-full" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    {shareStatus || "Share"}
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 font-semibold">Adoption Tips</h4>
                  <p className="text-sm text-muted-foreground">
                    Meet the cat in person before making a decision. Ask about their personality,
                    habits, and medical history.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
