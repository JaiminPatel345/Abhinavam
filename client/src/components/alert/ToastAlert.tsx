import {Toast} from 'react-native-alert-notification';
import {INotificationPayload} from "@/types/notification.types";

const ToastAlert = ({message, type, title}: INotificationPayload) => {

  if (!title || !type) {
    return null;
  }

  return Toast.show({
    type,
    title,
    textBody: message || '',
  })
}


export default ToastAlert;