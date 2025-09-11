import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Listing {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: 'player' | 'team';
    avatar?: string;
    experience: string;
    location: string;
  };
  status: 'available' | 'filled';
  expiryDate: string;
  createdAt: string;
  tags: string[];
  requirements?: {
    age?: string;
    experience?: string;
    position?: string;
  };
}

interface ListingCardProps {
  listing: Listing;
  onContact?: (listingId: string) => void;
  onSave?: (listingId: string) => void;
}

export const ListingCard = ({ listing, onContact, onSave }: ListingCardProps) => {
  const navigate = useNavigate()
  const isExpired = new Date(listing.expiryDate) < new Date();
  const timeAgo = new Date(listing.createdAt).toLocaleDateString();

  return (
    <Card className="w-full  shadow-card hover:shadow-elevated transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={listing.author.avatar} alt={listing.author.name} />
              <AvatarFallback className="bg-gradient-accent text-accent-foreground font-semibold">
                {listing.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{listing.author.name}</h3>
                <Badge
                  variant={listing.author.role === 'player' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {listing.author.role === 'player' ? 'Player' : 'Team/Coach'}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-xs text-black mt-1">
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {listing.author.experience}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {listing.author.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <Badge
              variant={listing.status === 'available' ? 'default' : 'secondary'}
              className={listing.status === 'available' ? 'bg-success text-success-foreground' : ''}
            >
              {listing.status === 'available' ? 'Available' : 'Filled'}
            </Badge>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-lg text-foreground mb-2">
              {listing.title}
            </h4>
            <p className="text-black leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Tags */}
          {listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Requirements */}
          {listing.requirements && (
            <div className="bg-secondary/30 rounded-lg p-3 space-y-1">
              <h5 className="text-sm font-medium text-foreground">Requirements:</h5>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {listing.requirements.age && (
                  <span className="flex items-center text-black">
                    <Users className="h-3 w-3 mr-1" />
                    Age: {listing.requirements.age}
                  </span>
                )}
                {listing.requirements.experience && (
                  <span className="flex items-center text-black">
                    <Star className="h-3 w-3 mr-1" />
                    Exp: {listing.requirements.experience}
                  </span>
                )}
                {listing.requirements.position && (
                  <span className="text-black">Position: {listing.requirements.position}</span>
                )}
              </div>
            </div>
          )}

          {/* Expiry Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center text-black">
              <Calendar className="h-3 w-3 mr-1" />
              Expires: {new Date(listing.expiryDate).toLocaleDateString()}
            </span>
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave?.(listing.id)}
              className="text-black hover:text-foreground"
            >
              Save
            </Button>
            <Button
              size="sm"
              onClick={() =>
                navigate('/chat')
              }
              // disabled={listing.status === 'filled' || isExpired}
              className={listing.status === 'available' && !isExpired
                ? 'bg-gradient-redwhiteblued hover:opacity-90 transition-opacity'
                : ''
              }
            >
              {listing.author.role === 'player' ? 'Contact Player' : 'Contact Team'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};