import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

const PageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default PageLayout;