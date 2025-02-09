import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Lock, Mail, Phone, Shield, User, UserCircle} from 'lucide-react-native';
import {Link, useRouter} from "expo-router";
import {MyButton} from "@components/ui/Button";
import * as yup from 'yup';
import {Formik} from 'formik';
import CountryPicker from 'react-native-country-picker-modal';
import type {Country, CountryCode} from 'react-native-country-picker-modal';
import { LogBox } from 'react-native';
import {validationSignupSchema} from "@/app/auth/signup/validationSignupSchema";

LogBox.ignoreLogs(['Support for defaultProps']);

interface FormValues {
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}



export default function SignupScreen(): JSX.Element {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState<boolean>(true);
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const Router = useRouter();

  const initialValues: FormValues = {
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  };

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setShowCountryPicker(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSignupSchema}
        onSubmit={(values) => {
          console.log(values);
          Router.push('/auth/signup/VerifyOTP');
        }}
      >
        {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
          <View className="flex-1 px-6 justify-center">
            {/* Header Section */}
            <View className="mb-12 items-center">
              <Text className="font-pbold text-3xl text-primary mb-2">Create Account</Text>
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
                  left={<TextInput.Icon icon={() => <UserCircle size={20} color="#4C585B"/>}/>}
                  mode="outlined"
                  style={{backgroundColor: '#F4EDD3'}}
                  outlineColor="#A5BFCC"
                  activeOutlineColor="#4C585B"
                  error={touched.fullName && Boolean(errors.fullName)}
                  theme={{
                    colors: {
                      text: '#2C3639',
                      placeholder: '#7E99A3',
                    },
                  }}
                />
                {touched.fullName && errors.fullName && (
                  <Text className="text-text-error text-sm mt-1 font-pregular">
                    {errors.fullName}
                  </Text>
                )}
              </View>

              {/* Username Input */}
              <View className={'mt-2'}>
                <TextInput
                  label="Username"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  left={<TextInput.Icon icon={() => <User size={20} color="#4C585B"/>}/>}
                  mode="outlined"
                  style={{backgroundColor: '#F4EDD3'}}
                  outlineColor="#A5BFCC"
                  activeOutlineColor="#4C585B"
                  error={touched.username && Boolean(errors.username)}
                  theme={{
                    colors: {
                      text: '#2C3639',
                      placeholder: '#7E99A3',
                    },
                  }}
                />
                {touched.username && errors.username && (
                  <Text className="text-text-error text-sm mt-1 font-pregular">
                    {errors.username}
                  </Text>
                )}
              </View>

              {/* Email Input */}
              <View className={'mt-2'}>
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  left={<TextInput.Icon icon={() => <Mail size={20} color="#4C585B"/>}/>}
                  mode="outlined"
                  style={{backgroundColor: '#F4EDD3'}}
                  outlineColor="#A5BFCC"
                  activeOutlineColor="#4C585B"
                  error={touched.email && Boolean(errors.email)}
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

              {/* Mobile Input with Country Code */}
              <View>
                <View className="flex-row mt-2 justify-center items-end gap-2">
                  <TouchableOpacity
                    onPress={() => setShowCountryPicker(true)}
                    className="w-24 h-14  bg-[#F4EDD3] rounded-lg border border-[#A5BFCC] justify-center items-center flex-row space-x-1"
                  >
                    <CountryPicker
                      visible={showCountryPicker}

                      withCountryNameButton={false}
                      countryCode={countryCode}
                      onSelect={onSelectCountry}
                      onClose={() => setShowCountryPicker(false)}
                      containerButtonStyle={{
                        alignItems: 'center',
                        padding: 8,
                      }}
                      theme={{
                        backgroundColor: '#F4EDD3',
                        primaryColor: '#4C585B',
                        primaryColorVariant: '#A5BFCC',
                        fontSize: 16,
                      }}
                    />
                    <Text className="text-[#4C585B] text-base">+{callingCode}</Text>
                  </TouchableOpacity>

                  <View className="flex-1">
                    <TextInput
                      label="Mobile Number"
                      value={values.mobile}
                      onChangeText={handleChange('mobile')}
                      onBlur={handleBlur('mobile')}
                      left={<TextInput.Icon icon={() => <Phone size={20} color="#4C585B"/>}/>}
                      mode="outlined"
                      style={{backgroundColor: '#F4EDD3'}}
                      outlineColor="#A5BFCC"
                      activeOutlineColor="#4C585B"
                      error={touched.mobile && Boolean(errors.mobile)}
                      keyboardType="phone-pad"
                      theme={{
                        colors: {
                          text: '#2C3639',
                          placeholder: '#7E99A3',
                        },
                      }}
                    />
                  </View>
                </View>
                {touched.mobile && errors.mobile && (
                  <Text className="text-text-error text-sm mt-1 font-pregular">
                    {errors.mobile}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View className={'mt-2'}>
                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={secureTextEntry}
                  left={<TextInput.Icon icon={() => <Shield size={20} color="#4C585B"/>}/>}
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
                  error={touched.password && Boolean(errors.password)}
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

              {/* Confirm Password Input */}
              <View className={'mt-2'}>
                <TextInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
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
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  theme={{
                    colors: {
                      text: '#2C3639',
                      placeholder: '#7E99A3',
                    },
                  }}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text className="text-text-error text-sm mt-1 font-pregular">
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              {/* Next Button */}
              <View className="mt-6">
                <MyButton title={'Next'} onPressAction={handleSubmit}/>
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-text-muted font-pregular">
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity>
                  <Link href={'/auth/login'} className="text-primary underline font-psemibold">
                    Sign In
                  </Link>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}