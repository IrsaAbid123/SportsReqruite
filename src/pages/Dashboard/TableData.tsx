"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDeleteUserMutation } from "@/redux/ApiCalls/userApi"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { toast } from "sonner"

export type User = {
    _id: string
    fullname: string
    email: string
    location?: string
    age?: string
    experienceLevel?: string
    position?: string
    role?: "player" | "team" | "admin"
    avatar?: string
    verified: boolean
    followers: string[]
    following: string[]
    createdAt: Date
    updatedAt: Date
}

export const createUserColumns = (): ColumnDef<User>[] => [
    {
        accessorKey: "fullname",
        header: "Name",
        cell: ({ row }) => {
            const user = row.original
            const initials = user.fullname.split(' ').map(n => n[0]).join('').toUpperCase()

            return (
                <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.fullname} className="h-8 w-8 rounded-full" />
                        ) : (
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.fullname}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
            const user = row.original
            return (
                <div>
                    <div className="font-medium">{user.position || "Not specified"}</div>
                    <div className="text-sm text-muted-foreground">{user.experienceLevel || "No experience level"}</div>
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
                    className={verified ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                    {verified ? "Verified" : "Unverified"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge variant="outline" className="capitalize">
                    {role || "player"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const user = row.original
            const navigate = useNavigate()
            const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
            const [showDeleteDialog, setShowDeleteDialog] = useState(false)

            const handleView = () => {
                navigate(`/dashboard/users/${user._id}`)
            }

            const handleEdit = () => {
                navigate(`/dashboard/users/${user._id}?mode=edit`)
            }

            const handleDelete = async () => {
                try {
                    await deleteUser(user._id).unwrap()
                    toast.success("User deleted successfully")
                    setShowDeleteDialog(false)
                } catch (error) {
                    toast.error("Failed to delete user")
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
                        title="Delete User"
                        description={`Are you sure you want to delete ${user.fullname}? This action cannot be undone.`}
                        onConfirm={handleDelete}
                        isLoading={isDeleting}
                    />
                </div>
            )
        },
    },
]

export const sampleData: User[] = [
    {
        _id: "1",
        fullname: "John Doe",
        email: "john@example.com",
        location: "New York",
        age: "25",
        experienceLevel: "Intermediate",
        position: "Point Guard",
        role: "player",
        verified: true,
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: "2",
        fullname: "Jane Smith",
        email: "jane@example.com",
        location: "Los Angeles",
        age: "23",
        experienceLevel: "Beginner",
        position: "Shooting Guard",
        role: "player",
        verified: false,
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: "3",
        fullname: "Mike Johnson",
        email: "mike@example.com",
        location: "Chicago",
        age: "28",
        experienceLevel: "Advanced",
        position: "Center",
        role: "team",
        verified: true,
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]
