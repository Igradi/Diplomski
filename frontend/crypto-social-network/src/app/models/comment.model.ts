import { User } from "./user.model";

export interface Comment {
    _id: string;
    content: string;
    user: User;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    updatedAt: Date;
}
