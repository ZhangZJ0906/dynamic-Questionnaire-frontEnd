export interface Question {
  label: string;
  value: string | string[];
  option?: string[];
  questionType: 'text'|'radio'|'checkbox';
  required: boolean;
}

export interface Quiz {
  startDate?: string;
  endDate?: string;
  title: string;
  description?: string;
}

export interface QuizRequest {
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  published: boolean;
}
