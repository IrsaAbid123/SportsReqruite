import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShareCard } from "@/pages/PostCreation/ShareCard";
import { Calendar, MapPin, Clock, Star, Users, Share2, Heart, MessageCircle, Edit, Trash2, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendNotificationMutation } from "@/redux/ApiCalls/notificationApi";
import { useLikePostMutation, useUnlikePostMutation, useDeletePostMutation, useGetPostQuery } from "@/redux/ApiCalls/postApi";
import { useGetUserQuery } from "@/redux/ApiCalls/userApi";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sendNotification, { isLoading: isSendingNotification }] = useSendNotificationMutation()
  const [likePost, { isLoading: isLiking }] = useLikePostMutation()
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation()
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  // Fetch user data when contact dialog is opened
  const { data: contactUserResponse, isLoading: isLoadingUser } = useGetUserQuery(selectedUserId!, {
    skip: !selectedUserId
  });

  // Extract user data from the nested response
  const contactUserData = contactUserResponse?.user;

  // Debug: Log the response to see the data structure
  if (contactUserResponse) {
    console.log('Contact User Response:', contactUserResponse);
    console.log('Contact User Data:', contactUserData);
  }

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

    // Set the user ID to fetch and open contact dialog
    setSelectedUserId(listing.author._id);
    setContactDialogOpen(true);

    // Call the original onContact callback if provided
    onContact?.(listing._id);
  };

  const handleCopyEmail = async () => {
    const emailAddress = contactUserData?.email || 'contact@sportsrecruit.com';
    try {
      await navigator.clipboard.writeText(emailAddress);
      setEmailCopied(true);
      toast.success("Email address copied to clipboard!");
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy email address");
    }
  };

  const handleOpenEmailClient = () => {
    const contactUserName = contactUserData?.fullname || authorName;
    const emailSubject = encodeURIComponent(`Interested in your post: ${listing.title}`);
    const emailBody = encodeURIComponent(`Hi ${contactUserName},\n\nI'm interested in your post: "${listing.title}"\n\nBest regards,\n${user?.fullname}`);
    const emailAddress = contactUserData?.email || 'contact@sportsrecruit.com';
    const mailtoLink = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

    window.open(mailtoLink, '_blank');
    setContactDialogOpen(false);
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

  const handleEditPost = () => {
    // Navigate to create post page with edit mode
    navigate('/create-post', {
      state: {
        editMode: true,
        postId: listing._id,
        postData: listing,
        returnTo: window.location.pathname // Pass current page as return path
      }
    });
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(listing._id).unwrap();
      toast.success("Post deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Delete error:", error);
    }
  };

  // Check if current user is the author of the post
  const isPostAuthor = user?._id === listing.author?._id;

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
            {/* <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{commentsCount}</span>
            </button> */}
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
              {/* Edit and Delete buttons for post author */}
              {isPostAuthor && (
                <>
                  <Button
                    size="sm"
                    onClick={handleEditPost}
                    variant="outline"
                    className="flex items-center justify-center gap-1 w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="destructive"
                    className="flex items-center justify-center gap-1 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}

              <Button
                size="sm"
                onClick={() => setShareOpen(true)}
                variant="outline"
                className="flex items-center justify-center gap-1 w-full sm:w-auto"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {!isPostAuthor && (
                <Button
                  size="sm"
                  onClick={handleContact}
                  className={`w-full sm:w-auto bg-gradient-redwhiteblued hover:opacity-90 transition-opacity`}
                >
                  {authorRole === "player" ? "Contact Player" : "Contact Team"}
                </Button>
              )}
            </div>
          </div>

          <ShareCard open={shareOpen} onOpenChange={setShareOpen} url={shareUrl} />
        </div>
      </CardContent>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl mx-auto max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="truncate">Contact {contactUserData?.role === "player" ? "Player" : "Team"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base break-words leading-snug">
              Get in touch with {contactUserData?.fullname || authorName} regarding their post: "{listing.title}"
            </DialogDescription>
          </DialogHeader>

          {isLoadingUser ? (
            <div className="flex items-center justify-center py-8 min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading user information...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {/* User Details */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg flex-wrap">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={contactUserData?.avatar} alt={contactUserData?.fullname || authorName} />
                  <AvatarFallback className="bg-gradient-accent text-accent-foreground font-semibold text-sm">
                    {(contactUserData?.fullname || authorName).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">
                    {contactUserData?.fullname || authorName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Badge variant={contactUserData?.role === 'player' ? 'secondary' : 'outline'} className="text-xs">
                        {contactUserData?.role === 'player' ? 'Player' : 'Team/Coach'}
                      </Badge>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {contactUserData?.experienceLevel || authorExperience}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{contactUserData?.location || authorLocation}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Information */}
              <div className="space-y-2 sm:space-y-3">
                <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2 text-sm sm:text-base">Contact Information</h5>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    You can reach out to {contactUserData?.fullname || authorName} directly via email to discuss this opportunity further.
                  </p>
                  <div className="p-3 sm:p-4 bg-background border-2 border-primary/30 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                          <p className="font-mono text-sm sm:text-lg font-semibold text-foreground break-all">
                            {contactUserData?.email || 'contact@sportsrecruit.com'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyEmail}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        {emailCopied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
                        <span className="text-xs sm:text-sm">{emailCopied ? "Copied!" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setContactDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};