import {FlatList, Text, View} from 'react-native'
import SinglePost from "@/app/posts/SinglePost";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import {useEffect} from "react";
import usePost from "@/hooks/usePost";
import {clearAllPosts, updateToNextPage} from "@redux/slice/postSlice";

export default function Posts() {

  const {
    posts,
    isLoading,
    page,
    limit
  } = useSelector((state: RootState) => state.posts);

  const dispatch = useDispatch();

  const {fetchPosts} = usePost();

  useEffect(() => {
    fetchPosts({page, limit});
  }, [page, limit, dispatch]);

  const handleRefresh = () => {

    dispatch(clearAllPosts());
    fetchPosts({page: 1, limit});

  }

  const fetchNewPosts = () => {
    dispatch(updateToNextPage());
  }
  console.log(posts)

  if (posts === null) {
    return <>
      <Text>Loading...</Text>
    </>
  }

  return (
      <>
        <View className={'bg-background-light'}>
          <FlatList data={Object.values(posts)}
                    renderItem={({item}) => <SinglePost post={item}/>}
                    keyExtractor={(item) => item._id}
                    refreshing={isLoading}
                    onRefresh={() => handleRefresh()}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => fetchNewPosts()}
          />
        </View>
      </>
  )
}

