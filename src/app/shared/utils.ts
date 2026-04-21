import Swal from 'sweetalert2';
import { UpdateQuestionRequest } from '../@interfaces/question';

export class Utils {
  /**
   * 靜態方法：驗證問卷與題目資料完整性
   * @param data 包含 quiz 與 questionVoList 的物件
   */
  public static validateData(data: any): boolean {
    const quiz = data.quiz;
    const questions = data.questionVoList as UpdateQuestionRequest[];

    // --- 1. 檢查問卷基本資訊 ---
    if (!quiz.title || quiz.title.trim() === '') {
      this.showError('請輸入問卷標題');
      return false;
    }

    // 檢查日期是否存在後再比較
    if (!quiz.startDate || !quiz.endDate) {
      this.showError('請選擇開始與結束日期');
      return false;
    }

    if (new Date(quiz.startDate) > new Date(quiz.endDate)) {
      this.showError('開始日期不能晚於結束日期');
      return false;
    }

    // --- 2. 檢查題目 ---
    if (!questions || questions.length === 0) {
      this.showError('問卷至少需要包含一個問題');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qNum = i + 1;
      // 檢查選擇題（非文字題）是否有選項
      if (q.type !== 'TEXT') {
        if (!q.optionsList || q.optionsList.length === 0) {
          this.showError(`第 ${qNum} 題為選擇題，至少需要一個選項`);
          return false;
        }

        const hasEmptyOption = q.optionsList.some(
          (opt) => !opt || opt.trim() === '',
        );
        if (hasEmptyOption) {
          this.showError(`第 ${qNum} 題存在空白的選項內容`);
          return false;
        }
      }
      // 檢查題目文字
      if (!q.question || q.question.trim() === '') {
        this.showError(`第 ${qNum} 題的題目內容尚未填寫`);
        return false;
      }
    }

    return true; // 通過所有檢查
  }

  /**
   * 靜態私有方法：統一顯示錯誤訊息
   */
  private static showError(msg: string) {
    Swal.fire({
      title: '資料驗證失敗',
      text: msg,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
    });
  }

  public static formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
