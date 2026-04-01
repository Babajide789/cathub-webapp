import { Settings, MapPin, Calendar, Mail, Phone, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CatCard } from "../components/CatCard";
import { ProductCard } from "../components/ProductCard";
import { Separator } from "../components/ui/separator";
import { mockCats, mockProducts } from "../data/mockData";

export function ProfilePage() {
  const userListings = mockCats.slice(0, 2);
  const savedItems = mockCats.slice(2, 4);
  const orderHistory = mockProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="https://ui-avatars.com/api/?name=John+Doe&size=128" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2">John Doe</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined March 2024</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Contact Info */}
        <Card className="p-6 mb-8">
          <h3 className="mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">john.doe@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">(415) 555-0123</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="listings">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div className="mb-4 flex items-center justify-between">
              <h2>My Listings ({userListings.length})</h2>
              <Button>Post New Listing</Button>
            </div>
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {userListings.map((cat) => (
                  <CatCard key={cat.id} {...cat} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't posted any listings yet</p>
                <Button>Create Your First Listing</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved">
            <h2 className="mb-4">Saved Items ({savedItems.length})</h2>
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedItems.map((cat) => (
                  <CatCard key={cat.id} {...cat} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">You haven't saved any items yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="mb-4">Order History ({orderHistory.length})</h2>
            <div className="space-y-4">
              {orderHistory.map((product) => (
                <Card key={product.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                        <Button variant="outline" size="sm">Buy Again</Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Order placed</p>
                      <p className="font-medium">March 15, 2026</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium text-green-600">Delivered</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
