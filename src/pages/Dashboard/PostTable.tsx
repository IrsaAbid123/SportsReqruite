
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGetPostsQuery, useDeletePostMutation } from "@/redux/ApiCalls/postApi"
import { ReusableDataTable } from "./ReuseableDataTable"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { toast } from "sonner"

export type Post = {
    _id: string
    title: string
    description: string
    author: {
        _id: string
        fullname: string
        email: string
        avatar?: string
    }
    status: "available" | "filled"
    expiryDate: Date
    createdAt: Date
    updatedAt: Date
    tags: string[]
    requirements?: {
        fromAge?: string
        toAge?: string
        experience?: string
        position?: string
    }
}

// Define columns for posts
export const createPostColumns = (): ColumnDef<Post>[] => [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const post = row.original
            return (
                <div className="max-w-[300px]">
                    <div className="font-medium truncate">{post.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{post.description}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => {
            const author = row.getValue("author") as Post['author']
            return (
                <div>
                    <div className="font-medium">{author?.fullname || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{author?.email}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={status === "available" ? "default" : "secondary"}
                    className={status === "available" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                    {status === "available" ? "Available" : "Filled"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "requirements.position",
        header: "Position",
        cell: ({ row }) => {
            const post = row.original
            return (
                <div>
                    <div className="font-medium">{post.requirements?.position || "Any"}</div>
                    <div className="text-sm text-muted-foreground">
                        {post.requirements?.experience || "No experience required"}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "expiryDate",
        header: "Expiry Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("expiryDate"))
            const isExpired = date < new Date()
            return (
                <div className={isExpired ? "text-red-600" : ""}>
                    {date.toLocaleDateString()}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const post = row.original
            const navigate = useNavigate()
            const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()
            const [showDeleteDialog, setShowDeleteDialog] = useState(false)

            const handleView = () => {
                navigate(`/dashboard/posts/${post._id}`)
            }

            const handleEdit = () => {
                navigate(`/dashboard/posts/${post._id}?mode=edit`)
            }

            const handleDelete = async () => {
                try {
                    await deletePost(post._id).unwrap()
                    toast.success("Post deleted successfully")
                    setShowDeleteDialog(false)
                } catch (error) {
                    toast.error("Failed to delete post")
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
                        title="Delete Post"
                        description={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
                        onConfirm={handleDelete}
                        isLoading={isDeleting}
                    />
                </div>
            )
        },
    },
]

export function PostTable() {
    const { data, isLoading, isError } = useGetPostsQuery()

    if (isLoading) return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                <p className="text-muted-foreground">
                    Manage recruitment opportunities and job postings
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
                <p>Loading posts...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                <p className="text-muted-foreground">
                    Manage recruitment opportunities and job postings
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
                <p>Failed to load posts</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                <p className="text-muted-foreground">
                    Manage recruitment opportunities and job postings
                </p>
            </div>
            <div className="rounded-lg border bg-card">
                <ReusableDataTable
                    columns={createPostColumns()}
                    data={data?.posts || []}
                    searchKey="title"
                    searchPlaceholder="Search posts..."
                />
            </div>
        </div>
    )
}
