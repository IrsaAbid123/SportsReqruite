import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Star, Users, Heart, MessageCircle, Send, ArrowLeft, Trash2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Listing } from "@/components/ListingCard";
import { useLikePostMutation, useUnlikePostMutation, useAddCommentMutation, useDeleteCommentMutation } from "@/redux/ApiCalls/postApi";


export const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [newComment, setNewComment] = useState("");

    // Get post data from navigation state
    const post = location.state?.post;

    // Local state for optimistic updates
    const [localComments, setLocalComments] = useState(post?.comments || []);
    const [localLikesCount, setLocalLikesCount] = useState(post?.totalLikes || 0);
    const [localIsLiked, setLocalIsLiked] = useState(
        user && post ? post.likes?.some((like: any) => like.userId === user._id) || false : false
    );

    // API calls for mutations only
    const [likePost, { isLoading: isLiking }] = useLikePostMutation();
    const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation();
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
    const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();

    // Debug logging
    console.log('PostDetail - ID from URL:', id);
    console.log('PostDetail - Post data from state:', post);
    console.log('PostDetail - Location state:', location.state);

    // If no post data and we have an ID, we could fetch it or redirect
    useEffect(() => {
        if (!post && id) {
            // If someone navigates directly to the URL, redirect to home
            console.log('No post data found, redirecting to home');
            navigate('/', { replace: true });
        }
    }, [post, id, navigate]);

    // Use local state for optimistic updates
    const tags = post?.tags || [];

    const handleLike = async () => {
        if (!user || !post) {
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
                await unlikePost({ postId: post._id, userId: user._id }).unwrap();
                toast.success("Post unliked");
            } else {
                await likePost({ postId: post._id, userId: user._id }).unwrap();
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

    const handleCommentSubmit = async () => {
        if (!user || !post) {
            toast.error("Please log in to comment");
            navigate("/signin");
            return;
        }

        if (!newComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        // Create optimistic comment
        const optimisticComment = {
            _id: `temp-${Date.now()}`, // Temporary ID
            userId: user._id,
            userFullname: user.fullname,
            commentText: newComment,
            createdAt: new Date().toISOString()
        };

        // Optimistic update - add comment immediately
        setLocalComments(prev => [optimisticComment, ...prev]);
        const commentText = newComment;
        setNewComment(""); // Clear input immediately

        try {
            await addComment({
                postId: post._id,
                userId: user._id,
                commentText: commentText
            }).unwrap();
            toast.success("Comment added successfully");
        } catch (error) {
            // Revert optimistic update on error
            setLocalComments(prev => prev.filter(comment => comment._id !== optimisticComment._id));
            setNewComment(commentText); // Restore the comment text
            toast.error("Failed to add comment");
            console.error("Comment error:", error);
        }
    };

    // If no post data is available, redirect back
    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg mb-4">No post data available</p>
                    <p className="text-xs text-muted-foreground mb-2">Please go back and try again</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    const authorName = post?.author?.fullname || 'Unknown User';
    const authorRole = post?.author?.role || 'player';
    const authorExperience = post?.author?.experienceLevel || 'Unknown';
    const authorLocation = post?.author?.location || 'Unknown Location';
    const timeAgo = post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date';
    const isExpired = post?.expiryDate ? new Date(post.expiryDate) < new Date() : false;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Post Content - Left Side */}
                    <div className="space-y-6">
                        <Card className="shadow-card">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <Avatar
                                            className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                                            onClick={() => post?.author?._id && navigate(`/profile/${post.author._id}`)}
                                        >
                                            <AvatarImage src={post?.author?.avatar} alt={authorName} />
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
                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
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
                                            variant={post?.status === 'available' ? 'default' : 'secondary'}
                                            className={post?.status === 'available' ? 'bg-success text-success-foreground' : ''}
                                        >
                                            {post?.status === 'available' ? 'Available' : 'Filled'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{timeAgo}</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="space-y-4">
                                    <div>
                                        <h1 className="font-bold text-2xl text-foreground mb-3">
                                            {post?.title || 'Untitled Post'}
                                        </h1>
                                        <p className="text-foreground leading-relaxed text-lg">
                                            {post?.description || 'No description available'}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-sm bg-secondary/50 hover:bg-secondary transition-colors"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* Requirements */}
                                    {post?.requirements && (
                                        <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                                            <h5 className="text-base font-medium text-foreground">Requirements:</h5>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                {(post.requirements.fromAge || post.requirements.toAge) && (
                                                    <span className="flex items-center text-foreground">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Age: {post.requirements.fromAge}{post.requirements.toAge ? ` - ${post.requirements.toAge}` : '+'}
                                                    </span>
                                                )}
                                                {post.requirements.experience && (
                                                    <span className="flex items-center text-foreground">
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Experience: {post.requirements.experience}
                                                    </span>
                                                )}
                                                {post.requirements.position && (
                                                    <span className="text-foreground">Position: {post.requirements.position}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expiry Info */}
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Expires: {post?.expiryDate ? new Date(post.expiryDate).toLocaleDateString() : 'No expiry date'}
                                        </span>
                                        {isExpired && (
                                            <Badge variant="destructive" className="text-sm">
                                                Expired
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Like and Comment Count */}
                                    <div className="flex items-center space-x-6 pt-2 border-t">
                                        <button
                                            onClick={handleLike}
                                            disabled={isLiking || isUnliking}
                                            className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${localIsLiked ? 'fill-red-500 text-red-500' : ''}`}
                                            />
                                            <span className="text-base font-medium">{localLikesCount}</span>
                                        </button>
                                        <div className="flex items-center space-x-2 text-muted-foreground">
                                            <MessageCircle className="h-5 w-5" />
                                            <span className="text-base font-medium">{localComments.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comments Section - Right Side */}
                    <div className="space-y-4">
                        <Card className="shadow-card">
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-foreground">Comments</h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Comment Input */}
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleCommentSubmit}
                                        size="sm"
                                        disabled={isAddingComment || !newComment.trim()}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Comments List - Scrollable */}
                                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                                    {localComments.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">
                                            No comments yet. Be the first to comment!
                                        </p>
                                    ) : (
                                        localComments.map((comment) => (
                                            <div key={comment._id} className="relative p-3 bg-secondary/20 rounded-lg">
                                                {/* Delete button in top right corner */}
                                                {user && user._id === comment.userId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to delete this comment?")) {
                                                                // Optimistic update - remove comment immediately
                                                                const originalComments = [...localComments];
                                                                setLocalComments(prev => prev.filter(c => c._id !== comment._id));

                                                                try {
                                                                    await deleteComment({
                                                                        postId: post._id,
                                                                        commentId: comment._id,
                                                                        userId: user._id
                                                                    }).unwrap();
                                                                    toast.success("Comment deleted");
                                                                } catch (error) {
                                                                    // Revert optimistic update on error
                                                                    setLocalComments(originalComments);
                                                                    toast.error("Failed to delete comment");
                                                                }
                                                            }
                                                        }}
                                                        className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}

                                                <div className="flex space-x-3 pr-8">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">
                                                            {comment.userFullname.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-sm text-foreground">
                                                                {comment.userFullname}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground">{comment.commentText}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
