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
  
  status?: string;
  responseCount?: number;
}

/** * 問卷回饋 API 完整回應結構
 */
export interface FeedbackResponse {
  code: number;
  message: string;
  quizId: number;
  feedBackVoList: FeedbackVo[];
}

/** * 單個填寫者的完整回答記錄
 */
export interface FeedbackVo {
  fillinDate: string; // 後端 LocalDate 轉出的格式，如 "2026-04-24"
  user: UserInfo;     // 填寫人基本資訊
  answersVos: AnswerVo[]; // 該次填寫的所有問題答案清單
}

/** * 使用者資訊
 */
export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  age: number;
}

/** * 單個問題的答案詳情
 * 包含你剛剛在後端修正好的 questionTitle 欄位
 */
export interface AnswerVo {
  questionId: number;
  questionTitle: string; // 新增：題目文字
  answerList: string[]; // 答案列表（支援單選與複選）
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
  optionsList?: string[]|null; // 對應後端的 optionsList (原 option)
  answerValue?: string | string[];
}