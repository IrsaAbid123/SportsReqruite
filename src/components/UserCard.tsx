import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface User {
    _id: string;
    fullname: string;
    location: string;
    age?: string;
    experienceLevel: string;
    position?: string;
    role: 'player' | 'team' | 'admin';
    verified: boolean;
    status: string;
}

interface UserCardProps {
    user: User;
    onUserClick: (user: User) => void;
}

export const UserCard = ({ user, onUserClick }: UserCardProps) => {
    const handleClick = () => {
        onUserClick(user);
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'team':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-3 w-3" />;
            case 'team':
                return <User className="h-3 w-3" />;
            default:
                return <User className="h-3 w-3" />;
        }
    };

    return (
        <Card
            className="w-full shadow-card hover:shadow-elevated transition-all duration-300 border-border/50 cursor-pointer"
            onClick={handleClick}
        >
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{user.fullname}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className="text-xs flex items-center gap-1"
                        >
                            {getRoleIcon(user.role)}
                            {user.role === 'player' ? 'Player' : user.role === 'team' ? 'Team/Coach' : 'Admin'}
                        </Badge>
                        <Badge
                            variant={user.status === 'available' ? 'default' : 'destructive'}
                            className={`text-xs ${user.status === 'available'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                                }`}
                        >
                            {user.status === 'available' ? 'Available' : 'Filled'}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

