import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, MapPin, Calendar, Heart, Share2, CheckCircle2, Phone, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockCats } from "../data/mockData";

export function CatDetailPage() {
  const { id } = useParams();
  const cat = mockCats.find((c) => c.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!cat) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2>Cat not found</h2>
        <Link to="/adopt">
          <Button className="mt-4">Back to Adoption</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 md:top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link to="/adopt">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Adoption
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square md:aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={cat.gallery[selectedImage]}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {cat.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${cat.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Tabs */}
            <Card className="p-6">
              <Tabs defaultValue="about">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="health">Health Info</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-6">
                  <h3 className="mb-3">About {cat.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Breed</p>
                      <p className="font-medium">{cat.breed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Age</p>
                      <p className="font-medium">{cat.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Gender</p>
                      <p className="font-medium">{cat.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {cat.location.split(",")[0]}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="health" className="mt-6">
                  <h3 className="mb-4">Health Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 ${cat.vaccinated ? "text-green-600" : "text-gray-300"}`} />
                      <div>
                        <p className="font-medium">Vaccinated</p>
                        <p className="text-sm text-muted-foreground">
                          {cat.vaccinated ? "Up to date on all vaccinations" : "Not vaccinated"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 ${cat.neutered ? "text-green-600" : "text-gray-300"}`} />
                      <div>
                        <p className="font-medium">Spayed/Neutered</p>
                        <p className="text-sm text-muted-foreground">
                          {cat.neutered ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {cat.health.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h4 className="mb-3">Health Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.health.map((status, index) => (
                            <Badge key={index} variant="secondary">
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

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="mb-6">
                  <h1 className="mb-2">{cat.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{cat.age}</span>
                    <span>•</span>
                    <span>{cat.breed}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{cat.location}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Owner/Shelter Info */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Posted by</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={cat.ownerAvatar} alt={cat.ownerName} />
                      <AvatarFallback>{cat.ownerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{cat.ownerName}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {cat.ownerType}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Adopt {cat.name}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                  <Button variant="ghost" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="mb-2">Adoption Tips</h4>
                  <p className="text-sm text-muted-foreground">
                    Meet the cat in person before making a decision. Ask about their personality, habits, and medical history.
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
