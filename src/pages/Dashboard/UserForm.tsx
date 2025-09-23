import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/ApiCalls/userApi";
import { toast } from "sonner";

export function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(searchParams.get('mode') === 'edit');
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        role: "",
        isActive: true,
    });

    const { data: user, isLoading, error } = useGetUserQuery(id!, {
        skip: !id, // Skip the query if no ID is provided
    });
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    console.log("UserForm - ID:", id, "Loading:", isLoading, "User:", user, "Error:", error);

    // Handle potential API response wrapper
    const userData = user ? (user.user || user) : null;

    useEffect(() => {
        if (userData) {
            console.log("User data received:", userData);
            setFormData({
                fullname: userData.fullname || "",
                email: userData.email || "",
                role: userData.role || "",
                isActive: userData.isActive ?? true,
            });
        }
    }, [userData]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await updateUser({ id: id!, data: formData }).unwrap();
            toast.success("User updated successfully");
            setIsEditMode(false);
        } catch (error) {
            toast.error("Failed to update user");
            console.error("Update error:", error);
        }
    };

    const handleCancel = () => {
        if (userData) {
            setFormData({
                fullname: userData.fullname || "",
                email: userData.email || "",
                role: userData.role || "",
                isActive: userData.isActive ?? true,
            });
        }
        setIsEditMode(false);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">

                    <Card>
                        <CardContent className="p-6">
                            <p>Loading user details...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        console.error("Error loading user:", error);
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">

                    <Card>
                        <CardContent className="p-6">
                            <p>Failed to load user details</p>
                            <p className="text-sm text-muted-foreground mt-2">Error: {JSON.stringify(error)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!isLoading && !user) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">

                    <Card>
                        <CardContent className="p-6">
                            <p>User not found</p>
                            <p className="text-sm text-muted-foreground mt-2">ID: {id}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {isEditMode ? "Edit User" : "User Details"}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditMode ? "Update user information" : "View user information"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {!isEditMode ? (
                            <Button className="bg-gradient-redwhiteblued" onClick={() => setIsEditMode(true)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Edit User
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button className="bg-gradient-redwhiteblued" onClick={handleSave} disabled={isUpdating}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* User Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    value={formData.fullname}
                                    onChange={(e) => handleInputChange("fullname", e.target.value)}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange("role", value)}
                                    disabled={!isEditMode}
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="flex items-center space-x-2">
                                    <Badge variant={userData?.isActive ? "default" : "secondary"}>
                                        {userData?.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {isEditMode && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleInputChange("isActive", !formData.isActive)}
                                        >
                                            Toggle Status
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Created At</Label>
                                <Input
                                    value={userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Updated</Label>
                                <Input
                                    value={userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : "N/A"}
                                    disabled
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
