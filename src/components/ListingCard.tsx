import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShareCard } from "@/pages/PostCreation/ShareCard";
import { Calendar, MapPin, Clock, Star, Users, Share2, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendNotificationMutation } from "@/redux/ApiCalls/notificationApi";
import { useLikePostMutation, useUnlikePostMutation } from "@/redux/ApiCalls/postApi";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export interface Listing {
  _id: string;
  title: string;
  description: string;
  author: {
    _id: string;
    fullname: string;
    role: 'player' | 'team';
    avatar?: string;
    experienceLevel: string;
    location: string;
    email?: string;
  } | null;
  status: 'available' | 'filled';
  expiryDate: string;
  createdAt: string;
  tags: string[];
  requirements?: {
    fromAge?: string;
    toAge?: string;
    experience?: string;
    position?: string;
  };
  // Backend schema fields
  likes?: Array<{
    userId: string;
    userFullname: string;
  }>;
  totalLikes?: number;
  comments?: Array<{
    _id: string;
    userId: string;
    userFullname: string;
    commentText: string;
    createdAt: string;
  }>;
  totalComments?: number;
}

interface ListingCardProps {
  listing: Listing;
  onContact?: (listingId: string) => void;
  onSave?: (listingId: string) => void;
}

export const ListingCard = ({ listing, onContact, onSave }: ListingCardProps) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [shareOpen, setShareOpen] = useState(false);
  const [sendNotification, { isLoading: isSendingNotification }] = useSendNotificationMutation()
  const [likePost, { isLoading: isLiking }] = useLikePostMutation()
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation()

  // Local state for optimistic updates
  const [localIsLiked, setLocalIsLiked] = useState(
    user ? listing.likes?.some((like: any) => like.userId === user._id) || false : false
  );
  const [localLikesCount, setLocalLikesCount] = useState(listing.totalLikes || 0);

  const commentsCount = listing.totalComments || 0;

  const shareUrl = `${window.location.origin}/listing/${listing._id}`;
  const isExpired = new Date(listing.expiryDate) < new Date();
  const timeAgo = new Date(listing.createdAt).toLocaleDateString();

  // Handle null author case
  const authorName = listing.author?.fullname || 'Unknown User';
  const authorRole = listing.author?.role || 'player';
  const authorExperience = listing.author?.experienceLevel || 'Unknown';
  const authorLocation = listing.author?.location || 'Unknown Location';

  const handleContact = () => {
    if (!user) {
      toast.error("Please log in to contact users");
      navigate("/auth");
      return;
    }

    if (!listing.author?._id) {
      toast.error("Unable to contact this user");
      return;
    }

    if (user._id === listing.author._id) {
      toast.error("You cannot contact yourself");
      return;
    }

    // Store contact info in localStorage for when user returns
    const contactInfo = {
      targetUserId: listing.author._id,
      targetUserName: authorName,
      postTitle: listing.title,
      contactTime: new Date().toISOString()
    };

    localStorage.setItem('pendingContact', JSON.stringify(contactInfo));

    // Navigate to email with the user's email
    const emailSubject = encodeURIComponent(`Interested in your post: ${listing.title}`);
    const emailBody = encodeURIComponent(`Hi ${authorName},\n\nI'm interested in your post: "${listing.title}"\n\nBest regards,\n${user.fullname}`);

    // Try to get email from listing author, fallback to a generic message
    const emailAddress = listing.author.email || 'contact@sportsrecruit.com';
    const mailtoLink = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

    // Open email client
    window.open(mailtoLink, '_blank');

    // Call the original onContact callback if provided
    onContact?.(listing._id);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like posts");
      navigate("/signin");
      return;
    }

    // Optimistic update
    const wasLiked = localIsLiked;
    setLocalIsLiked(!wasLiked);
    setLocalLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await unlikePost({ postId: listing._id, userId: user._id }).unwrap();
        toast.success("Post unliked");
      } else {
        await likePost({ postId: listing._id, userId: user._id }).unwrap();
        toast.success("Post liked");
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsLiked(wasLiked);
      setLocalLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      toast.error("Failed to update like status");
      console.error("Like error:", error);
    }
  };

  const handleCommentClick = () => {
    // Pass the post data as state when navigating
    navigate(`/listing/${listing._id}`, {
      state: { post: listing }
    });
  };

  return (
    <Card className="w-full  shadow-card hover:shadow-elevated transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar
              className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-200"
              onClick={() => navigate(`/profile/${listing.author?._id}`)}
            >
              <AvatarImage src={listing.author?.avatar} alt={authorName} />
              <AvatarFallback className="bg-gradient-accent text-accent-foreground font-semibold">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{authorName}</h3>
                <Badge
                  variant={authorRole === 'player' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {authorRole === 'player' ? 'Player' : 'Team/Coach'}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-xs text-black mt-1">
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {authorExperience}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {authorLocation}
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
                {(listing.requirements.fromAge || listing.requirements.toAge) && (
                  <span className="flex items-center text-black">
                    <Users className="h-3 w-3 mr-1" />
                    Age: {listing.requirements.fromAge}{listing.requirements.toAge ? ` - ${listing.requirements.toAge}` : '+'}
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

          {/* Like and Comment Icons */}
          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={handleLike}
              disabled={isLiking || isUnliking}
              className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Heart
                className={`h-4 w-4 ${localIsLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-sm">{localLikesCount}</span>
            </button>
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{commentsCount}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave?.(listing._id)}
              className="text-black hover:text-foreground w-full sm:w-auto"
            >
              Save
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                onClick={() => setShareOpen(true)}
                variant="outline"
                className="flex items-center justify-center gap-1 w-full sm:w-auto"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={handleContact}
                className={`w-full sm:w-auto bg-gradient-redwhiteblued hover:opacity-90 transition-opacity`}
              >
                {authorRole === "player" ? "Contact Player" : "Contact Team"}
              </Button>
            </div>
          </div>

          <ShareCard open={shareOpen} onOpenChange={setShareOpen} url={shareUrl} />
        </div>
      </CardContent>
    </Card>
  );
};