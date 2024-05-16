export interface Poll {
    _id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    totalVotes: number;
    correctVotes: number;
    topic: string;
    answeredBy: string[];
    createdAt: Date;
    updatedAt: Date;
}
