import {StyleSheet, Text} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import '@css/global.css';

export default function HomeScreen() {
    return (
        <>
            <SafeAreaView style={{paddingLeft: 5}}>
                <Text className={'text-rose-800'}>Hello</Text>
                <Link href="/auth/login" className={'text-blue-600'}>Go to Login </Link>
                <Link href="/auth/signup" className={'text-blue-600'}>Go to signup </Link>
            </SafeAreaView>
        </>

    )
}

const styles = StyleSheet.create({});
