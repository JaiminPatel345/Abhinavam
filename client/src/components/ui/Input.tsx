import React, { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

type InputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  value: string;
  icon?: React.ComponentType<{ size?: number; stroke?: string; strokeWidth?: number }>;
};

export const Input: React.FC<InputProps> = ({
  placeholder,
  secureTextEntry = false,
  onChangeText,
  value,
  icon: Icon
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`
        flex-row items-center 
        bg-background-DEFAULT 
        border rounded-lg 
        px-3 py-2 mb-3
        ${isFocused 
          ? 'border-primary-light' 
          : 'border-secondary-dark'
        }
      `}
    >
      {Icon && (
        <View className="mr-2">
          <Icon size={20} stroke="#7E99A3" strokeWidth={2} />
        </View>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#7E99A3"
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 text-text-DEFAULT font-pregular"
      />
    </View>
  );
};