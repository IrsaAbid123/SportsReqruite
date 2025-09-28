import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { StatsCards } from "./StatsCards";
import { UserTable } from "./UserTable";
import { PostTable } from "./PostTable";
import { AdminTable } from "./AdminTable";
import { AdminForm } from "./AdminForm";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { user } = useUser();
    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground text-sm sm:text-base">
                                Welcome to your sports recruitment dashboard
                            </p>
                        </div>
                        <StatsCards />
                    </div>
                );
            case "users":
                return <UserTable />;
            case "posts":
                return <PostTable />;
            case "admins":
                if (!isAdmin) {
                    return (
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Access Denied</h1>
                                <p className="text-muted-foreground text-sm sm:text-base">
                                    You don't have permission to access admin management.
                                </p>
                            </div>
                        </div>
                    );
                }
                return <AdminTable setActiveTab={setActiveTab} />;
            case "admin-form":
                if (!isAdmin) {
                    return (
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Access Denied</h1>
                                <p className="text-muted-foreground text-sm sm:text-base">
                                    You don't have permission to access admin management.
                                </p>
                            </div>
                        </div>
                    );
                }
                return <AdminForm setActiveTab={setActiveTab} />;
            default:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground text-sm sm:text-base">
                                Welcome to your sports recruitment dashboard
                            </p>
                        </div>
                        <StatsCards />
                    </div>
                );
        }
    };

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </DashboardLayout>
    )
}
