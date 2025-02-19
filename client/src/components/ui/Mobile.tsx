// import {Text, TouchableOpacity, View} from "react-native";
// import CountryPicker from "react-native-country-picker-modal";
// import {TextInput} from "react-native-paper";
// import {Phone} from "lucide-react-native";
// import React from "react";
//
// export const Mobile = () => {
//   return (
//       <>
//         {/* Mobile Input with Country Code */}
//         <View>
//           <View className="flex-row mt-2 justify-center items-end gap-2">
//             <TouchableOpacity
//                 onPress={() => setShowCountryPicker(true)}
//                 className="w-24 h-14  bg-[#F4EDD3] rounded-lg border border-[#A5BFCC] justify-center items-center flex-row space-x-1"
//             >
//               <CountryPicker
//                   visible={showCountryPicker}
//                   withFilter={true}
//                   withFlag={true}
//                   withCallingCode={true}
//
//                   withCountryNameButton={false}
//                   countryCode={countryCode}
//                   onSelect={onSelectCountry}
//                   onClose={() => setShowCountryPicker(false)}
//                   containerButtonStyle={{
//                     alignItems: 'center', padding: 8,
//                   }}
//                   theme={{
//                     backgroundColor: '#F4EDD3',
//                     primaryColor: '#4C585B',
//                     primaryColorVariant: '#A5BFCC',
//                     fontSize: 16,
//                   }}
//               />
//               <Text className="text-[#4C585B] text-base">+{callingCode}</Text>
//             </TouchableOpacity>
//
//             <View className="flex-1">
//               <TextInput
//                   label="Mobile Number"
//                   value={values.mobile}
//                   onChangeText={handleChange('mobile')}
//                   onBlur={handleBlur('mobile')}
//                   left={<TextInput.Icon icon={() => <Phone size={20} color="#4C585B"/>}/>}
//                   mode="outlined"
//                   style={{backgroundColor: '#F4EDD3'}}
//                   outlineColor="#A5BFCC"
//                   activeOutlineColor="#4C585B"
//                   error={touched.mobile && Boolean(errors.mobile)}
//                   keyboardType="phone-pad"
//                   theme={{
//                     colors: {
//                       text: '#2C3639', placeholder: '#7E99A3',
//                     },
//                   }}
//               />
//             </View>
//           </View>
//           {touched.mobile && errors.mobile && (<Text className="text-text-error text-sm mt-1 font-pregular">
//             {errors.mobile}
//           </Text>)}
//         </View>
//       </>
//   )
// }