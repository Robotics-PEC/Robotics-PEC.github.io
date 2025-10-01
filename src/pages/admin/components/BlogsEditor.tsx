import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { fetchUserByEmail, fetchUserBySID, insertBlogPost } from "@/lib/supabase/actions/blogs.action";
import Blob from "@/components/Blob";
import MarkdownEditor from "./MarkdownEditor";

const blogFormSchema = z.object({
    sid: z.string().min(8, "SID is required and must be 8 digits").max(8, "SID is required and must be 8 digits"),
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    branch: z.string().min(2, "Branch is required").max(100, "Branch must be less than 100 characters"),
    bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must be less than 500 characters"),
    email: z.string().email("Invalid email address"),
    content: z.string().min(50, "Blog content must be at least 50 characters").max(10000, "Blog content must be less than 10000 characters"),
    image: z.string().min(0, "Image is Required")
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const BlogsEditor = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            sid: "",
            name: "",
            branch: "",
            bio: "",
            content: "",
            image: ""
        },
    });

    const onSubmit = async (data: BlogFormValues) => {
        console.log({ data });
        setIsSubmitting(true);

        if (!data.email.includes("pec.edu.in")) {
            toast.error("Please enter PEC Email ID", {
                description: "Please enter a valid email address.",
            });
            setIsSubmitting(false);
            return;
        }


        const email = data.email.trim();
        const user = await fetchUserByEmail(email);


        if (user.data) {
            toast.error("You have already submitted a blog post", {
                description: "You can only submit one blog post",
            });
            setIsSubmitting(false);
            return;
        }

        const sid = data.sid.trim();
        const userBySID = await fetchUserBySID(sid);

        if (userBySID.data) {
            toast.error("You have already submitted a blog post", {
                description: "You can only submit one blog post",
            });
            setIsSubmitting(false);
            return;
        }

        const error = await insertBlogPost(data);

        if (error) {
            toast.error("Failed to submit blog post", {
                description: error.message,
            });
            setIsSubmitting(false);
        }

        else {
            toast.success("Blog post submitted successfully");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                <h2 className="text-xl font-medium text-card-foreground mb-6">Add New Blog Post</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-row gap-10 w-full">
                            <FormField
                                control={form.control}
                                name="sid"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>SID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your SID" {...field} className="border-2 border-black" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} className="border-2 border-black" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-row gap-10">
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Branch</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your branch or department" {...field} className="border-2 border-black" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your PEC Email ID"
                                                {...field}
                                                className="border-2 border-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a short bio about yourself"
                                            className="min-h-[100px] resize-none border-2 border-black"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Insert Your Image to be featured in the website
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Blob
                                            setData={field.onChange}
                                            id="imageBlob"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Brief introduction about yourself (10-500 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blog Content</FormLabel>
                                    <FormControl>
                                        <MarkdownEditor
                                            placeholder="Write your blog content here..."
                                            value={field.value}
                                            onChange={field.onChange}
                                            dontWantImage={true}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your main blog content (minimum 50 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="flex-1 sm:flex-none" disabled={isSubmitting}>
                                {!isSubmitting ? "Submit Blog Post" : "Submitting..."}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                className="flex-1 sm:flex-none"
                            >
                                Reset Form
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default BlogsEditor;
