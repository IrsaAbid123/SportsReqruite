import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
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
import { FaLocationDot } from "react-icons/fa6"
import { MdEdit } from "react-icons/md"
import { HiDotsVertical } from "react-icons/hi"
import { Trophy } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"
import { ageRangeOptions, experienceLevelOptions, positionOptions } from "@/constants/UserDataEnums"
import {
    useGetProfileQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useFollowUserMutation,
    useUnfollowUserMutation
} from "@/redux/ApiCalls/userApi"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function ProfilePage() {
    const { user } = useUser()
    const { id } = useParams()

    // Profile user id (view own if id not present)
    const profileUserId = id || user?._id

    // Queries
    const { data: profileData, isLoading: profileLoading, error: profileError } = useGetProfileQuery(profileUserId!, {
        skip: !profileUserId
    })

    const { data: userData, isLoading: userLoading, error: userError } = useGetUserQuery(profileUserId!, {
        skip: !profileUserId || !id
    })

    const data = id ? userData : profileData
    const isLoading = id ? userLoading : profileLoading
    const error = id ? userError : profileError

    const [updateUser] = useUpdateUserMutation()
    const [followUser] = useFollowUserMutation()
    const [unfollowUser] = useUnfollowUserMutation()

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

    // Initialize form data
    useEffect(() => {
        if (data?.user || data) {
            const profileUser = data?.user || data
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
    }, [data])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading profile</div>

    const profileUser = data?.user || data
    const listings = id ? [] : (data?.post || [])
    const isOwnProfile = user?._id === profileUserId
    const isFollowing = profileUser?.followers?.includes(user?._id)

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

    const handleFollowToggle = async () => {
        if (!user?._id || !profileUser?._id) return

        try {
            if (isFollowing) {
                await unfollowUser({ currentUserId: user._id, targetUserId: profileUser._id }).unwrap()
                toast.success("Unfollowed successfully")
                profileUser.followers = profileUser.followers.filter((f: string) => f !== user._id)
            } else {
                await followUser({ currentUserId: user._id, targetUserId: profileUser._id }).unwrap()
                toast.success("Followed successfully")
                profileUser.followers.push(user._id)
            }
        } catch (error) {
            toast.error("Action failed")
            console.error("Follow/Unfollow error:", error)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-80 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Info */}
            <section className="py-10 px-32 bg-card border-b flex flex-row">
                <div>
                    <Avatar className="w-44 -mt-28 h-44 mb-4 border-4 border-white shadow-lg">
                        <AvatarImage src={"/placeholder.svg"} alt={profileUser?.fullname} />
                        <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                            {profileUser?.fullname?.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex flex-row w-full justify-between items-start">
                    <div className="flex-1">
                        {/* Name */}
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-xl font-bold">{profileUser?.fullname}</p>
                            {profileUser?.verified && <Badge variant="default" className="bg-green-500">Verified</Badge>}
                        </div>

                        {/* Role/Position */}
                        <div className="flex items-center gap-4 mb-2">
                            <Badge variant="outline" className="capitalize">{profileUser?.role}</Badge>
                            {profileUser?.position && <Badge variant="secondary" className="capitalize">{profileUser.position}</Badge>}
                        </div>

                        {/* Age/Experience */}
                        <div className="flex items-center gap-4 mb-3">
                            {profileUser?.age && <span className="text-sm text-gray-600">Age: <span className="font-medium">{profileUser.age}</span></span>}
                            {profileUser?.experienceLevel && <span className="text-sm text-gray-600">Experience: <span className="font-medium">{profileUser.experienceLevel}</span></span>}
                        </div>

                        {/* Bio */}
                        <span className="text-md">{profileUser?.bio || "No bio available"}</span>

                        {/* Location */}
                        <div className="flex flex-row gap-5 py-5">
                            <span className="text-gray-400 flex flex-row items-center text-sm gap-1">
                                <FaLocationDot /> {profileUser?.location}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-600">
                                <span className="font-semibold">{profileUser?.followers?.length || 0}</span> Followers
                            </span>
                            <span className="text-gray-600">
                                <span className="font-semibold">{profileUser?.following?.length || 0}</span> Following
                            </span>
                            <span className="text-gray-600">
                                Member since <span className="font-medium">
                                    {profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Edit or Follow Button */}
                    <div className="">
                        {isOwnProfile ? (
                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 p-2">
                                            <HiDotsVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40" align="end" forceMount>
                                        <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                            <MdEdit className="mr-2 h-4 w-4" /> Edit Profile
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Edit Modal */}
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField label="Full Name" value={formData.fullname} onChange={(val) => handleInputChange("fullname", val)} />
                                            <InputField label="Email" value={formData.email} onChange={(val) => handleInputChange("email", val)} />
                                            <InputField label="Location" value={formData.location} onChange={(val) => handleInputChange("location", val)} />
                                            <SelectField label="Age" options={ageRangeOptions} value={formData.age} onChange={(val) => handleInputChange("age", val)} />
                                            <SelectField label="Role" options={["player", "team", "admin"]} value={formData.role} onChange={(val) => handleInputChange("role", val)} />
                                            <SelectField label="Position" options={positionOptions} value={formData.position} onChange={(val) => handleInputChange("position", val)} />
                                            <SelectField label="Experience Level" options={experienceLevelOptions} value={formData.experienceLevel} onChange={(val) => handleInputChange("experienceLevel", val)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} rows={4} />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                            <Button onClick={handleSaveProfile} className="bg-gradient-redwhiteblued">Save Changes</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <Button
                                className={`w-full py-3 px-6 rounded-full flex items-center justify-center ${isFollowing ? "bg-gray-400 text-white" : "bg-gradient-redwhiteblued text-white"}`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Profile Posts */}
            <div className="container flex flex-row px-32 py-10 gap-10">
                <div className="p-6">
                    <div className="space-y-3 mb-5">
                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <a href={`mailto:${profileUser?.email}`} className="text-gray-400 hover:underline">{profileUser?.email}</a>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    <div className="text-4xl font-bold bg-gradient-redwhiteblued bg-clip-text text-transparent">
                        {isOwnProfile ? "My Posts" : `${profileUser?.fullname}'s Posts`}
                    </div>
                    {listings.length > 0 ? (
                        listings.map((listing: any) => (
                            <ListingCard key={listing._id} listing={listing} onContact={() => { }} onSave={() => { }} />
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

// Helper Components for Inputs
const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
)

const SelectField = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
            <SelectContent>
                {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
)
