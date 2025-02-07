import {StyleSheet, Text} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import '@css/global.css';

export default function HomeScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{paddingLeft: 5}}>
                <Text className={'text-rose-800'}>Hello</Text>
                <Link href="/details" className={'text-blue-600'}>Go to </Link>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}

const styles = StyleSheet.create({});
