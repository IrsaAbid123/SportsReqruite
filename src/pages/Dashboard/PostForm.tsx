import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { useGetPostQuery, useUpdatePostMutation } from "@/redux/ApiCalls/postApi";
import { toast } from "sonner";

export function PostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(searchParams.get('mode') === 'edit');
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
        expiryDate: "",
        tags: [] as string[],
        requirements: {
            fromAge: "",
            toAge: "",
            experience: "",
            position: "",
        },
    });

    const { data: post, isLoading, error } = useGetPostQuery(id!, {
        skip: !id, // Skip the query if no ID is provided
    });
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

    console.log("PostForm - ID:", id, "Loading:", isLoading, "Post:", post, "Error:", error);

    // Handle potential API response wrapper
    const postData = post ? (post.post || post) : null;

    useEffect(() => {
        if (postData) {
            console.log("Post data received:", postData);
            setFormData({
                title: postData.title || "",
                description: postData.description || "",
                status: postData.status || "",
                expiryDate: postData.expiryDate ? new Date(postData.expiryDate).toISOString().split('T')[0] : "",
                tags: postData.tags || [],
                requirements: {
                    fromAge: postData.requirements?.fromAge || "",
                    toAge: postData.requirements?.toAge || "",
                    experience: postData.requirements?.experience || "",
                    position: postData.requirements?.position || "",
                },
            });
        }
    }, [postData]);

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRequirementsChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            requirements: { ...prev.requirements, [field]: value }
        }));
    };

    const handleTagsChange = (value: string) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleSave = async () => {
        try {
            const updateData = {
                ...formData,
                expiryDate: new Date(formData.expiryDate),
            };
            await updatePost({ id: id!, data: updateData }).unwrap();
            toast.success("Post updated successfully");
            setIsEditMode(false);
        } catch (error) {
            toast.error("Failed to update post");
            console.error("Update error:", error);
        }
    };

    const handleCancel = () => {
        if (postData) {
            setFormData({
                title: postData.title || "",
                description: postData.description || "",
                status: postData.status || "",
                expiryDate: postData.expiryDate ? new Date(postData.expiryDate).toISOString().split('T')[0] : "",
                tags: postData.tags || [],
                requirements: {
                    fromAge: postData.requirements?.fromAge || "",
                    toAge: postData.requirements?.toAge || "",
                    experience: postData.requirements?.experience || "",
                    position: postData.requirements?.position || "",
                },
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
                            <p>Loading post details...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        console.error("Error loading post:", error);
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">

                    <Card>
                        <CardContent className="p-6">
                            <p>Failed to load post details</p>
                            <p className="text-sm text-muted-foreground mt-2">Error: {JSON.stringify(error)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!isLoading && !post) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">

                    <Card>
                        <CardContent className="p-6">
                            <p>Post not found</p>
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
                                {isEditMode ? "Edit Post" : "Post Details"}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditMode ? "Update post information" : "View post information"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {!isEditMode ? (
                            <Button className="bg-gradient-redwhiteblued" onClick={() => setIsEditMode(true)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Edit Post
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

                {/* Post Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    disabled={!isEditMode}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleInputChange("status", value)}
                                    disabled={!isEditMode}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="filled">Filled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma-separated)</Label>
                                <Input
                                    id="tags"
                                    value={formData.tags.join(', ')}
                                    onChange={(e) => handleTagsChange(e.target.value)}
                                    disabled={!isEditMode}
                                    placeholder="e.g., basketball, professional, experience"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={formData.requirements.position}
                                    onChange={(e) => handleRequirementsChange("position", e.target.value)}
                                    disabled={!isEditMode}
                                    placeholder="e.g., Point Guard, Center"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience Level</Label>
                                <Input
                                    id="experience"
                                    value={formData.requirements.experience}
                                    onChange={(e) => handleRequirementsChange("experience", e.target.value)}
                                    disabled={!isEditMode}
                                    placeholder="e.g., 2+ years, Beginner"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fromAge">Minimum Age</Label>
                                <Input
                                    id="fromAge"
                                    value={formData.requirements.fromAge}
                                    onChange={(e) => handleRequirementsChange("fromAge", e.target.value)}
                                    disabled={!isEditMode}
                                    placeholder="e.g., 16"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="toAge">Maximum Age</Label>
                                <Input
                                    id="toAge"
                                    value={formData.requirements.toAge}
                                    onChange={(e) => handleRequirementsChange("toAge", e.target.value)}
                                    disabled={!isEditMode}
                                    placeholder="e.g., 25"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
