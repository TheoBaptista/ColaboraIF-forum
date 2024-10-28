export interface Question {
  title: string;
  content: string;
  topic: string;
  category: string;
  user_id: string;
  username: string;
}

export interface QuestionResponse {
  id: string;
  title: string;
  content: string;
  topic: string;
  user_id: string;
  username: string;
  category: string;
  answers: Answer[];
}

export interface Answer {
  id?: string; 
  content: string;
  is_correct_answer: boolean;
  user_id: string;
  username: string;
}
