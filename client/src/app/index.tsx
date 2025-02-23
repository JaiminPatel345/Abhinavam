import {Text, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import '@css/global.css';
import {useUserDataManager} from "@/hooks/useUser";
import {useSelector} from "react-redux";

export default function HomeScreen() {
  useUserDataManager()
  const user = useSelector((state: any) => state.user.user)
  return (
      <>
        <SafeAreaView style={{paddingLeft: 5}}>
          <Text className={'text-rose-800'}>Hello bhai</Text>
          <Link href="/auth/login" className={'text-blue-600'}>Go to Login </Link>
          <Link href="/auth/signup" className={'text-blue-600'}>Go to signup </Link>
          <Link href="/auth/signup/VerifyOTP" className={'text-blue-600'}>Verify OTP </Link>
          <Link href="/auth/signup/AdditionalDetails" className={'text-blue-600'}>Go to additional details </Link>
          <Link href="/auth/logout" className={'text-blue-600'}>Go to logout </Link>
          <View>
            <Text>User Id</Text>
            <Text>{user?._id}</Text>
          </View>
        </SafeAreaView>
      </>

  )
}

