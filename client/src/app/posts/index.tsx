import {FlatList, View} from 'react-native'
import data from "@/utils/posts/dummyPostData";
import SinglePost from "@/app/posts/SinglePost";

export default function Posts() {
  return (
      <>
        <View className={'bg-background-light'}>
          <FlatList data={data}
                    renderItem={({item}) => <SinglePost post={item}/>}
                    keyExtractor={(item) => item._id}
          />
        </View>
      </>
  )
}

