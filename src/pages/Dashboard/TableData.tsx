"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

export const columns: ColumnDef<User>[] = [
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
            return (
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    Edit
                </Button>
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
