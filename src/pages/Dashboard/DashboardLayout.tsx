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
    Shield,
} from "lucide-react"
import { Header } from "@/components/Header"
import { useUser } from "@/context/UserContext"


const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
    { icon: Users, label: "Users", href: "users" },
    { icon: Package, label: "Posts", href: "posts" },
    { icon: Shield, label: "Admin Management", href: "admins" },
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
    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

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
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex flex-row flex-1">
                {/* Sidebar */}
                <div
                    className={cn(
                        "fixed left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {/* Mobile sidebar header */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            // Hide admin management for non-admin users
                            if (item.href === "admins" && !isAdmin) {
                                return null;
                            }

                            return (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground",
                                        activeTab === item.href &&
                                        "bg-gradient-redwhiteblued"
                                    )}
                                    onClick={() => {
                                        setActiveTab(item.href);
                                        setSidebarOpen(false); // Close sidebar on mobile after selection
                                    }}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Button>
                            );
                        })}
                    </nav>
                </div>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                    {/* Page content */}
                    <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </div>
    )
}
