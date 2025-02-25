import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ToastAlert from './ToastAlert';
import {clearNotification} from "@redux/slice/notificationSlice";

const GlobalNotificationListener = () => {
  const {message, type, title} = useSelector((state: any) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (title && type) {
      ToastAlert({message, type, title});

      //for multiple press
      timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);

      // Clean up the timer when the component unmounts or when a new notification comes in
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, type, title, dispatch]);

  return null; // This component doesn't render anything
};

export default GlobalNotificationListener;