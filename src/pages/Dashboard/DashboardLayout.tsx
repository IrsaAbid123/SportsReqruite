"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    LayoutDashboard,
    Layers,
    Table,
    FileText,
    CreditCard,
    Medal as Modal,
    FileX,
    Search,
    Bell,
    Menu,
    X,
    Package,
    Users,
} from "lucide-react"
import { Header } from "@/components/Header"
import { useUser } from "@/context/UserContext"


const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
    { icon: Users, label: "Users", href: "users" },
    { icon: Package, label: "Posts", href: "posts" },
];

interface DashboardLayoutProps {
    children: React.ReactNode
    activeTab: string
    setActiveTab: (tab: string) => void
}

export function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, setUser } = useUser();
    const isAuthenticated = !!user;

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const handleSearch = (query: string) => {
        // Mock search functionality
        console.log("Searching for:", query);
    };

    return (
        <div className="flex h-screen bg-background flex-col">
            {/* <Header /> */}
            <div className="flex flex-row">
                {/* Sidebar */}
                <div
                    className={cn(
                        "fixed  left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground",
                                    activeTab === item.href &&
                                    "bg-gradient-redwhiteblued"
                                )}
                                onClick={() => setActiveTab(item.href)}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </div>


                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                    {/* Page content */}
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </div>
        </div>
    )
}
