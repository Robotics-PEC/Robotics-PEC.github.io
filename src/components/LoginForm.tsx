import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import crypto from "crypto";
import { useRouter } from "next/router";
import { loginUser } from "@/lib/supabase/actions/auth.actions";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email",
                variant: "destructive",
            });
            return;
        }

        if (!password) {
            toast({
                title: "Error",
                description: "Please enter your password",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            const data = await loginUser(email, password);

            if (!data) {
                throw new Error;
            }

            if (data) {
                document.cookie = `sb-access-token=${data.session.access_token}; path=/; Secure`;
                document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; Secure`;
                router.push("/admin/page");
            }

            setTimeout(() => {
                toast({
                    title: "Success",
                    description: "You have successfully logged in!",
                });
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to log in. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                        <Mail size={16} />
                    </div>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>

                </div>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                        <Lock size={16} />
                    </div>
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                </div>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Log in"}
            </Button>
        </form>
    );
};

export default LoginForm;