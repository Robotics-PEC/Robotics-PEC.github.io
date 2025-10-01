import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isAdmin = router.pathname === "/admin/page";

    return (
        <QueryClientProvider client={queryClient}>
            {
                isAdmin ? (
                    <PageLayout isAdmin={true}>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <Component {...pageProps} />
                        </TooltipProvider>
                    </PageLayout>
                ) : (
                    <PageLayout>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <Component {...pageProps} />
                        </TooltipProvider>
                    </PageLayout>
                )
            }
        </QueryClientProvider>
    );
}
