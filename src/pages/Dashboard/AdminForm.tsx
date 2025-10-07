import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRegisterUserMutation } from "@/redux/ApiCalls/authApi";
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/ApiCalls/userApi";
import { toast } from "sonner";

interface AdminFormProps {
    setActiveTab?: (tab: string) => void;
}

export function AdminForm({ setActiveTab }: AdminFormProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(searchParams.get('mode') === 'edit');
    const [isViewMode, setIsViewMode] = useState(!id || searchParams.get('mode') === 'view');
    const [isInviteMode, setIsInviteMode] = useState(!id); // Create mode when no ID

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        role: "admin",
        isActive: true,
    });

    // Fetch admin data if we have an ID
    const { data: admin, isLoading, error } = useGetUserQuery(id!, {
        skip: !id, // Skip the query if no ID is provided
    });

    const [registerUser, { isLoading: isInviting }] = useRegisterUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    // Handle potential API response wrapper
    const adminData = admin ? (admin.user || admin) : null;

    useEffect(() => {
        if (adminData) {
            console.log("Admin data received:", adminData);
            setFormData({
                fullname: adminData.fullname || "",
                email: adminData.email || "",
                role: adminData.role || "admin",
                isActive: adminData.isActive ?? true,
            });
        }
    }, [adminData]);

    const handleInputChange = (field: string, value: string | boolean) => {
        if (isViewMode) return; // Don't allow changes in view mode
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            if (isEditMode && id) {
                // Update existing admin using user API
                await updateUser({ id, data: formData }).unwrap();
                toast.success("Admin updated successfully");
            } else {
                // Create new admin
                const adminData = {
                    ...formData,
                    password: "TempPassword123!", // Temporary password that admin will need to change
                    confirmPassword: "TempPassword123!"
                };
                await registerUser(adminData).unwrap();
                toast.success("Admin registered successfully");
            }
            setActiveTab?.('admins');
        } catch (error) {
            const action = isEditMode ? "update" : "register";
            toast.error(`Failed to ${action} admin`);
            console.error("Save error:", error);
        }
    };

    const handleCancel = () => {
        setActiveTab?.('admins');
    };

    // Loading state
    if (isLoading) return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Loading Admin...</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Please wait while we fetch the admin data</p>
                </div>
                <div className="rounded-lg border bg-card p-4 sm:p-6">
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    );

    // Error state
    if (error) return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Error</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Failed to load admin data</p>
                </div>
                <div className="rounded-lg border bg-card p-4 sm:p-6">
                    <p>Error loading admin information</p>
                </div>
            </div>
        </div>
    );

    const getTitle = () => {
        if (isViewMode) return "View Admin Details";
        if (isEditMode) return "Edit Admin";
        return "Register New Admin";
    };

    const getDescription = () => {
        if (isViewMode) return "View administrator account details";
        if (isEditMode) return "Update administrator account information";
        return "Register a new administrator account";
    };

    const getButtonText = () => {
        if (isViewMode) return "Back to Admins";
        if (isEditMode) return isUpdating ? "Updating Admin..." : "Update Admin";
        return isInviting ? "Registering Admin..." : "Register Admin";
    };

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {getTitle()}
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base">
                                {getDescription()}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                            {isViewMode ? <ArrowLeft className="h-4 w-4 mr-2" /> : null}
                            {isViewMode ? "Back" : "Cancel"}
                        </Button>
                        {!isViewMode && (
                            <Button
                                className="bg-gradient-redwhiteblued w-full sm:w-auto"
                                onClick={handleSave}
                                disabled={isInviting || isUpdating}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {getButtonText()}
                            </Button>
                        )}
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
                                    disabled={isViewMode}
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
                                    disabled={isViewMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange("role", value)}
                                    disabled={isViewMode}
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
                                    {!isViewMode && (
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
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    {isViewMode ? "Admin Information" : isEditMode ? "Admin Update" : "Admin Registration"}
                                </h4>
                                <p className="text-sm text-blue-700">
                                    {isViewMode
                                        ? "View the administrator account details and status information."
                                        : isEditMode
                                            ? "Update the administrator account information. Changes will be saved immediately."
                                            : "A new admin account will be created with the provided information. The admin will receive login credentials and should change their password on first login."
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

