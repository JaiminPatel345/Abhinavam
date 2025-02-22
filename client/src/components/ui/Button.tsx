import React from "react";
import {Button} from "react-native-paper";
import {MyButtonProps} from "@/types/ui.types";


export const MyButton: React.FC<MyButtonProps> =
    ({
       title,
       onPressAction = () => null,
       mode = "contained", // Default mode
       paddingVertical = 8, // Default vertical padding
       backgroundColor = "#4C585B", // Default background color
       borderRadius = 8, // Default border radius
       marginTop = 24, // Default margin top
       fontFamily = "Poppins-SemiBold", // Default font family
       fontSize = 16, // Default font size
       fontColor = "#F4EDD3", // Default font color
       isLoading = false

     }) => {
      return (
          <Button
              mode={mode} // Use provided or default mode
              onPress={onPressAction}
              contentStyle={{
                paddingVertical: paddingVertical, // Use provided or default padding
              }}
              style={{
                backgroundColor: backgroundColor, // Use provided or default background color
                borderRadius: borderRadius, // Use provided or default border radius
                marginTop: marginTop, // Use provided or default margin top
              }}
              labelStyle={{
                fontFamily: fontFamily, // Use provided or default font family
                fontSize: fontSize, // Use provided or default font size
                color: fontColor, // Use provided or default font color
              }}
              loading={isLoading || false}
          >
            {title} {/* Use the title prop instead of hardcoding */}
          </Button>
      );
    };