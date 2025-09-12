import { useState } from "react";
import { Header } from "@/components/Header";
import { ListingCard, Listing } from "@/components/ListingCard";
import { FilterSidebar, FilterOptions } from "@/components/FilterSidebar";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, Trophy } from "lucide-react";
import { mockListings, mockUser } from "@/data/mockData";
import heroImage from "@/assets/hero-sports.jpg";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [listings, setListings] = useState(mockListings);
  const [filters, setFilters] = useState<FilterOptions>({
    userType: 'all',
    age: ["16u", "17u"],
    distance: 10,
    zipOrCityState: "",
    experience: [] as string[],
    position: [] as string[],
    status: 'all'
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSearch = (query: string) => {
    // Mock search functionality
    console.log("Searching for:", query);
  };

  const handleContact = (listingId: string) => {
    console.log("Contact listing:", listingId);
  };

  const handleSave = (listingId: string) => {
    console.log("Save listing:", listingId);
  };

  const clearFilters = () => {
    setFilters({
      userType: 'all',
      age: [] as string[],
      distance: 0,
      zipOrCityState: "",
      experience: [] as string[],
      position: [] as string[],
      status: 'all'
    });
  };

  // Filter listings based on current filters
  const filteredListings = listings.filter(listing => {
    if (filters.userType !== 'all' &&
      ((filters.userType === 'players' && listing.author.role !== 'player') ||
        (filters.userType === 'teams' && listing.author.role !== 'team'))) {
      return false;
    }

    if (filters.status !== 'all' && listing.status !== filters.status) {
      return false;
    }

    if (filters.experience.length > 0 &&
      !filters.experience.some(exp => listing.tags.includes(exp))) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentUser={currentUser}
        onSearch={handleSearch}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-redwhiteblued">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(/bascketball-court.jpg)` }}
        />
        <div className="relative container px-4 py-16 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Connect. Compete. Succeed.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            The ultimate platform for sports recruiting - connecting talented players with top teams and coaches.
          </p>
          <Button
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            onClick={() => {
              const token = localStorage.getItem('authToken');
              if (token) {
                navigate('/create-post');
              } else {
                navigate('/signin');
              }
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your Listing
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">2,500+</h3>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">850+</h3>
              <p className="text-muted-foreground">Teams & Coaches</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-success/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">1,200+</h3>
              <p className="text-muted-foreground">Successful Matches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {/* Main Content with Background Image */}
      <div className="relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/bascketball-court.jpg)` }}
        />
        {/* Optional overlay for better readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Actual Content */}
        <div className="relative container px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-80">
              <div className="sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                />
              </div>
            </aside>

            {/* Feed */}
            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Latest Opportunities
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-white/80">
                    <span>{filteredListings.length} listings found</span>
                    {(filters.userType !== 'all' || filters.status !== 'all' ||
                      filters.experience.length > 0) && (
                        <Badge variant="outline" className="ml-2 text-white">
                          Filtered
                        </Badge>
                      )}
                  </div>
                </div>

                <Button className="bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                  onClick={() => {
                    const token = localStorage.getItem('authToken');
                    if (token) {
                      navigate('/create-post');
                    } else {
                      navigate('/signin');
                    }
                  }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Listing
                </Button>
              </div>

              <div className="space-y-6">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onContact={handleContact}
                      onSave={handleSave}
                    />
                  ))
                ) : (
                  <Card className="p-8 text-center bg-white/80">
                    <CardContent>
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No listings found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or check back later for new opportunities.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Index;
