import {Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import '@css/global.css';
import {useUserDataManager} from "@/hooks/useUser";
import {useSelector} from "react-redux";
import {useRedirect} from "@/hooks/userRedirect";
import * as SplashScreen from 'expo-splash-screen';


export default function HomeScreen() {
  SplashScreen.preventAutoHideAsync();
  useUserDataManager()
  const user = useSelector((state: any) => state.user.user)
  useRedirect()
  return (
      <>
        <SafeAreaView style={{paddingLeft: 5}}>
          <Text className={'text-rose-800'}>Hello bhai</Text>
          <Link href="/auth/login" className={'text-blue-600'}>Go to Login </Link>
          <Link href="/auth/signup" className={'text-blue-600'}>Go to signup </Link>
          <Link href="/auth/signup/VerifyOTP" className={'text-blue-600'}>Verify OTP </Link>
          <Link href="/auth/signup/AdditionalDetails" className={'text-blue-600'}>Go to additional details </Link>
          <Link href="/auth/logout" className={'text-blue-600'}>Go to logout </Link>
          <Link href="/posts" className={'text-blue-600'}>Go to all post </Link>
          <Link href="/posts/create" className={'text-blue-600'}>create post </Link>
          <View>
            <Text>User Id</Text>
            <Text>{user?._id}</Text>
          </View>
        </SafeAreaView>
      </>
  )
}

