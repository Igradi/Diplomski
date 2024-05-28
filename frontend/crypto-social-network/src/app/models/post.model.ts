export interface Post {
    _id: string;
    content: string;
    user: { _id: string; username: string };
    topic: string;
    upvotes: number;
    downvotes: number;
    comments: string[];
    createdAt: Date;
    updatedAt: Date;
    upvotedBy?: string[];
    downvotedBy?: string[];
    showOptions?: boolean;
}
