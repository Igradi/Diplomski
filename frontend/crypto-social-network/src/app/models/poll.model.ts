export interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    totalVotes: number;
    correctVotes: number;
}

export interface Poll {
    _id: string;
    title: string;
    questions: Question[];
    topic: string;
    createdAt: Date;
    updatedAt: Date;
    showQuestions?: boolean;
    showResults?: boolean;
    answeredBy: string[];
}
