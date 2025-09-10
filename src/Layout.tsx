
import { Header } from "@/components/Header"
import { Outlet } from "react-router-dom"

export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header on top */}
            <Header />

            {/* Page content */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
