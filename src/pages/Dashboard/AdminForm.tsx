import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, UserPlus, ArrowLeft } from "lucide-react";
import { useGetAdminQuery, useUpdateAdminMutation, useRegisterUserMutation } from "@/redux/ApiCalls/authApi";
import { toast } from "sonner";

interface AdminFormProps {
    setActiveTab?: (tab: string) => void;
}

export function AdminForm({ setActiveTab }: AdminFormProps) {
    const [isInviteMode, setIsInviteMode] = useState(true); // Always in invite mode for this component
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        role: "admin",
        isActive: true,
    });

    const [registerUser, { isLoading: isInviting }] = useRegisterUserMutation();

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            // Add a temporary password for admin registration
            const adminData = {
                ...formData,
                password: "TempPassword123!", // Temporary password that admin will need to change
                confirmPassword: "TempPassword123!"
            };

            await registerUser(adminData).unwrap();
            toast.success("Admin registered successfully");
            setActiveTab?.('admins');
        } catch (error) {
            toast.error("Failed to register admin");
            console.error("Save error:", error);
        }
    };

    const handleCancel = () => {
        setActiveTab?.('admins');
    };


    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Register New Admin
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base">
                                Register a new administrator account
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            className="bg-gradient-redwhiteblued w-full sm:w-auto"
                            onClick={handleSave}
                            disabled={isInviting}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isInviting ? "Registering Admin..." : "Register Admin"}
                        </Button>
                    </div>
                </div>

                {/* Admin Form */}
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
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="Enter email address"
                                />
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
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super-admin">Super Admin</SelectItem>
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
                                    <Badge variant={formData.isActive ? "default" : "secondary"}>
                                        {formData.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleInputChange("isActive", !formData.isActive)}
                                    >
                                        Toggle Status
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Admin Registration</h4>
                                <p className="text-sm text-blue-700">
                                    A new admin account will be created with the provided information.
                                    The admin will receive login credentials and should change their password on first login.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

