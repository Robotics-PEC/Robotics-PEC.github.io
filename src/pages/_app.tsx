import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/router";
import { AuthRoleProvider } from "@/lib/useAuthRole";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>    
            <AuthRoleProvider>
                <PageLayout>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <Component {...pageProps} />
                    </TooltipProvider>
                </PageLayout>
            </AuthRoleProvider>
        </QueryClientProvider>
    );
}
