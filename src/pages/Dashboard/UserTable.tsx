
import { useGetUsersQuery } from "@/redux/ApiCalls/userApi"
import { createUserColumns } from "./TableData"
import { ReusableDataTable } from "./ReuseableDataTable"

export function UserTable() {
    const { data, isLoading, isError } = useGetUsersQuery()

    if (isLoading) return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Manage registered players and teams
                </p>
            </div>
            <div className="rounded-lg border bg-card p-4 sm:p-6">
                <p>Loading users...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Manage registered players and teams
                </p>
            </div>
            <div className="rounded-lg border bg-card p-4 sm:p-6">
                <p>Failed to load users</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Manage registered players and teams
                </p>
            </div>
            <div className="rounded-lg border bg-card overflow-hidden">
                <ReusableDataTable
                    columns={createUserColumns()}
                    data={data?.users || []}
                    searchKey="fullname"
                    searchPlaceholder="Search users..."
                />
            </div>
        </div>
    )
}
