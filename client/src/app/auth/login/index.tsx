import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useSelector} from "react-redux";
import {Formik} from "formik";
import validationLoginSchema from "@/app/auth/login/validationLoginSchema";
import useAuth from "@/hooks/useAuth";


export default function LoginScreen() {

  const user = useSelector((state: any) => state.userReducer.user);
  const isLoading = useSelector((state: any) => state.userReducer.isLoading);
  const error = useSelector((state: any) => state.userReducer.error);
  const {loginUser} = useAuth();

  const handleLogin = (values: any) => {
    console.log('Formik values:', values);
    loginUser(values);
  }


  return (
      <SafeAreaView>
        <View>
          <Text>Login</Text>
          <Formik
              initialValues={{email: '', password: ''}}
              validationSchema={validationLoginSchema}
              onSubmit={values => {
                console.log('Formik values:', values);
              }}
          >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <View>
                  <TextInput
                      label="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={touched.email && Boolean(errors.email)}
                      style={{marginBottom: 10}}
                  />
                  {touched.email && errors.email && (
                      <Text style={{color: 'red', marginBottom: 10}}>{errors.email}</Text>
                  )}
                  <TextInput
                      label="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={touched.password && Boolean(errors.password)}
                      style={{marginBottom: 10}}

                  />
                  {touched.password && errors.password && (
                      <Text style={{color: 'red', marginBottom: 10}}>{errors.password}</Text>
                  )}
                  <Button onPress={() => handleLogin(values)}>Login</Button>
                </View>
            )}
          </Formik>
          <View>
            <Text>User: {user ? user.email : 'No user'}</Text>
            <Text>{isLoading ? 'USer found' : 'Loading'}</Text>
            <Text>{error}</Text>
          </View>
        </View>
      </SafeAreaView>
  )
}
