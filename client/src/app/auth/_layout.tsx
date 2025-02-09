import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="login/index"
      screenOptions={{
        headerStyle: { backgroundColor: '#F4EDD3' },
        headerTintColor: '#4C585B',
        headerTitleStyle: {
          fontFamily: 'KalaVithi-Logo',
          fontSize: 24,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="login/index"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="signup/index"
        options={{
          title: 'Sign Up',
        }}
      />
      <Stack.Screen
        name="signup/VerifyOTP"
        options={{
          title: 'Verify OTP',
        }}
      />
      <Stack.Screen
        name="signup/AdditionalDetails"
        options={{
          title: 'Additional Details',
        }}
      />
    </Stack>
  );
}