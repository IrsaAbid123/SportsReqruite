import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCreatePostMutation, useUpdatePostMutation, useGetPostQuery } from "@/redux/ApiCalls/postApi";
import { useUser } from "@/context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ageRangeOptions, experienceLevelOptions, positionOptions } from "@/constants/UserDataEnums";

export default function CreatePost() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser();
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiryDate: "",
    tags: "",
    requirements: {
      age: "",
      experience: "",
      positions: [] as string[],
    },
  });
  const [positionSelectOpen, setPositionSelectOpen] = useState(false);

  // Check if we're in edit mode
  const editMode = location.state?.editMode || false;
  const postId = location.state?.postId;
  const postData = location.state?.postData;
  const returnTo = location.state?.returnTo || "/profile"; // Default to profile if no return path specified

  // Fetch post data if in edit mode and no postData provided
  const { data: fetchedPostData, isLoading: isLoadingPost } = useGetPostQuery(postId!, {
    skip: !editMode || !postId || !!postData
  });

  // Initialize form data for edit mode
  useEffect(() => {
    if (editMode) {
      const dataToUse = postData || fetchedPostData;
      if (dataToUse) {
        setFormData({
          title: dataToUse.title || "",
          description: dataToUse.description || "",
          expiryDate: dataToUse.expiryDate ? new Date(dataToUse.expiryDate).toISOString().split('T')[0] : "",
          tags: dataToUse.tags ? dataToUse.tags.join(", ") : "",
          requirements: {
            age: dataToUse.requirements?.fromAge || "",
            experience: dataToUse.requirements?.experience || "",
            positions: dataToUse.requirements?.position ? dataToUse.requirements.position.split(", ") : [],
          },
        });
      }
    }
  }, [editMode, postData, fetchedPostData]);




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (["age", "experience"].includes(id)) {
      setFormData({
        ...formData,
        requirements: { ...formData.requirements, [id]: value },
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct final post object
    const postPayload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      author: user?._id,
      status: "available",
      requirements: {
        fromAge: formData.requirements.age,
        experience: formData.requirements.experience,
        position: formData.requirements.positions.join(", "),
      },
    };

    try {
      if (editMode && postId) {
        // Update existing post
        await updatePost({ id: postId, data: postPayload }).unwrap();
        navigate(returnTo); // Navigate back to the previous page
      } else {
        // Create new post
        const newPost = {
          ...postPayload,
          createdAt: new Date().toISOString(),
        };
        await createPost(newPost).unwrap();
        navigate("/");
      }

      // Reset form only for create mode
      if (!editMode) {
        setFormData({
          title: "",
          description: "",
          expiryDate: "",
          tags: "",
          requirements: { age: "", experience: "", positions: [] },
        });
      }
    } catch (err) {
      console.error(err);
      navigate(editMode ? returnTo : "/");
      alert(editMode ? "Failed to update post!" : "Failed to create post!");
    }
  };


  // Show loading state when fetching post data for edit mode
  if (editMode && isLoadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Branding / Image */}
      <div className="relative hidden lg:flex flex-col justify-center items-center bg-gradient-redwhiteblued text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Basketball Player"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">SportRecruit</h1>
          <p className="text-lg max-w-md mx-auto">
            Connect players, teams, and coaches. Showcase your skills and find
            new opportunities in sports.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background">
        <Card className="w-full max-w-xl p-6 sm:p-8 shadow-elevated border border-border/50">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center bg-gradient-redwhiteblued bg-clip-text text-transparent">
            {editMode ? "Edit Post" : "Create a New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Seeking Starting Pitcher for College Team"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Write a detailed description..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age Range</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        requirements: { ...formData.requirements, age: value },
                      })
                    }
                    value={formData.requirements.age}
                  >
                    <SelectTrigger id="age">
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

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        requirements: { ...formData.requirements, experience: value },
                      })
                    }
                    value={formData.requirements.experience}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevelOptions.map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="positions">Position(s)</Label>
                  <Popover open={positionSelectOpen} onOpenChange={setPositionSelectOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={positionSelectOpen}
                        className="w-full justify-between"
                      >
                        {formData.requirements.positions.length > 0
                          ? `${formData.requirements.positions.length} position(s) selected`
                          : "Select positions..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search positions..." />
                        <CommandList>
                          <CommandEmpty>No positions found.</CommandEmpty>
                          <CommandGroup>
                            {positionOptions.map((position) => (
                              <CommandItem
                                key={position}
                                value={position}
                                onSelect={() => {
                                  if (formData.requirements.positions.includes(position)) {
                                    setFormData({
                                      ...formData,
                                      requirements: {
                                        ...formData.requirements,
                                        positions: formData.requirements.positions.filter(p => p !== position)
                                      }
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      requirements: {
                                        ...formData.requirements,
                                        positions: [...formData.requirements.positions, position]
                                      }
                                    });
                                  }
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${formData.requirements.positions.includes(position) ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                                {position}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                type="text"
                placeholder="Baseball, Pitcher, College, Division II"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
              disabled={isLoadingPost}
            >
              {isLoadingPost ? "Loading..." : editMode ? "Update Post" : "Publish Post"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
