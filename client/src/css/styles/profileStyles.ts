// styles/profileStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  userInfo: {
    flex: 1
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  username: {
    color: 'gray'
  },
  followButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 20
  },
  unFollowButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#d43333',
    borderRadius: 20
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  unFollowButtonText: {
    color: 'black',
    fontWeight: 'bold'
  }
});