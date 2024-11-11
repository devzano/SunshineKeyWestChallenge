import React from 'react';
import { useTheme } from '../../context/themeContext';
import { Platform, Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Icon } from '@rneui/themed';
import Header from '../Header';

const PhotoModal = ({ visible, onClose, title, photos = [], onImagePress }) => {
  // const { isDarkMode } = useTheme();

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
          <Header title={title} textDirection="center" styles="font-psemibold mb-4 text-[#121212]" />

          <ScrollView
            contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
          >
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <View key={index} className="w-[45%] m-1 aspect-square">
                  <TouchableOpacity className="items-center justify-center" onPress={() => onImagePress(photo)}>
                    <Image
                      source={photo}
                      className="w-full h-full rounded-lg"
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-center mt-2 text-gray-600">
                No photos available.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PhotoModal;