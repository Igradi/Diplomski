export interface Notification {
    _id: string;
    user: { _id: string; username: string };
    fromUser: { _id: string; username: string };
    type: string;
    message: string;
    postId?: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
