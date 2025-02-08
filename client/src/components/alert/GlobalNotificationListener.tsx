import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ToastAlert from './ToastAlert';
import {clearNotification} from "@redux/slice/notificationSlice";

const GlobalNotificationListener = () => {
  const {message, type, title} = useSelector((state: any) => state.notification);
  const dispatch = useDispatch();
  useEffect(() => {
    if (title && type) {
      ToastAlert({message, type, title});

      //for multiple press
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
  }, [message, type, title]);

  return null; // This component doesn't render anything
};

export default GlobalNotificationListener;