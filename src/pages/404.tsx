"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import PageHead from "@/components/layout/PageHead";

const NotFound = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <PageLayout>
      <PageHead
        title="Robotics Society | Punjab Engineering College"
        description="Looks like you are lost, join us we will lead the way"
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center ">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <Button
            className=""
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
