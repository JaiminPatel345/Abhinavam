import {Dialog} from 'react-native-alert-notification';
import {INotificationPayload} from "@/types/notification.types";

const DialogAlert = ({message, type, title}: INotificationPayload) => {

  if (!title || !type) {
    return null;
  }

  return Dialog.show({
    type,
    title,
    textBody: message || '',
  })
}

export default DialogAlert;