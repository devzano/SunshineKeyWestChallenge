import React from 'react';
import { useTheme } from '../context/themeContext';
import { Platform, Modal, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Icon } from '@rneui/themed';
import Header from './Header';

const TextModal = ({ visible, onClose, title, details, buttonText, onButtonPress }) => {
  // const { isDarkMode } = useTheme();

  const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b/;
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/;

  const renderDetailsWithLinks = (text) => {
    if (!text) {
      return null;
    }

    const parts = text.split(new RegExp(`(${phoneRegex.source}|${emailRegex.source})`));

    return parts.map((part, index) => {
      if (phoneRegex.test(part)) {
        return (
          <Text
            key={index}
            className="text-[#80b733] underline"
            onPress={() => Linking.openURL(`tel:${part}`)}
          >
            {part}
          </Text>
        );
      } else if (emailRegex.test(part)) {
        return (
          <Text
            key={index}
            className="text-[#0084b2] underline"
            onPress={() => Linking.openURL(`mailto:${part}`)}
          >
            {part}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <TouchableOpacity
          onPress={onClose}
          className={`absolute ${Platform.OS === 'ios' ? 'top-11' : 'top-8'} right-5 p-2 rounded-xl bg-[#4b9995]`}
        >
          <Icon name="cancel" size={24} color="#fff" />
        </TouchableOpacity>

        <View className="w-[95%] max-h-[80%] p-5 rounded-lg items-center bg-[#f2f2f2]">
          <ScrollView className="w-full" contentContainerStyle={{ alignItems: 'center' }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <Header title={title} textDirection={"center"} styles="font-psemibold mb-4 text-[#121212]" />
            <Text className="text-base mb-5 text-center font-pregular text-[#121212]">
              {renderDetailsWithLinks(details)}
            </Text>

            {buttonText && onButtonPress && (
              <TouchableOpacity
                onPress={onButtonPress}
                className="mt-4 bg-[#4b9995] rounded-lg px-6 py-2"
              >
                <Text className="text-white text-center font-semibold">{buttonText}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TextModal;