import Posts from "@/app/posts";
import {View} from "react-native";
import '@css/global.css';
import {useUserDataManager} from "@/hooks/useUser";
import {useRedirect} from "@/hooks/userRedirect";

export default function Index() {
  useUserDataManager()
  useRedirect()

  return (
      <View>
        <Posts/>
      </View>
  )
}