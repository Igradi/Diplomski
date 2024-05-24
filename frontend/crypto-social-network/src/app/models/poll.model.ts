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
    topic: {
        _id: string;
        name: string;
        abbreviation: string;
    };
    createdAt: Date;
    updatedAt: Date;
    showQuestions?: boolean;
    showResults?: boolean;
    answeredBy: string[];
}
