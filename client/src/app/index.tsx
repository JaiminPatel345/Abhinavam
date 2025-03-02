import {Redirect} from "expo-router";
import {useUserDataManager} from "@/hooks/useUser";
import {useRedirect} from "@/hooks/userRedirect";

export default function Index() {
  useUserDataManager()
  useRedirect()

  return <Redirect href="/(tabs)" />;
}