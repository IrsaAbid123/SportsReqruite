import { useState } from "react";
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
import { useCreatePostMutation } from "@/redux/ApiCalls/postApi";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { ageRangeOptions, experienceLevelOptions, positionOptions } from "@/constants/UserDataEnums";

export default function CreatePost() {
  const navigate = useNavigate()
  const { user } = useUser();
  const [createPost] = useCreatePostMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiryDate: "",
    tags: "",
    requirements: {
      age: "",
      experience: "",
      position: "",
    },
  });




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (["age", "experience", "position"].includes(id)) {
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
    const newPost = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      author: user?._id, // replace with actual logged-in user ID
      status: "available",
      createdAt: new Date().toISOString(),
      requirements: {
        fromAge: formData.requirements.age,
        experience: formData.requirements.experience,
        position: formData.requirements.position,
      },
    };

    try {
      await createPost(newPost).unwrap();
      navigate("/")
      setFormData({
        title: "",
        description: "",
        expiryDate: "",
        tags: "",
        requirements: { age: "", experience: "", position: "" },
      });
    } catch (err) {
      console.error(err);
      navigate("/")
      alert("Failed to create post!");
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Branding / Image */}
      <div className="relative hidden md:flex flex-col justify-center items-center bg-gradient-redwhiteblued text-white overflow-hidden">
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
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-xl p-8 shadow-elevated border border-border/50">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-redwhiteblued bg-clip-text text-transparent">
            Create a New Post
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="position">Position</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        requirements: { ...formData.requirements, position: value },
                      })
                    }
                    value={formData.requirements.position}
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            >
              Publish Post
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
