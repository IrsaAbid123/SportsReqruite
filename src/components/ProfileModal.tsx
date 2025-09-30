import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Star, Shield, User, Calendar, MessageCircle } from "lucide-react";
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

interface ProfileModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
    const navigate = useNavigate();

    if (!user) return null;

    const handleContact = () => {
        navigate("/chat");
        onClose();
    };

    const handleViewProfile = () => {
        navigate(`/profile/${user._id}`);
        onClose();
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
                return <Shield className="h-4 w-4" />;
            case 'team':
                return <User className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">User Profile</DialogTitle>
                </DialogHeader>

                <Card className="border-0 shadow-none">
                    <CardHeader className="text-center pb-4">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="" alt={user.fullname} />
                                <AvatarFallback className="bg-gradient-accent text-accent-foreground font-semibold text-xl">
                                    {user.fullname.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">{user.fullname}</h3>

                                <div className="flex items-center justify-center space-x-2">
                                    <Badge
                                        variant={getRoleBadgeVariant(user.role)}
                                        className="flex items-center gap-1"
                                    >
                                        {getRoleIcon(user.role)}
                                        {user.role === 'player' ? 'Player' : user.role === 'team' ? 'Team/Coach' : 'Admin'}
                                    </Badge>

                                    <Badge
                                        variant={user.status === 'available' ? 'default' : 'destructive'}
                                        className={`${user.status === 'available'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            }`}
                                    >
                                        {user.status === 'available' ? 'Available' : 'Filled'}
                                    </Badge>

                                    {user.verified && (
                                        <Badge variant="default" className="bg-blue-500 text-white">
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <span className="font-medium">Experience:</span> {user.experienceLevel}
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <span className="font-medium">Location:</span> {user.location}
                                </span>
                            </div>

                            {user.age && (
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        <span className="font-medium">Age:</span> {user.age}
                                    </span>
                                </div>
                            )}

                            {user.position && (
                                <div className="space-y-2">
                                    <span className="text-sm font-medium">Position:</span>
                                    <p className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">
                                        {user.position}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2 pt-4">
                            <Button
                                onClick={handleContact}
                                className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact User
                            </Button>

                            <Button
                                onClick={handleViewProfile}
                                variant="outline"
                                className="w-full"
                            >
                                View Full Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};
