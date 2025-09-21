import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { StatsCards } from "./StatsCards";
import { UserTable } from "./UserTable";
import { PostTable } from "./PostTable";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">
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
            default:
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">
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
