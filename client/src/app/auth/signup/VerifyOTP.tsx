import React, { useState, useRef } from 'react';
import { SafeAreaView, Text, View, TextInput as RNTextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from "expo-router";

export default function VerifyOTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

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
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
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
              console.log('OTP:', otp.join(''));
              router.push('/auth/signup/AdditionalDetails')
            }}
            contentStyle={{ paddingVertical: 8 }}
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