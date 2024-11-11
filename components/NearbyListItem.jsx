import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from '@rneui/themed';
import { formatDistance } from '../utils/helpers';

const NearbyListItem = React.memo(({ item, handleDirectionsPress, getPlacePhotoURL, setSelectedPhoto }) => {
  return (
    <View className="p-3 border-b border-gray-300">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold mb-1 text-[#121212]">{item.name}</Text>
        <TouchableOpacity
          onPress={() => handleDirectionsPress(item.geometry.location.lat, item.geometry.location.lng)}
        >
          <Icon name="share-location" type="material" size={34} color={'#121212'} />
        </TouchableOpacity>
      </View>
      <Text className="text-sm mb-1 text-[#121212]">{item.vicinity}</Text>
      <View className="flex-row justify-between">
        <Text className="text-[#121212]">
          Distance: {item.distance ? formatDistance(item.distance) : 'N/A'}
        </Text>
        <Text className="text-sm text-[#FDDA0D]">Rating: {item.rating}</Text>
      </View>
      {item.photos && (
        <TouchableOpacity onPress={() => setSelectedPhoto(getPlacePhotoURL(item.photos[0].photo_reference))}>
          <Image source={{ uri: getPlacePhotoURL(item.photos[0].photo_reference) }} style={{ width: '100%', height: 150, borderRadius: 8, marginTop: 10 }} resizeMode="cover" />
        </TouchableOpacity>
      )}
    </View>
  );
});

export default NearbyListItem;