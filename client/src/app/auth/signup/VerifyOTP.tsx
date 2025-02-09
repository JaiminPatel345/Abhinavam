import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import {useRouter} from "expo-router";


export default function VerifyOTPScreen() {
  const Router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="mb-12 items-center">
          <Text className="font-pbold text-3xl text-primary mb-2">Verify OTP</Text>
          <Text className="font-pregular text-text-muted text-center">
            Enter the OTP sent to your email
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            label="OTP"
            mode="outlined"
            keyboardType="number-pad"
            style={{ backgroundColor: '#F4EDD3' }}
            outlineColor="#A5BFCC"
            activeOutlineColor="#4C585B"
          />

          <Button
            mode="contained"
            onPress={() => Router.push('/auth/signup/AdditionalDetails')}
            contentStyle={{ paddingVertical: 8 }}
            style={{
              backgroundColor: '#4C585B',
              borderRadius: 8,
              marginTop: 24
            }}
            labelStyle={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 16,
              color: '#F4EDD3'
            }}
          >
            Verify
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}