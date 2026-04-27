import Swal from 'sweetalert2';

export class SwalService {
  public static success(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
    });
  }
  public static error(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
    });
  }
  public static warning(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
    });
  }
  public static info(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
    });
  }
  public static questionMark(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
    });
  }
}
