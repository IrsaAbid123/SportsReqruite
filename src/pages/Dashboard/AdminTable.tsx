import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGetAdminsQuery, useDeleteAdminMutation } from "@/redux/ApiCalls/authApi"
import { ReusableDataTable } from "./ReuseableDataTable"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { toast } from "sonner"

export type Admin = {
    _id: string
    fullname: string
    email: string
    location?: string
    age?: string
    experienceLevel?: string
    position?: string
    role: "admin"
    verified?: boolean
    followers?: string[]
    following?: string[]
    createdAt: string
    updatedAt: string
    avatar?: string
}

// Define columns for admins
export const createAdminColumns = (): ColumnDef<Admin>[] => [
    {
        accessorKey: "fullname",
        header: "Name",
        cell: ({ row }) => {
            const admin = row.original
            return (
                <div className="max-w-[200px]">
                    <div className="font-medium truncate">{admin.fullname}</div>
                    <div className="text-sm text-muted-foreground truncate">{admin.email}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            const location = row.getValue("location") as string
            return (
                <div className="max-w-[150px]">
                    <div className="text-sm truncate">{location || "N/A"}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "verified",
        header: "Status",
        cell: ({ row }) => {
            const verified = row.getValue("verified") as boolean
            return (
                <Badge
                    variant={verified ? "default" : "secondary"}
                    className={verified ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                >
                    {verified ? "Verified" : "Unverified"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div>
                    {date.toLocaleDateString()}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const admin = row.original
            const navigate = useNavigate()
            const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation()
            const [showDeleteDialog, setShowDeleteDialog] = useState(false)

            const handleView = () => {
                navigate(`/dashboard/admins/${admin._id}`)
            }

            const handleEdit = () => {
                navigate(`/dashboard/admins/${admin._id}?mode=edit`)
            }

            const handleDelete = async () => {
                try {
                    await deleteAdmin(admin._id).unwrap()
                    toast.success("Admin removed successfully")
                    setShowDeleteDialog(false)
                } catch (error) {
                    toast.error("Failed to remove admin")
                    console.error("Delete error:", error)
                }
            }

            return (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleView}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEdit}
                        className="text-green-600 hover:text-green-800"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <ConfirmationDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        title="Remove Admin"
                        description={`Are you sure you want to remove "${admin.fullname}" from admin privileges? This action cannot be undone.`}
                        onConfirm={handleDelete}
                        isLoading={isDeleting}
                    />
                </div>
            )
        },
    },
]

interface AdminTableProps {
    setActiveTab?: (tab: string) => void;
}

export function AdminTable({ setActiveTab }: AdminTableProps) {
    const { data, isLoading, isError } = useGetAdminsQuery()

    if (isLoading) return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Management</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Manage platform administrators and their access
                </p>
            </div>
            <div className="rounded-lg border bg-card p-4 sm:p-6">
                <p>Loading admins...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Management</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Manage platform administrators and their access
                </p>
            </div>
            <div className="rounded-lg border bg-card p-4 sm:p-6">
                <p>Failed to load admins</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Management</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Manage platform administrators and their access
                    </p>
                </div>
                <Button
                    className="bg-gradient-redwhiteblued w-full sm:w-auto"
                    onClick={() => setActiveTab?.('admin-form')}
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Admin
                </Button>
            </div>
            <div className="rounded-lg border bg-card overflow-hidden">
                <ReusableDataTable
                    columns={createAdminColumns()}
                    data={data?.users || []}
                    searchKey="fullname"
                    searchPlaceholder="Search admins..."
                />
            </div>
        </div>
    )
}
