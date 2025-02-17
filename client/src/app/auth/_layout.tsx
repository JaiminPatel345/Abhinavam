import {Stack} from "expo-router";
import {Provider} from "react-redux";
import {registerStore} from "@redux/otherStores/registerStore";

export default function AuthLayout() {
  return (
      <Provider store={registerStore}>
        <Stack
            initialRouteName="login/index"
            screenOptions={{
              headerStyle: {backgroundColor: '#F4EDD3'},
              headerTintColor: '#4C585B',
              headerTitleStyle: {
                fontFamily: 'Abhinavam-Logo',
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
      </Provider>

  );
}