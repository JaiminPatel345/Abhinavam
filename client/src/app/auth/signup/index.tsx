import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Lock, Mail, Shield, User, UserCircle} from 'lucide-react-native';
import {router} from "expo-router";
import {Formik} from 'formik';
import validationSignupSchema from "@/app/auth/signup/validationSignupSchema";
import {
  clearNotification,
  showNotification
} from "@/redux/slice/notificationSlice";
import {useDispatch, useSelector} from "react-redux";
import useAuth from "@/hooks/useAuth";
import {setIsLoading} from "@/redux/slice/userSlice";
import {SignupFormData} from "@/types/user.types";
import {RootState} from "@/types/redux.types";
import {setCurrentRoute} from "@/redux/slice/navigationSlice";


export default function SignupScreen(): any {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState<boolean>(true);

  const initialValues: SignupFormData = {
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
  };

  const dispatch = useDispatch();
  const {registerUser} = useAuth()
  const isLoading: boolean = useSelector((state: RootState) => state.user.isLoading);

  useEffect(() => {
    dispatch(clearNotification());
    dispatch(setCurrentRoute('/auth/signup'));

  }, []);


  const handelSubmit = async (values: SignupFormData) => {
    if (!values.fullName || !values.username || !values.email || !values.password || !values.confirmPassword) {
      // console.log(errors)
      dispatch(showNotification({
        message: "Please fill the form correctly ",
        type: "WARNING",
        title: "Can't Login"
      }));

      return;
    }

    await registerUser({
      name: values.fullName,
      username: values.username,
      email: values.email,
      password: values.password,
    })


  }

  const handleNavigateToLogin = () => {
    router.replace('/auth/login');
  }


  return (
      <SafeAreaView className="flex-1 bg-background ">
        <ScrollView className={'flex-1 mt-32 '}>

          <Formik
              initialValues={initialValues}
              validationSchema={validationSignupSchema}

              onSubmit={async (values, {setSubmitting, validateForm}) => {
                dispatch(setIsLoading(true))

                const errors = await validateForm(values)
                console.log('Error in validation : ', errors)
                if (errors.fullName || errors.username || errors.email || errors.password || errors.confirmPassword) {
                  dispatch(showNotification({
                    message: "Please fill the form correctly 2",
                    type: "WARNING",
                    title: "Can't Login"
                  }));
                  setIsLoading(false)
                  setSubmitting(true)

                  return;
                }
                setIsLoading(true)
                handelSubmit(values)

              }}
          >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched
              }) => (
                <View className="flex-1 px-6 justify-center">
                  {/* Header Section */}
                  <View className="mb-12 items-center">
                    <Text className="font-pbold text-3xl text-primary mb-2">Create
                      Account</Text>
                    <Text className="font-pregular text-text-muted text-center">
                      Join our community today
                    </Text>
                  </View>

                  <View className="space-y-4">
                    {/* Full Name Input */}
                    <View>
                      <TextInput
                          label="Full Name"
                          value={values.fullName}
                          onChangeText={handleChange('fullName')}
                          onBlur={handleBlur('fullName')}
                          left={<TextInput.Icon
                              icon={() => <UserCircle size={20}
                                                      color="#4C585B"/>}/>}
                          mode="outlined"
                          style={{backgroundColor: '#F4EDD3'}}
                          outlineColor="#A5BFCC"
                          activeOutlineColor="#4C585B"
                          autoCapitalize={'words'}
                          error={touched.fullName && Boolean(errors.fullName)}
                          theme={{
                            colors: {
                              text: '#2C3639', placeholder: '#7E99A3',
                            },
                          }}
                      />
                      {touched.fullName && errors.fullName && (
                          <Text
                              className="text-text-error text-sm mt-1 font-pregular">
                            {errors.fullName}
                          </Text>)}
                    </View>

                    {/* Username Input */}
                    <View className={'mt-2'}>
                      <TextInput
                          label="Username"
                          value={values.username}
                          onChangeText={handleChange('username')}
                          onBlur={handleBlur('username')}
                          left={<TextInput.Icon
                              icon={() => <User size={20} color="#4C585B"/>}/>}
                          mode="outlined"
                          style={{backgroundColor: '#F4EDD3'}}
                          outlineColor="#A5BFCC"
                          autoCapitalize={'none'}
                          activeOutlineColor="#4C585B"
                          error={touched.username && Boolean(errors.username)}
                          theme={{
                            colors: {
                              text: '#2C3639', placeholder: '#7E99A3',
                            },
                          }}
                      />
                      {touched.username && errors.username && (
                          <Text
                              className="text-text-error text-sm mt-1 font-pregular">
                            {errors.username}
                          </Text>)}
                    </View>

                    {/* Email Input */}
                    <View className={'mt-2'}>
                      <TextInput
                          label="Email"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          left={<TextInput.Icon
                              icon={() => <Mail size={20} color="#4C585B"/>}/>}
                          mode="outlined"
                          style={{backgroundColor: '#F4EDD3'}}
                          outlineColor="#A5BFCC"
                          activeOutlineColor="#4C585B"
                          autoCapitalize={'none'}
                          error={touched.email && Boolean(errors.email)}
                          theme={{
                            colors: {
                              text: '#2C3639', placeholder: '#7E99A3',
                            },
                          }}
                      />
                      {touched.email && errors.email && (<Text
                          className="text-text-error text-sm mt-1 font-pregular">
                        {errors.email}
                      </Text>)}
                    </View>


                    {/* Password Input */}
                    <View className={'mt-2'}>
                      <TextInput
                          label="Password"
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          secureTextEntry={secureTextEntry}
                          left={<TextInput.Icon icon={() => <Shield size={20}
                                                                    color="#4C585B"/>}/>}
                          right={<TextInput.Icon
                              icon={secureTextEntry ? "eye" : "eye-off"}
                              onPress={() => setSecureTextEntry(!secureTextEntry)}
                          />}
                          mode="outlined"
                          style={{backgroundColor: '#F4EDD3'}}
                          outlineColor="#A5BFCC"
                          activeOutlineColor="#4C585B"
                          error={touched.password && Boolean(errors.password)}
                          theme={{
                            colors: {
                              text: '#2C3639', placeholder: '#7E99A3',
                            },
                          }}
                      />
                      {touched.password && errors.password && (
                          <Text
                              className="text-text-error text-sm mt-1 font-pregular">
                            {errors.password}
                          </Text>)}
                    </View>

                    {/* Confirm Password Input */}
                    <View className={'mt-2'}>
                      <TextInput
                          label="Confirm Password"
                          value={values.confirmPassword}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          secureTextEntry={secureConfirmTextEntry}
                          left={<TextInput.Icon
                              icon={() => <Lock size={20} color="#4C585B"/>}/>}
                          right={<TextInput.Icon
                              icon={secureConfirmTextEntry ? "eye" : "eye-off"}
                              onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                          />}
                          mode="outlined"
                          style={{backgroundColor: '#F4EDD3'}}
                          outlineColor="#A5BFCC"
                          activeOutlineColor="#4C585B"
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          theme={{
                            colors: {
                              text: '#2C3639', placeholder: '#7E99A3',
                            },
                          }}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                          <Text
                              className="text-text-error text-sm mt-1 font-pregular">
                            {errors.confirmPassword}
                          </Text>)}
                    </View>

                    {/* Next Button */}
                    <Button
                        mode="contained"
                        onPress={() => handleSubmit()}
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
                      Send OTP
                    </Button>

                    {/* Login Link */}
                    <View className="flex-row justify-center mt-6">
                      <Text className="text-text-muted font-pregular">
                        Already have an account?{' '}
                      </Text>
                      <TouchableOpacity onPress={handleNavigateToLogin}>
                        <Text
                            className="text-primary underline font-psemibold">
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>)}
          </Formik>
        </ScrollView>

      </SafeAreaView>);
}