import Toast from 'react-native-toast-message';

/**
 * Toast 工具类
 * 提供统一的 Toast 消息显示方法
 */
export class ToastUtils {
  /**
   * 显示成功消息
   */
  static success(title: string, message?: string) {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  }

  /**
   * 显示错误消息
   */
  static error(title: string, message?: string) {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  }

  /**
   * 显示警告消息
   */
  static warning(title: string, message?: string) {
    Toast.show({
      type: 'info', // react-native-toast-message 没有 warning 类型，使用 info
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3500,
    });
  }

  /**
   * 显示信息消息
   */
  static info(title: string, message?: string) {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  }

  /**
   * 隐藏当前显示的 Toast
   */
  static hide() {
    Toast.hide();
  }
}

// 导出便捷的方法
export const showToast = {
  success: ToastUtils.success,
  error: ToastUtils.error,
  warning: ToastUtils.warning,
  info: ToastUtils.info,
  hide: ToastUtils.hide,
};
