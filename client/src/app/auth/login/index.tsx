import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";
import validationLoginSchema from "@/app/auth/login/validationLoginSchema";
import useAuth from "@/hooks/useAuth";
import {Lock, Mail} from 'lucide-react-native';
import {Link, useRouter} from "expo-router";
import {showNotification} from "@redux/slice/notificationSlice";

export default function LoginScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const isLoading = useSelector((state: any) => state.user.isLoading);
  const {loginUser} = useAuth();
  const dispatch = useDispatch();
  const Router = useRouter()

  const handleLogin = (values: any, errors: any) => {
    if (errors.email || errors.password || !values.email || !values.password) {
      console.log(errors)
      dispatch(showNotification({message: "Please fill the form correctly", type: "WARNING", title: "Can't Login"}));
      return;
    }
    loginUser(values);
  }

  return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-6 justify-center">
          {/* Header Section */}
          <View className="mb-12 items-center">
            <Text className="font-pbold text-4xl text-primary mb-2">Welcome Back</Text>
            <Text className="font-pregular text-text-muted text-center">
              Please sign in to continue
            </Text>
          </View>

          {/* Login Form */}
          <Formik
              initialValues={{email: '', password: ''}}
              validationSchema={validationLoginSchema}
              onSubmit={values => {
                Router.navigate('/')
              }}
          >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <View className="space-y-4">
                  {/* Email Input */}
                  <View>
                    <TextInput
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        error={touched.email && Boolean(errors.email)}
                        left={<TextInput.Icon icon={() => <Mail size={20} color="#4C585B"/>}/>}
                        mode="outlined"
                        style={{backgroundColor: '#F4EDD3'}}
                        outlineColor="#A5BFCC"
                        activeOutlineColor="#4C585B"
                        theme={{
                          colors: {
                            text: '#2C3639',
                            placeholder: '#7E99A3',
                          },
                        }}
                    />
                    {touched.email && errors.email && (
                        <Text className="text-text-error text-sm mt-1 font-pregular">
                          {errors.email}
                        </Text>
                    )}
                  </View>

                  {/* Password Input */}
                  <View>
                    <TextInput
                        label="Password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry={secureTextEntry}
                        error={touched.password && Boolean(errors.password)}
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
                        theme={{
                          colors: {
                            text: '#2C3639',
                            placeholder: '#7E99A3',
                          },
                        }}
                    />
                    {touched.password && errors.password && (
                        <Text className="text-text-error text-sm mt-1 font-pregular">
                          {errors.password}
                        </Text>
                    )}
                  </View>

                  {/* Forgot Password Link */}
                  <TouchableOpacity className="self-end">
                    <Text className="text-primary font-pmedium">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <Button
                      mode="contained"
                      onPress={() => handleLogin(values, errors)}
                      loading={isLoading}
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
                    Sign In
                  </Button>

                  {/* Sign Up Link */}
                  <View className="flex-row justify-center mt-6">
                    <Text className="text-text-muted font-pregular">
                      Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity>
                      <Link href={'/auth/signup'} className="text-primary font-psemibold">
                        Sign Up
                      </Link>
                    </TouchableOpacity>
                  </View>
                </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
  );
}