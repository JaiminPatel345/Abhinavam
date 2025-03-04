import {MyButton} from "@/components/ui/Button";
import {View} from "react-native";
import useAuth from "@/hooks/useAuth";

const Logout = () => {


  const {logoutUser} = useAuth();


  const handleLogout = () => {
    console.log("Logout");
    logoutUser();
  }

  return (
      <>
        <View>
          <MyButton title={'Logout'} onPressAction={() => handleLogout()}/>
        </View>
      </>
  )
}

export default Logout;