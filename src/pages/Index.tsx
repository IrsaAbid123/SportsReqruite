import { useState } from "react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { UserCard } from "@/components/UserCard";
import { ProfileModal } from "@/components/ProfileModal";
import { FilterDropdown, FilterOptions } from "@/components/FilterDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, Trophy } from "lucide-react";
import { mockListings, mockUser } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserRoleEnum } from "@/constants/UserRoleEnums";
import Dashboard from "./Dashboard/index";
import { useGetPostsQuery, useGetFilteredPostsMutation } from "@/redux/ApiCalls/postApi";

const Index = () => {
  const navigate = useNavigate()
  const { user, setUser } = useUser();
  const isAuthenticated = !!user;
  const { data: postsData, isLoading, error } = useGetPostsQuery();
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredPostsData, setFilteredPostsData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    userType: 'all',
    age: ["16u", "17u"],
    distance: 10,
    zipOrCityState: "",
    experience: [] as string[],
    position: [] as string[],
    status: 'all'
  });

  // Prepare filter parameters for the API - send each value separately
  const filterParams = {
    experience: filters.experience.length > 0 ? filters.experience : undefined,
    age: filters.age.length > 0 ? filters.age : undefined,
    position: filters.position.length > 0 ? filters.position : undefined,
    location: filters.zipOrCityState || undefined,
    role: filters.userType !== 'all' ? [filters.userType] : undefined,
    status: filters.status !== 'all' ? [filters.status] : undefined,
    distance: filters.distance > 0 ? [filters.distance.toString()] : undefined,
  };

  const [getFilteredPosts, { isLoading: isFilterLoading }] = useGetFilteredPostsMutation();

  const listings = isFiltered ? (filteredPostsData?.posts || []) : (postsData?.posts || []);
  const rawUsers = isFiltered ? (filteredPostsData?.users || []) : (postsData?.users || []);

  // Sort users: Available first, then Filled
  const users = [...rawUsers].sort((a, b) => {
    if (a.status === 'available' && b.status !== 'available') return -1;
    if (a.status !== 'available' && b.status === 'available') return 1;
    return 0;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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

  const handleUserContact = (userId: string) => {
    console.log("Contact user:", userId);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedUser(null);
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
    setIsFiltered(false);
    setFilteredPostsData(null);
    setUsersData([]);
  };

  const applyFilters = async () => {
    try {
      setIsFiltered(true);
      // Trigger the API call when apply filters is clicked
      const result = await getFilteredPosts(filterParams).unwrap();
      setFilteredPostsData(result);
      setUsersData(result?.users || []);
    } catch (error) {
      console.error('Failed to fetch filtered posts:', error);
      setIsFiltered(false);
    }
  };

  // Use listings directly since filtering is now done server-side
  const filteredListings = listings;

  // if (user?.role === UserRoleEnum.ADMIN) {
  //   return (
  //     <Dashboard />
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              if (isAuthenticated) {
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
        <div className="relative container px-4 sm:px-8 lg:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-8">
              {/* Feed */}
              <main className="flex-1">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Latest Opportunities
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm text-white/80">
                      <span>
                        {filteredListings.length} {isFiltered ? 'filtered' : ''} listings found
                      </span>
                      {isFiltered && (
                        <Badge variant="outline" className="text-white border-white/30">
                          Filtered
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <FilterDropdown
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={clearFilters}
                      onApplyFilters={applyFilters}
                      isFiltered={isFiltered}
                    />
                    <Button
                      size="sm"
                      className="bg-gradient-redwhiteblued hover:opacity-90 transition-opacity w-full sm:w-auto"
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate('/create-post');
                        } else {
                          navigate('/signin');
                        }
                      }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Listing
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {(isLoading || isFilterLoading) ? (
                    <Card className="p-6 sm:p-8 text-center bg-white/80">
                      <CardContent>
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                        <h3 className="text-lg font-semibold mb-2">Loading...</h3>
                        <p className="text-muted-foreground">
                          {isFiltered ? "Applying filters..." : "Loading opportunities..."}
                        </p>
                      </CardContent>
                    </Card>
                  ) : filteredListings.length > 0 ? (
                    filteredListings.map((listing) => (
                      <ListingCard
                        key={listing._id}
                        listing={listing}
                        onContact={handleContact}
                        onSave={handleSave}
                      />
                    ))
                  ) : (
                    <Card className="p-6 sm:p-8 text-center bg-white/80">
                      <CardContent>
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No listings found</h3>
                        <p className="text-muted-foreground">
                          {isFiltered
                            ? "No posts match your current filters. Try adjusting your search criteria."
                            : "Try adjusting your filters or check back later for new opportunities."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </main>

              {/* Users Section */}
              {users.length > 0 && (
                <aside className="lg:w-80">
                  <div className="">
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {isFiltered ? 'Matching Users' : 'Users'}
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-white/80">
                        <span>{users.length} users found</span>
                        {isFiltered && (
                          <Badge variant="outline" className="text-white border-white/30">
                            Filtered
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {users.map((user) => (
                        <UserCard
                          key={user._id}
                          user={user}
                          onUserClick={handleUserClick}
                        />
                      ))}
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        user={selectedUser}
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};

export default Index;
