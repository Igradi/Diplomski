export interface Comment {
    _id: string;
    content: string;
    user: { _id: string; username: string };
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    updatedAt: Date;
    showOptions?: boolean;
}
