import React from 'react';
import { View, Text } from 'react-native';

const Header = ({ title, textDirection, styles }) => {
  return (
      <View className={`items-${textDirection}`}>
        <Text className={`text-xl font-bold ${styles}`}>
          {title}
        </Text>
      </View>
  );
};

export default Header;