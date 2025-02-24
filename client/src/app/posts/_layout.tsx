// src/app/posts/_layout.tsx
import { Stack } from "expo-router";

export default function PostLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: '#F4EDD3' },
        headerTintColor: '#4C585B',
        headerTitleStyle: {
          fontFamily: 'Abhinavam-Logo',
          fontSize: 24,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Posts',
        }}
      />
      <Stack.Screen
        name="create/index"
        options={{
          title: 'Create Post',
        }}
      />
    </Stack>
  );
}