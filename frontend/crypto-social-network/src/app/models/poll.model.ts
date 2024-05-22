export interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    totalVotes: number;
    correctVotes: number;
    answeredBy: string[];
}

export interface Poll {
    _id: string;
    title: string;
    questions: Question[];
    topic: string;
    createdAt: Date;
    updatedAt: Date;
}
