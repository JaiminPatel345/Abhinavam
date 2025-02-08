import React from 'react';
import {StyleSheet} from 'react-native';
import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {PaperProvider} from "react-native-paper";
import {Provider} from "react-redux";
import {store} from "@/redux/store";
import {AlertNotificationRoot} from "react-native-alert-notification";
import GlobalNotificationListener from "@components/alert/GlobalNotificationListener";

export default function RootLayout() {
  return (
      <Provider store={store}>
        <SafeAreaProvider>
          <PaperProvider>
            <GlobalNotificationListener/>
            <AlertNotificationRoot>
              <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}>
                <Stack.Screen name="index"/>
                {/*<Stack.Screen name="details"/>*/}
              </Stack>
            </AlertNotificationRoot>
          </PaperProvider>
        </SafeAreaProvider>
      </Provider>
  )
      ;

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
