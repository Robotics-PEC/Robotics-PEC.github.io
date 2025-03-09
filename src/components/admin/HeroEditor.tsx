import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Save } from "lucide-react";

// Default data structure
const defaultHeroData = {
  title: "PEC Robotics Society",
  description: "Pushing the boundaries of innovation through robotics and automation",
  images: [
    "/gallery/image1.jpg",
    "/gallery/image2.jpg",
    "/gallery/image3.jpg",
  ]
};

const HeroEditor = () => {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState(defaultHeroData);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Load data from localStorage if exists
  useEffect(() => {
    const savedData = localStorage.getItem("heroData");
    if (savedData) {
      try {
        setHeroData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved hero data:", error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("heroData", JSON.stringify(heroData));
    toast({
      title: "Changes saved",
      description: "Hero section has been updated successfully.",
    });
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    setHeroData(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl]
    }));
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setHeroData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={heroData.title}
          onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter hero title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={heroData.description}
          onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter hero description"
        />
      </div>

      <div className="space-y-4">
        <Label>Background Images</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Background ${index + 1}`}
                className="h-40 w-full object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
          <Button onClick={handleAddImage}>
            <Plus className="h-4 w-4 mr-1" /> Add Image
          </Button>
        </div>
      </div>

      <Button onClick={handleSave} className="mt-6 w-full" size="lg">
        <Save className="h-4 w-4 mr-2" /> Save Changes
      </Button>
    </div>
  );
};

export default HeroEditor;
