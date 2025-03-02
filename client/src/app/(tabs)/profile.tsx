import { View, Text, StyleSheet } from 'react-native';
import {useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";

export default function ProfileScreen() {
  const user = useSelector((state:RootState) => state.user.user)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen of {user?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});