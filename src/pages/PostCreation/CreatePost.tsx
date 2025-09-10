import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export default function CreatePost() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct final post object
    const newPost = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      author: {
        name: "Coach Martinez",
        role: "team",
        avatar: "/placeholder.svg",
        experience: "15+ years coaching",
        location: "Austin, TX",
      },
      status: "available",
      createdAt: new Date().toISOString().split("T")[0],
    };

    console.log("📌 New Post:", newPost);
    alert("Post Created! (check console)");
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
                <div className="space-y-2">
                  <Label htmlFor="age">Age Range</Label>
                  <Input
                    id="age"
                    type="text"
                    placeholder="18-22"
                    value={formData.requirements.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    type="text"
                    placeholder="High School+"
                    value={formData.requirements.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="Pitcher"
                    value={formData.requirements.position}
                    onChange={handleChange}
                  />
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
