import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

const PageLayout: React.FC<{ children: ReactNode, isAdmin?: boolean }> = ({ children, isAdmin = false }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Header isAdmin={isAdmin} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default PageLayout;
