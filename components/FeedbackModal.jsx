import React, { useState } from 'react';
import { useTheme } from '../context/themeContext';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import Header from './Header';

const FeedbackModal = ({ visible, onClose, onSubmit }) => {
  // const { isDarkMode } = useTheme();

  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleStarPress = (star) => {
    setRating(star);
  };

  const resetFields = () => {
    setRating(0);
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleSubmit = () => {
    onSubmit({ rating, name, email, message });
    resetFields();
    onClose();
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-4">
        <View className="bg-[#f2f2f2] rounded-lg p-6 w-full">
        <Header title={"Feedback"} textDirection={"center"} styles={"font-psemibold text-[#80b733]"} />

          <View className="flex-row justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Icon
                  name="star"
                  type="material"
                  size={32}
                  color={star <= rating ? "#facc15" : "#e0e0e0"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            className="border font-pregular rounded-md p-2 mb-2"
            placeholderTextColor="#9e9e9e"
            style={{ color: '#000' }}
          />

          <TextInput
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="border font-pregular rounded-md p-2 mb-2"
            placeholderTextColor="#9e9e9e"
            style={{ color: '#000' }}
          />

          <TextInput
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            className="border font-pregular rounded-md p-2 mb-4 h-24 text-start"
            placeholderTextColor="#9e9e9e"
            multiline
            style={{ color: '#000' }}
          />

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleCancel}
              className="bg-red-500 rounded-md px-4 py-2"
            >
              <Text className="text-white font-pregular text-center">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-green-500 rounded-md px-4 py-2"
            >
              <Text className="text-white font-pregular text-center">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;