"use client";

import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHead from "@/components//layout/PageHead";

const NotFound = () => {
  const router = useRouter();

  return (
    <PageLayout>
      <PageHead
        title="Oops"
        description="Return to Homepage"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 mx-4 bg-white rounded-xl shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2
            }}
            className="mx-auto mb-6 w-24 h-24 flex items-center justify-center bg-amber-100 rounded-full"
          >
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">Oops!</h1>
          <p className="text-gray-600 mb-6">
            It seems you've wandered to the wrong page.
            Don't worry, it happens to the best of us!
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default NotFound;