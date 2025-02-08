import {ALERT_TYPE} from "react-native-alert-notification";

export interface INotificationPayload  {
  message: string | null,
  type: ALERT_TYPE,
  title: string
}