import React from 'react';
import { useTheme } from '../../context/themeContext';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Icon } from '@rneui/themed';

const FullSizeImageModal = ({ visible, onClose, image }) => {
  // const { isDarkMode } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/80">
        <Image
          source={image}
          className="w-[90%] h-[90%] rounded-lg"
          contentFit="contain"
        />

        <TouchableOpacity
          onPress={onClose}
          className="absolute top-12 right-5 p-2 rounded-xl bg-[#4b9995] items-center justify-center"
        >
          <Icon name="cancel" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FullSizeImageModal;