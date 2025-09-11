
import { Header } from "@/components/Header"
import { useState } from "react";
import { Outlet } from "react-router-dom"
import { mockUser } from "./data/mockData";

export const MainLayout = ({ onLogout }: { onLogout?: () => void }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(mockUser);

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleSearch = (query: string) => {
        // Mock search functionality
        console.log("Searching for:", query);
    };
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header on top */}
            <Header
                currentUser={currentUser}
                onSearch={handleSearch}
                onLogout={handleLogout} />

            {/* Page content */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
