export interface Post {
    _id: string;
    content: string;
    user: string;
    topic: string;
    upvotes: number;
    downvotes: number;
    comments: string[];
    createdAt: Date;
    updatedAt: Date;
    upvotedBy?: string[];
    downvotedBy?: string[];
}
