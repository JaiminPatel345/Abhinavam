import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Stack, Tabs} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {MD3LightTheme, PaperProvider} from "react-native-paper";
import {Provider} from "react-redux";
import {persistor, store} from "@/redux/store";
import {AlertNotificationRoot} from "react-native-alert-notification";
import GlobalNotificationListener from "@components/alert/GlobalNotificationListener";
import {useFonts} from 'expo-font';
import { PersistGate } from 'redux-persist/integration/react'

// Custom theme configuration
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4C585B',
    secondary: '#A5BFCC',
    background: '#F4EDD3',
    surface: '#FFFFFF',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'SFProText-Regular',
    },
    medium: {
      fontFamily: 'SFProText-Medium',
    },
    bold: {
      fontFamily: 'SFProText-Bold',
    },
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SFProText-Regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    'SFProText-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'SFProText-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Abhinavam-Logo': require('../../assets/fonts/Poppins-SemiBold.ttf'), // Custom font for logo
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <Provider store={store}>
        <PersistGate loading={<>
          <Text>Loading...</Text>
        </>} persistor={persistor}>

          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              <GlobalNotificationListener/>
              <AlertNotificationRoot>
                <Stack
                    screenOptions={{
                      headerStyle: {
                        backgroundColor: '#F4EDD3',
                      },
                      headerShadowVisible: false,
                      headerTintColor: '#4C585B',
                      headerTitleStyle: {
                        fontFamily: 'Abhinavam-Logo',
                        fontSize: 24,
                        fontWeight: '400',
                      },
                      headerTitleAlign: 'center',
                      animation: 'slide_from_right',
                      contentStyle: {
                        backgroundColor: '#F4EDD3',
                      },
                    }}
                >

                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />


                  {/* Auth Stack */}
                  <Stack.Screen
                      name="auth"
                      options={{
                        headerShown: false,
                        title: 'Abhinavam',
                      }}
                  />

                  {/* post Stack */}
                  <Stack.Screen
                      name="posts"
                      options={{
                        headerShown: false,
                        title: 'Abhinavam',
                      }}
                  />

                  <Stack.Screen
                      name="index"
                      options={{
                        title: 'Abhinavam',
                        headerLargeTitle: true,
                        headerLargeTitleStyle: {
                          fontFamily: 'Abhinavam-Logo',
                          fontSize: 34,
                        },
                      }}
                  />
                </Stack>

              </AlertNotificationRoot>
            </PaperProvider>
          </SafeAreaProvider>
        </PersistGate>

      </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EDD3',
  },
});