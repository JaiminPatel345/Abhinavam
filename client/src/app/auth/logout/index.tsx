import {MyButton} from "@components/ui/Button";
import {View} from "react-native";
import {useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import {useRouter} from "expo-router";
import useAuth from "@/hooks/useAuth";

const Logout = () => {

  const router = useRouter()
  const redirectUrl = useSelector((state: any) => state.user.redirectUrl);
  const isFirstRender = useRef(true);
  const {logoutUser} = useAuth();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(redirectUrl)
  }, [redirectUrl])

  const handleLogout = () => {
    console.log("Logout");
    logoutUser();
  }

  return (
      <>
        <View>
          <MyButton title={'Logout'} onPressAction={handleLogout()}/>
        </View>
      </>
  )
}

export default Logout;