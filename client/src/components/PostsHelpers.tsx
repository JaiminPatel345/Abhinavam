import {memo} from "react";
import {View} from "react-native";
import SinglePost from "@/app/posts/SinglePost";


export const ItemSeparator = memo(() => (
  <View style={{ height: 10 }} />
));

export const MemoizedSinglePost = memo(SinglePost);
