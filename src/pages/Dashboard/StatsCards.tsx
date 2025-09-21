import { Card, CardContent } from "@/components/ui/card"
import { Users, Package, UserCheck, TrendingUp } from "lucide-react"
import { useGetUsersQuery } from "@/redux/ApiCalls/userApi"
import { useGetPostsQuery } from "@/redux/ApiCalls/postApi"

export function StatsCards() {
    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery()
    const { data: postsData, isLoading: postsLoading } = useGetPostsQuery()

    // Extract data from API responses
    const users = usersData?.users || []
    const posts = postsData?.posts || []

    // Calculate dynamic stats
    const totalPlayers = users.filter((user: any) => user.role === 'player').length
    const verifiedTeams = users.filter((user: any) => user.role === 'team' && user.verified).length
    const activePosts = posts.filter((post: any) => post.status === 'available').length
    const totalPosts = posts.length

    // Calculate success rate (percentage of filled posts)
    const filledPosts = posts.filter((post: any) => post.status === 'filled').length
    const successRate = totalPosts > 0 ? Math.round((filledPosts / totalPosts) * 100) : 0

    const stats = [
        {
            title: "Total Players",
            value: usersLoading ? "..." : totalPlayers.toLocaleString(),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            description: "Registered athletes"
        },
        {
            title: "Active Posts",
            value: postsLoading ? "..." : activePosts.toLocaleString(),
            icon: Package,
            color: "text-green-600",
            bgColor: "bg-green-100",
            description: "Available opportunities"
        },
        {
            title: "Verified Teams",
            value: usersLoading ? "..." : verifiedTeams.toLocaleString(),
            icon: UserCheck,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            description: "Verified organizations"
        },
        {
            title: "Success Rate",
            value: postsLoading ? "..." : `${successRate}%`,
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            description: "Successful matches"
        },
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm font-medium">{stat.title}</p>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
