import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CommentResponse, DocumentResponse } from "@/types";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

interface CommentsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: DocumentResponse;
    comments: CommentResponse[];
    newComment: string;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
}

const CommentsDrawer = ({ 
    open, 
    onOpenChange, 
    post, 
    comments, 
    newComment, 
    onCommentChange, 
    onCommentSubmit 
}: CommentsDrawerProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[400px] flex flex-col bg-white/90 backdrop-blur-sm">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                         bg-clip-text text-transparent text-center">
                        Comments
                    </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    <div className="mb-6">
                        <div className="flex items-start gap-2 mb-4 p-2 rounded-lg bg-gray-50/50">
                            <img 
                                src={post.photoUrl} 
                                className="w-8 h-8 rounded-full border border-gray-200"
                                alt={post.username}
                            />
                            <div className="text-gray-800">
                                <Link to={`profile/${post.userId}`} className="font-semibold mr-2">{post.username}</Link>
                                <span className="text-gray-600">{post.caption}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex items-start gap-2 p-2 hover:bg-gray-50/50 rounded-lg transition-colors">
                                    <img 
                                        src={comment.userPhotoUrl} 
                                        className="w-8 h-8 rounded-full border border-gray-200"
                                        alt={comment.username}
                                    />
                                    <div className="text-gray-800">
                                        <Link to={`profile/${comment.userId}`} className="font-semibold mr-2">{comment.username}</Link>
                                        <span className="text-gray-600">{comment.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-2">
                        <Input
                            value={newComment}
                            onChange={(e) => onCommentChange(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-gray-50/50 border-gray-200 focus-visible:ring-purple-400"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    onCommentSubmit();
                                }
                            }}
                        />
                        <Send 
                            className="cursor-pointer text-gray-600 hover:text-purple-500 transition-colors" 
                            onClick={onCommentSubmit}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CommentsDrawer;
