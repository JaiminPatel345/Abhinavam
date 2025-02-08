import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary'
}) => {
  return (
    <TouchableOpacity
      className={`
        ${variant === 'primary' 
          ? 'bg-button-primary' 
          : 'bg-button-secondary'
        } 
        px-4 py-3 rounded-lg items-center
      `}
      onPress={onPress}
    >
      <Text
        className={`
          ${variant === 'primary' 
            ? 'text-text-light' 
            : 'text-text-DEFAULT'
          } 
          font-psemibold text-base
        `}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};