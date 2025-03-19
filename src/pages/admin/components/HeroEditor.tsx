import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Save } from "lucide-react";
import { deleteImage, getImagesFromFolder, uploadImage } from "@/lib/supabase/actions/storage.actions";
import { Loader } from "@/components/layout/Loader";
import { getHeroData, updateHeroData } from "@/lib/supabase/actions/hero.actions";
import { HeroType, ImageObjectType } from "@/types";
import Blob from "@/components/Blob";
import FormField from "@/components/FormField";


const emptyData: HeroType = {
  heading: "",
  description: "",
};

const emptyImageObject: ImageObjectType = {
  image1: "",
  image2: "",
  image3: ""
}

const HeroEditor = () => {


  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<HeroType>(emptyData);
  const [images, setImages] = useState<string[]>([]);

  const [imagesObject, setImagesObject] = useState<ImageObjectType>(emptyImageObject);

  const [image1FileName, setImage1FileName] = useState("");
  const [image2FileName, setImage2FileName] = useState("");
  const [image3FileName, setImage3FileName] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await getImagesFromFolder("hero");
      const textData = await getHeroData();
      setHeroData(textData);
      setImages(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const { toast } = useToast();

  const saveImages = async (folder: string) => {
    let size = 0;

    for (const [key, value] of Object.entries(imagesObject)) {
      if (value) size++;
    }

    const currentImages = (await getImagesFromFolder(folder)).map((image) => image.split("/").pop());

    for (let i = 0; i < size; i++) {
      await deleteImage([`${folder}/${currentImages[i]}`]);
    }

    if (imagesObject["image1"]) {
      await uploadImage(folder, image1FileName, imagesObject["image1"]);
    }

    if (imagesObject["image2"]) {
      await uploadImage(folder, image2FileName, imagesObject["image2"]);
    }

    if (imagesObject["image3"]) {
      await uploadImage(folder, image3FileName, imagesObject["image3"]);
    }

    toast({
      title: "Success",
      description: "Uploaded all the images successfully"
    });
  }

  const handleSave = async () => {

    // pre update check to make sure data is different that what is currently stored

    const data = await getHeroData();

    if (data.heading == heroData.heading && data.description == heroData.description && (image1FileName == "" && image2FileName == "" && image3FileName == "")) {
      toast({
        title: "Error",
        description: "Please make some changes",
        variant: "destructive"
      });
      return;
    }

    // save the images and remove the old ones
    await saveImages("hero");

    // update the data base with the current record
    const error = await updateHeroData(heroData);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    else {
      toast({
        title: "Success",
        description: "Hero data updated successfully",
      });
      location.reload();
    }

  };

  const handleRemoveImage = (index: number) => { };

  return (
    <Loader isLoading={loading}>
      <div className="space-y-6">
        <FormField
          id="heading"
          title="Heading"
          htmlFor="heading"
          onChange={setHeroData}
          placeholder="Enter Heading"
          type="TEXT"
          value={heroData.heading}
        />

        <FormField
          id="description"
          title="Description"
          htmlFor="description"
          onChange={setHeroData}
          placeholder="Enter Description"
          type="TEXT"
          value={heroData.description}
        />
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

          <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
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
        </div>

        <Button onClick={handleSave} className="mt-6 w-full" size="lg">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </ div>
    </ Loader >
  );
};

export default HeroEditor;
