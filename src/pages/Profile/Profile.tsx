import { useState, useEffect } from "react"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { useGetProfileQuery, useUpdateUserMutation } from "@/redux/ApiCalls/userApi"
import { toast } from "sonner"
import { ageRangeOptions, experienceLevelOptions, positionOptions } from "@/constants/UserDataEnums"

export default function ProfilePage() {
    const { user } = useUser()
    const { data, isLoading, error } = useGetProfileQuery(user?._id)
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        location: "",
        age: "",
        experienceLevel: "",
        position: "",
        role: "",
        bio: "",
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading profile</div>

    const profileUser = data?.user || data
    const listings = data?.post || []

    // Check if this is the current user's own profile
    const isOwnProfile = user?._id === profileUser?._id

    // Initialize form data when profile loads
    useEffect(() => {
        if (profileUser) {
            setFormData({
                fullname: profileUser.fullname || "",
                email: profileUser.email || "",
                location: profileUser.location || "",
                age: profileUser.age || "",
                experienceLevel: profileUser.experienceLevel || "",
                position: profileUser.position || "",
                role: profileUser.role || "",
                bio: profileUser.bio || "",
            })
        }
    }, [profileUser])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSaveProfile = async () => {
        try {
            await updateUser({ id: user?._id!, data: formData }).unwrap()
            toast.success("Profile updated successfully")
            setIsEditModalOpen(false)
        } catch (error) {
            toast.error("Failed to update profile")
            console.error("Update error:", error)
        }
    }

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

                        <span className="text-md ">{profileUser?.bio || "No bio available"}</span>

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
                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 p-2">
                                            <HiDotsVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40" align="end" forceMount>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <MdEdit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Edit Profile Modal */}
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullname">Full Name</Label>
                                                <Input
                                                    id="fullname"
                                                    value={formData.fullname}
                                                    onChange={(e) => handleInputChange("fullname", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    value={formData.location}
                                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="age">Age</Label>
                                                <Select
                                                    value={formData.age}
                                                    onValueChange={(value) => handleInputChange("age", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select age range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ageRangeOptions.map((age) => (
                                                            <SelectItem key={age} value={age}>
                                                                {age}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="role">Role</Label>
                                                <Select
                                                    value={formData.role}
                                                    onValueChange={(value) => handleInputChange("role", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="player">Player</SelectItem>
                                                        <SelectItem value="team">Team</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="position">Position</Label>
                                                <Select
                                                    value={formData.position}
                                                    onValueChange={(value) => handleInputChange("position", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {positionOptions.map((position) => (
                                                            <SelectItem key={position} value={position}>
                                                                {position}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="experienceLevel">Experience Level</Label>
                                                <Select
                                                    value={formData.experienceLevel}
                                                    onValueChange={(value) => handleInputChange("experienceLevel", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select experience level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {experienceLevelOptions.map((level) => (
                                                            <SelectItem key={level} value={level}>
                                                                {level}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={formData.bio}
                                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditModalOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSaveProfile}
                                                disabled={isUpdating}
                                                className="bg-gradient-redwhiteblued"
                                            >
                                                {isUpdating ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
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
