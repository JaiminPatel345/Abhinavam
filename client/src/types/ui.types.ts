export type MyButtonProps = {
  title: string; // Required prop for the button text
  onPressAction: any; // Required prop for the onPress action
  mode?: "text" | "outlined" | "contained"; // Optional prop for button mode
  paddingVertical?: number; // Optional prop for vertical padding
  backgroundColor?: string; // Optional prop for background color
  borderRadius?: number; // Optional prop for border radius
  marginTop?: number; // Optional prop for margin top
  fontFamily?: string; // Optional prop for font family
  fontSize?: number; // Optional prop for font size
  fontColor?: string; // Optional prop for font color
  isLoading?:boolean
};