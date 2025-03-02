import {TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default  function CreatePostButton() {
  const router = useRouter();

  return (
    <View className={'relative -top-6 '}>
      <TouchableOpacity
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => router.push('/posts/create')}
    >
      <Ionicons name="add-circle" className={'px-2 pt-2 bg-white rounded-full z-50'} size={46} color="#4C585B" />
    </TouchableOpacity>
    </View>
  );
}
