import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {MD3LightTheme, PaperProvider} from "react-native-paper";
import {Provider} from "react-redux";
import {persistor, store} from "@/redux/store";
import {AlertNotificationRoot} from "react-native-alert-notification";
import GlobalNotificationListener
  from "@/components/alert/GlobalNotificationListener";
import {PersistGate} from 'redux-persist/integration/react'
import TabBar from "@/components/TabBar";

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
                      // Default header style for all screens
                      headerStyle: {
                        backgroundColor: '#F4EDD3',
                      },
                      headerTintColor: '#000000',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                      },
                      // This ensures routes don't show as titles
                      headerTitle: 'Abhinavam',
                    }}

                >


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
                <TabBar/>

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