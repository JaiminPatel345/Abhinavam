import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Lock, Mail, User} from 'lucide-react-native';
import {Link, useRouter} from "expo-router";

export default function SignupScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const Router = useRouter()

  return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-6 justify-center">
          {/* Header Section */}
          <View className="mb-12 items-center">
            <Text className="font-pbold text-3xl text-primary mb-2">Create Account</Text>
            <Text className="font-pregular text-text-muted text-center">
              Join our community today
            </Text>
          </View>

          <View className="space-y-4">
            {/* Name Input */}
            <TextInput
                label="Full Name"
                left={<TextInput.Icon icon={() => <User size={20} color="#4C585B"/>}/>}
                mode="outlined"
                style={{backgroundColor: '#F4EDD3'}}
                outlineColor="#A5BFCC"
                activeOutlineColor="#4C585B"
            />

            {/* Username Input */}
            <TextInput
                label="Username"
                left={<TextInput.Icon icon={() => <User size={20} color="#4C585B"/>}/>}
                mode="outlined"
                style={{backgroundColor: '#F4EDD3'}}
                outlineColor="#A5BFCC"
                activeOutlineColor="#4C585B"
            />

            {/* Email Input */}
            <TextInput
                label="Email"
                left={<TextInput.Icon icon={() => <Mail size={20} color="#4C585B"/>}/>}
                mode="outlined"
                style={{backgroundColor: '#F4EDD3'}}
                outlineColor="#A5BFCC"
                activeOutlineColor="#4C585B"
            />

            {/* Password Input */}
            <TextInput
                label="Password"
                secureTextEntry={secureTextEntry}
                left={<TextInput.Icon icon={() => <Lock size={20} color="#4C585B"/>}/>}
                right={
                  <TextInput.Icon
                      icon={secureTextEntry ? "eye" : "eye-off"}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
                mode="outlined"
                style={{backgroundColor: '#F4EDD3'}}
                outlineColor="#A5BFCC"
                activeOutlineColor="#4C585B"
            />

            {/* Confirm Password Input */}
            <TextInput
                label="Confirm Password"
                secureTextEntry={secureConfirmTextEntry}
                left={<TextInput.Icon icon={() => <Lock size={20} color="#4C585B"/>}/>}
                right={
                  <TextInput.Icon
                      icon={secureConfirmTextEntry ? "eye" : "eye-off"}
                      onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                  />
                }
                mode="outlined"
                style={{backgroundColor: '#F4EDD3'}}
                outlineColor="#A5BFCC"
                activeOutlineColor="#4C585B"
            />

            {/* Next Button */}

              <Button
                  mode="contained"
                  onPress={() => Router.push('/auth/signup/VerifyOTP')}
                  contentStyle={{paddingVertical: 8}}
                  style={{
                    backgroundColor: '#4C585B',
                    borderRadius: 8,
                    marginTop: 24
                  }}
                  labelStyle={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: '#F4EDD3'
                  }}
              >
                Next
              </Button>


            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-text-muted font-pregular">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity>
                <Link href={'/auth/login'} className="text-primary font-psemibold">
                  Sign In
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
  );
}