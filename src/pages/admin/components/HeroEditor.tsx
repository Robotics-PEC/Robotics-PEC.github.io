import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Save } from "lucide-react";
import { getImagesFromFolder } from "@/lib/supabase/actions/storage.actions";
import { Loader } from "@/components/layout/Loader";
import { getData } from "@/lib/supabase/actions/hero.actions";
import { HeroType, ImageObjectType } from "@/types";
import Blob from "@/components/Blob";


const emptyData: HeroType = {
  heading: "",
  description: "",
};

const HeroEditor = () => {


  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<HeroType>(emptyData);
  const [images, setImages] = useState<string[]>([]);

  const [imagesObject, setImagesObject] = useState<ImageObjectType>();

  const [image1FileName, setImage1FileName] = useState("");
  const [image2FileName, setImage2FileName] = useState("");
  const [image3FileName, setImage3FileName] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await getImagesFromFolder("hero");
      const textData = await getData();
      setHeroData(textData);
      setImages(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const { toast } = useToast();

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

  const handleRemoveImage = (index: number) => { };
  const handleAddImage = () => { };


  return (
    <Loader isLoading={loading}>
      < div className="space-y-6" >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={heroData.heading}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[260px] h-[1000px]">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`Background ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
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
            <Blob
              id="image1"
              onChange={setImagesObject}
              setFileName={setImage1FileName}
            />
            <Blob
              id="image2"
              onChange={setImagesObject}
              setFileName={setImage2FileName}
            />
            <Blob
              id="image3"
              onChange={setImagesObject}
              setFileName={setImage3FileName}
            />
          </div>
          <Button onClick={handleAddImage} className="w-full">
            <Plus className="w-full mr-1" /> Add Image
          </Button>
        </div>

        <Button onClick={handleSave} className="mt-6 w-full" size="lg">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </ div>
    </ Loader >
  );
};

export default HeroEditor;
