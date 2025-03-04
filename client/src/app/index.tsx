import {useUserDataManager} from "@/hooks/useUser";
import {useRedirect} from "@/hooks/userRedirect";
import '@css/global.css';
import {View} from "react-native";
import Posts from "@/app/posts";
import {useDispatch} from "react-redux";
import {setCurrentRoute} from "@/redux/slice/navigationSlice";
import {useEffect} from "react";
import {useIsFocused} from "@react-navigation/core";


export default function Index() {
  useUserDataManager()
  useRedirect()
  const dispatch = useDispatch()
  const isFocused = useIsFocused();


  useEffect(() => {
    if (isFocused) {
      dispatch(setCurrentRoute('/'))
    }

  }, [isFocused]);

  return (
      <View>
        <Posts/>
      </View>
  )
}