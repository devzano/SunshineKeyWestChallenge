import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const CustomButton = ({ title, bgHexColor, handlePress, containerStyles, textStyles, isLoading, disabled }) => {
  const isButtonDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        { backgroundColor: bgHexColor },
        isButtonDisabled && { opacity: 0.5 }
      ]}
      className={`rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
      disabled={isButtonDisabled}
    >
      <Text className={`text-black font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default CustomButton;