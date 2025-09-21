import { useState } from "react"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdEdit } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi"
import { Trophy } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { useGetProfileQuery } from "@/redux/ApiCalls/userApi"

export default function ProfilePage() {
    const { user } = useUser()
    const { data, isLoading, error } = useGetProfileQuery(user?._id)

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading profile</div>

    const profileUser = data?.user
    const listings = data?.post || []

    // Check if this is the current user's own profile
    const isOwnProfile = user?._id === profileUser?._id

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
                        <AvatarImage src={"/placeholder.svg"} alt={profileUser?.fullname} />
                        <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                            {profileUser?.fullname
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* User Info section */}
                <div className="flex flex-row w-full">
                    {/* Name and socials */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-xl font-bold">{profileUser?.fullname}</p>
                            {profileUser?.verified && (
                                <Badge variant="default" className="bg-green-500">
                                    Verified
                                </Badge>
                            )}
                        </div>

                        {/* Role and Position */}
                        <div className="flex items-center gap-4 mb-2">
                            <Badge variant="outline" className="capitalize">
                                {profileUser?.role}
                            </Badge>
                            {profileUser?.position && (
                                <Badge variant="secondary" className="capitalize">
                                    {profileUser.position}
                                </Badge>
                            )}
                        </div>

                        {/* Age and Experience */}
                        <div className="flex items-center gap-4 mb-3">
                            {profileUser?.age && (
                                <span className="text-sm text-gray-600">
                                    Age: <span className="font-medium">{profileUser.age}</span>
                                </span>
                            )}
                            {profileUser?.experienceLevel && (
                                <span className="text-sm text-gray-600">
                                    Experience: <span className="font-medium">{profileUser.experienceLevel}</span>
                                </span>
                            )}
                        </div>

                        <span className="text-md ">Coatches don't play and advusors alwats a good advusor as always </span>

                        {/* Social Links */}
                        <div className="flex flex-row gap-5 py-5">
                            <span className="text-gray-400 flex flex-row items-center text-sm gap-1">
                                <FaLocationDot />
                                <p>{profileUser?.location}</p>
                            </span>

                        </div>

                        {/* Followers/Following Stats */}
                        <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-600">
                                <span className="font-semibold">{profileUser?.followers?.length || 0}</span> Followers
                            </span>
                            <span className="text-gray-600">
                                <span className="font-semibold">{profileUser?.following?.length || 0}</span> Following
                            </span>
                            <span className="text-gray-600">
                                Member since <span className="font-medium">
                                    {profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short'
                                    }) : ''}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Dropdown to edit your profile - only show for own profile */}
                    {isOwnProfile && (
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
                    )}
                </div>
            </section>

            {/* Profile Content */}
            <div className="container flex flex-row px-32 py-10 gap-10">
                <div className=" p-6 ">
                    <div className="space-y-3 mb-5">

                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <a href={`mailto:${profileUser?.email}`} className="text-gray-400 hover:underline">
                                {profileUser?.email}
                            </a>
                        </div>
                    </div>

                    {isOwnProfile ? (
                        <button className="w-full bg-gradient-redwhiteblued text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center mb-5 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            Saved Posts
                        </button>
                    ) : (
                        <button className="w-full bg-gradient-redwhiteblued text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center mb-5 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                            </svg>
                            Connect
                        </button>
                    )}
                </div>

                <div className="space-y-6 flex-1">
                    <div className="text-4xl font-bold bg-gradient-redwhiteblued bg-clip-text text-transparent">
                        {isOwnProfile ? "My Posts" : `${profileUser?.fullname}'s Posts`}
                    </div>
                    {listings.length > 0 ? (
                        listings.map((listing: any) => (
                            <ListingCard
                                key={listing._id}
                                listing={listing}
                                onContact={() => console.log("Contact:", listing._id)}
                                onSave={() => console.log("Save:", listing._id)}
                            />
                        ))
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
