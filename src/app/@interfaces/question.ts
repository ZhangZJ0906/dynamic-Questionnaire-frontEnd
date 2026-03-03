export interface Question {
  createdAt?: string;
  updatedAt?: string;
  label: string;
  value: string | string[];
  option?: string[];
  questionType: 'text'|'radio'|'checkbox';
  required: boolean;
}


