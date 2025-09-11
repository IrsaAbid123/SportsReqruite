
import { useState } from "react"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { mockUser } from "@/data/mockData"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdEdit } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi"
import { Trophy } from "lucide-react"
import { mockListings } from "@/data/mockData"
import { FilterOptions } from "@/components/FilterSidebar";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("posts")
    const [listings, setListings] = useState(mockListings);
    const [filters, setFilters] = useState<FilterOptions>({
        userType: 'all',
        ageRange: [16, 35],
        distance: [10, 100],
        experience: [],
        position: [],
        location: [],
        status: 'all'
    });

    const handleContact = (listingId: string) => {
        console.log("Contact listing:", listingId);
    };

    const handleSave = (listingId: string) => {
        console.log("Save listing:", listingId);
    };

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

            {/* Hero Section with Mountain Background */}
            <div className="relative h-80 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <section className="py-10 px-32 bg-card border-b flex flex-row">
                {/* Avatar  */}
                <div>
                    <Avatar className="w-44 -mt-28 h-44 mb-4 border-4 border-white shadow-lg">
                        <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                        <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                            {mockUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* User Info section */}
                <div className="flex flex-row w-full">
                    {/* NAme and socials  */}
                    <div className="flex-1">
                        <p className="text-xl font-bold">{mockUser?.name}</p>
                        <span className="text-md ">Coatches don't play and advusors alwats a good advusor as always </span>
                        <div className="flex flex-row gap-5 py-5">
                            <span className="text-gray-400 flex flex-row items-center text-sm gap-1">
                                <FaLocationDot />
                                <p>{mockUser?.location}</p>
                            </span>
                            <span className="text-gray-400 flex flex-row items-center text-sm gap-1">
                                <FaFacebook />
                                <p>{mockUser?.location}</p>
                            </span>
                            <span className="text-gray-400 flex flex-row items-center text-sm gap-1">
                                <FaLinkedin />
                                <p>{mockUser?.location}</p>
                            </span>
                            <span className="text-gray-400 flex flex-row items-center text-sm gap-1">
                                <FaTwitter />
                                <p>{mockUser?.location}</p>
                            </span>
                        </div>
                    </div>

                    {/* Dropdown to edit your profile  */}
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 p-2">
                                    <HiDotsVertical className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="end" forceMount>
                                <DropdownMenuItem className="cursor-pointer">
                                    <MdEdit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>


                </div>
            </section>

            {/* Profile Content */}
            <div className="container flex flex-row px-32 py-10 gap-10">
                <div className=" p-6 ">

                    <div className="space-y-3 mb-5">
                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span className="text-gray-800 font-medium">+7911 0018630</span>
                            <span className="text-gray-400 text-xs ml-1">(Office)</span>
                        </div>

                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span className="text-gray-800 font-medium">+7496 7141177</span>
                            <span className="text-gray-400 text-xs ml-1">(Mobile)</span>
                        </div>

                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <a href="mailto:kevin.smith@stripe.com" className="text-gray-400 hover:underline">kevin.smith@stripe.com</a>
                        </div>
                    </div>


                    <button className="w-full bg-gradient-redwhiteblued text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center mb-5 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                        Connect
                    </button>

                </div>
                <div className="space-y-6">
                    <div className="text-4xl font-bold bg-gradient-redwhiteblued bg-clip-text text-transparent">
                        My Posts
                    </div>
                    {filteredListings.length > 0 ? (
                        filteredListings.map((listing) => {
                            console.log("listing", listing)
                            return (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onContact={handleContact}
                                    onSave={handleSave}
                                />
                            )
                        })
                    ) : (
                        <Card className="p-8 text-center">
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
            </div>
        </div>
    )
}
