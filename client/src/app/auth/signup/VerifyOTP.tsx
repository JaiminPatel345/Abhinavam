import React, {useEffect, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  Text,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  View
} from 'react-native';
import {Button} from 'react-native-paper';
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {clearNotification, showNotification} from "@redux/slice/notificationSlice";
import {RootState} from "@/types/redux.types";
import useAuth from "@/hooks/useAuth";
import {setIsLoading} from "@redux/slice/userSlice";
import {IUser} from "@/types/user.types";

export default function VerifyOTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const user:IUser|null = useSelector((state: RootState) => state.user.user);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const {verifyOtp} = useAuth();

  const redirectUrl = useSelector((state: any) => state.user.redirectUrl);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(redirectUrl)
  }, [redirectUrl])

  // Handle OTP input changes
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < 5) {
      // Move to the next input if a value is entered
      inputRefs.current[index + 1]?.focus();
    }

    setOtp(newOtp);
  };

  // Handle backspace
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    console.log("came")
    if (e.nativeEvent.key === 'Backspace') {
      if (index > 0 && !otp[index]) {
        // If the current input is empty, move focus to the previous input
        inputRefs.current[index - 1]?.focus();
        setOtp((prev) => {
          let newOtp = [...prev];
          newOtp[index - 1] = '';
          return newOtp;
        })
      } else {
        // Clear the current input and keep focus on the same input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = (givenOtp: string) => {
    console.log("OTP Submitted ", givenOtp)
    if (!givenOtp || givenOtp.length !== 6) {
      dispatch(clearNotification())
      dispatch(
          showNotification({
            type: 'DANGER',
            title: 'Invalid OTP',
            message: 'Please enter a valid OTP',
          })
      )
      return;
    }
    if (!user?.email) {
      dispatch(
          showNotification({
            type: 'DANGER',
            title: 'Something goes wrong',
            message: 'try to register again',
          })
      )
      return;
    }

    dispatch(setIsLoading(true))
    verifyOtp({otp: givenOtp, email: user.email});

  }


  return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-6 justify-center">
          <View className="mb-12 items-center">
            <Text className="font-pbold text-3xl text-primary mb-2">Verify OTP</Text>
            <Text className="font-pregular text-text-muted text-center">
              Enter the OTP sent to your email
            </Text>
          </View>
          <View>
            <View className="flex-row justify-between mb-8">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                  <RNTextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      className="w-12 h-12 border-2 rounded-lg text-center text-xl font-pbold"
                      maxLength={1}
                      keyboardType="number-pad"
                      value={otp[index]}
                      onKeyPress={(e) =>{
                        console.log("key pressed")
                          handleKeyPress(e, index)
                      }}
                      onChangeText={(value) => handleOtpChange(value, index)}

                      style={{
                        backgroundColor: '#F4EDD3',
                        borderColor: otp[index] ? '#4C585B' : '#A5BFCC',
                      }}
                  />
              ))}
            </View>
            <Button
                mode="contained"
                onPress={() => {
                  handleSubmit(otp.join(''));
                }}
                loading={isLoading}
                contentStyle={{paddingVertical: 8}}
                style={{
                  backgroundColor: '#4C585B',
                  borderRadius: 8,
                  marginTop: 24,
                }}
                labelStyle={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  color: '#F4EDD3',
                }}
            >
              Verify
            </Button>
          </View>
        </View>
      </SafeAreaView>
  );
}