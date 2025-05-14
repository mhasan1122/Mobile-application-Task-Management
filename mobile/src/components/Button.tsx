import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  const buttonStyles = {
    primary: {
      backgroundColor: disabled ? '#B3D7FF' : '#007AFF',
      borderColor: disabled ? '#B3D7FF' : '#007AFF',
    },
    secondary: {
      backgroundColor: disabled ? '#E5E5EA' : '#F2F2F7',
      borderColor: disabled ? '#E5E5EA' : '#F2F2F7',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: disabled ? '#B3D7FF' : '#007AFF',
    },
    text: {
      backgroundColor: 'transparent',
    },
  };

  const textStyles = {
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: disabled ? '#8E8E93' : '#000000',
    },
    outline: {
      color: disabled ? '#B3D7FF' : '#007AFF',
    },
    text: {
      color: disabled ? '#8E8E93' : '#000000',
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        buttonStyles[variant],
        style,
      ]}
    >
      <Text style={[styles.text, textStyles[variant], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;