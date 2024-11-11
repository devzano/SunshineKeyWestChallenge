import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/themeContext';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import CachedImage from 'expo-cached-image';
import useFirestore from '../../services/useFirestore';
import CustomButton from '../../components/CustomButton';
import { Icon } from '@rneui/themed';
import Header from '../../components/Header';
import { formatDate } from '../../utils/helpers';

const Events = () => {
  const router = useRouter();
  // const { isDarkMode } = useTheme();

  const { fetchAllEvents } = useFirestore();
  const [events, setEvents] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      const eventsData = await fetchAllEvents();
      const activeEvents = eventsData.filter(event => event.isActive);
      const sortedEvents = activeEvents.sort((a, b) => new Date(a.dateOfEvent) - new Date(b.dateOfEvent));
      setEvents(sortedEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
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
        <Text className="text-[#000]">{error}</Text>
      </SafeAreaView>
    );
  }

  const toggleExpand = (eventID) => {
    setExpandedEvents((prev) =>
      prev.includes(eventID) ? prev.filter((id) => id !== eventID) : [...prev, eventID]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f2f2f2]">
      <Header title={"Events"} textDirection={"center"} styles={"text-[#000]"} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#4b9995'} />}
      >
        {events.map((event) => {
          const isExpanded = expandedEvents.includes(event.id);

          return (
            <View key={event.id} className="flex-column items-center mb-6">
              <View className="flex-row items-center justify-between w-full">
                <TouchableWithoutFeedback onPress={() => toggleExpand(event.id)}>
                  <View className="flex-row items-center flex-1">
                    <View className="w-11 h-11 rounded-lg border border-[#b4dea2] justify-center items-center p-1">
                      <CachedImage
                        source={{ uri: event.imageURL }}
                        cacheKey={event.id}
                        placeholderContent={<ActivityIndicator size="small" color="#4b9995" />}
                        style={{ width: 44, height: 44, borderRadius: 8 }}
                      />
                    </View>
                    <View className="flex-1 ml-2.5">
                      <Text className="text-base font-semibold" numberOfLines={1} style={{ color: '#121212'}}>
                        {event.title}
                      </Text>
                      <Text className="text-xs text-gray-400" numberOfLines={1}>
                        {formatDate(event.dateOfEvent).toDateString()}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={() => toggleExpand(event.id)}>
                  <Icon
                    name={isExpanded ? 'upcircle' : 'downcircle'}
                    type="antdesign"
                    size={24}
                    color={'#121212'}
                  />
                </TouchableOpacity>
              </View>

              {isExpanded && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-full h-48 rounded-lg mt-2 relative"
                  >
                    <CachedImage
                      source={{ uri: event.imageURL }}
                      cacheKey={`${event.id}-expanded`}
                      placeholderContent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <ActivityIndicator size="large" color="#4b9995" />
                        </View>
                      }
                      className="w-full h-full rounded-lg"
                    />
                  </TouchableOpacity>

                  {event.detailsHeader && (
                    <View className="w-full">
                      <Text className="text-sm mt-2 font-bold leading-5" style={{ color: '#121212' }}>
                        {event.detailsHeader}
                      </Text>
                    </View>
                  )}
                  {event.details && (
                    <View className="w-full mb-2">
                      <Text className="text-sm leading-5" style={{ color: '#121212' }}>
                        {event.details}
                      </Text>
                    </View>
                  )}

                  {event.detailsHeader2 && (
                    <View className="w-full">
                      <Text className="text-sm mt-2 font-bold leading-5" style={'#121212'}>
                        {event.detailsHeader2}
                      </Text>
                    </View>
                  )}
                  {event.details2 && (
                    <View className="w-full mb-2">
                      <Text className="text-sm leading-5" style={{ color: '#121212' }}>
                        {event.details2}
                      </Text>
                    </View>
                  )}

                  {event.detailsHeader3 && (
                    <View className="w-full">
                      <Text className="text-sm mt-2 font-bold leading-5" style={{ color: '#121212' }}>
                        {event.detailsHeader3}
                      </Text>
                    </View>
                  )}
                  {event.details3 && (
                    <View className="w-full">
                      <Text className="text-sm leading-5" style={{ color: '#121212' }}>
                        {event.details3}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View className="w-full mt-3 px-4 mb-14 flex-row justify-between">
        <CustomButton
          title="Tournament Info"
          handlePress={() => router.push('/tournamentInfo')}
          containerStyles="w-[48%]"
          bgHexColor={"#42b7b4"}
        />

        <CustomButton
          title="Auction"
          handlePress={() => router.push('/auction')}
          containerStyles="w-[48%]"
          bgHexColor={"#42b7b4"}
        />
      </View>
    </SafeAreaView>
  );
};

export default Events;