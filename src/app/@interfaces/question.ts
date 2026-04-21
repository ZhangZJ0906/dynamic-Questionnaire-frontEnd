export interface Question {
  questionId?: number; // 題號，建議保留以利排序
  question: string; // 對應後端的 question (原 label)
  type: 'TEXT' | 'SINGLE' | 'MUTI'; // 對應後端的 type (原 questionType)
  required: boolean; // 是否必填
  optionsList?: string[]; // 對應後端的 optionsList (原 option)
  answerValue?: string | string[];
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  published: boolean;
  // 以下為前端表格顯示需要的擴充欄位，設為選填
  questionCount?: number;
  status?: string;
  responseCount?: number;
}

export interface QuizRequest {
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  published: boolean;
}

export interface UpdateQuizRequest {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  published: boolean;
}

export interface UpdateQuestionRequest {
  quizId: number;
  questionId: number; // 題號，建議保留以利排序
  question: string; // 對應後端的 question (原 label)
  type: 'TEXT' | 'SINGLE' | 'MUTI'; // 對應後端的 type (原 questionType)
  required: boolean; // 是否必填
  optionsList?: string[]; // 對應後端的 optionsList (原 option)
  answerValue?: string | string[];
}