import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/themeContext';
import { useRouter } from 'expo-router';
import { Text, ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import CachedImage from 'expo-cached-image';
import { Icon } from '@rneui/themed';
import FullSizeImageModal from '../components/ImageModals/FullSizeImageModal';
import Header from '../components/Header';
import { formatCurrency } from '../utils/helpers';
import useFirestore from '../services/useFirestore';

const Auction = () => {
  const router = useRouter();
  // const { isDarkMode } = useTheme();

  const { fetchAllAuctions } = useFirestore();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        const auctionData = await fetchAllAuctions();
        setAuctions(auctionData);
      } catch (err) {
        setError('Failed to load auction items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAuctions();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage({ uri: imageUrl });
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f2f2f2]">
        <ActivityIndicator size="large" color="#4b9995" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-black">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f2f2f2]">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center z-10">
          <Icon name="arrow-back" type="material" size={24} color={'#000'} />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center">
          <Header title={"Auction Items"} textDirection={"center"} styles={"font-psemibold text-[#0084b2]"} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <View className="flex flex-wrap flex-row justify-between">
          {auctions.map((auction) => (
            <View key={auction.id} className="w-[48%] border p-4 rounded-lg shadow-md bg-black/80 mb-4">
              <TouchableOpacity
                activeOpacity={0.7}
                className="relative w-full h-48 rounded-lg overflow-hidden mb-4"
                onPress={() => openModal(auction.imageURL)}
              >
                <CachedImage
                  source={{ uri: auction.imageURL }}
                  cacheKey={`${auction.id}`}
                  placeholderContent={
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator size="large" color="#4b9995" />
                    </View>
                  }
                  style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12 }}
                />
              </TouchableOpacity>

              <Text className="text-xl font-semibold mb-2 text-white">{auction.item}</Text>
              <Text className="mb-2 text-gray-400">{auction.description}</Text>
              <View className="flex-row items-center mb-2">
                <Text className="font-bold text-gray-500">Starting Bid:</Text>
                <Text className="font-bold ml-1 text-green-600">{formatCurrency(auction.startingBid)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <FullSizeImageModal
        visible={modalVisible}
        onClose={closeModal}
        image={selectedImage}
      />
    </SafeAreaView>
  );
};

export default Auction;