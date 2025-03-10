import {FlatList, Text, View} from 'react-native'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/types/redux.types";
import {useCallback, useEffect} from "react";
import usePost from "@/hooks/usePost";
import {clearAllPosts, updateToNextPage} from "@/redux/slice/postSlice";
import {ItemSeparator, MemoizedSinglePost} from "@/components/PostsHelpers";
import {IPost} from "@/types/posts.types";

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
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch(clearAllPosts());
    fetchPosts({page: 1, limit});
  }, [dispatch, fetchPosts, limit]);

  const fetchNewPosts = useCallback(() => {
    dispatch(updateToNextPage());
  }, [dispatch]);

  // Memoize the keyExtractor function
  const keyExtractor = useCallback((item: IPost) => item._id, []);

  if (posts === null) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading...</Text>
        </View>
    )
  }
  const postsArray: IPost[] = Object.values(posts);

  return (
      <View className={'bg-background-light'}>
        <FlatList data={postsArray}
                  renderItem={({item}) => <MemoizedSinglePost post={item}/>}
                  keyExtractor={keyExtractor}
                  refreshing={isLoading}
                  onRefresh={handleRefresh}
                  onEndReachedThreshold={0.5}
                  onEndReached={fetchNewPosts}
                  removeClippedSubviews={true}
                  windowSize={12}
                  maxToRenderPerBatch={5}
                  initialNumToRender={10}
                  ItemSeparatorComponent={ItemSeparator}

        />
      </View>
  )
}

