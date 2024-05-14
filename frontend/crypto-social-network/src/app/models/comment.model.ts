export interface Comment {
    _id: string;
    content: string;
    user: string;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    updatedAt: Date;
}
