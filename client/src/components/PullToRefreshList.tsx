import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface PullToRefreshListProps<T> extends Omit<FlatListProps<T>, 'refreshControl'> {
  onRefresh: () => void;
  isRefreshing: boolean;
  isLoading?: boolean;
  emptyText?: string;
}

const PullToRefreshList = <T extends any>({
                                            onRefresh,
                                            isRefreshing,
                                            isLoading,
                                            emptyText = "No data available",
                                            ListEmptyComponent,
                                            ...flatListProps
                                          }: PullToRefreshListProps<T>) => {

  // If loading state is passed and it's true, show a loading indicator
  if (isLoading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff"/>
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
    );
  }

  return (
      <FlatList
          {...flatListProps}
          refreshControl={
            <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#0000ff', '#689F38']}
                tintColor="#0000ff"
            />
          }
          ListEmptyComponent={
              ListEmptyComponent || (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{emptyText}</Text>
                  </View>
              )
          }
      />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PullToRefreshList;