import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTheme } from '../../context/themeContext';
import { AppState, ActivityIndicator, FlatList, Text, TouchableOpacity, Alert, View } from 'react-native';
import { Icon } from '@rneui/themed';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet, { BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import NearbyListItem from '../../components/NearbyListItem';
import { calculateDistance, formatDistanceInFeet, getPlacePhotoUrl } from '../../utils/helpers';
import FullSizeImageModal from '../../components/ImageModals/FullSizeImageModal';

const Nearby = () => {
  const insets = useSafeAreaInsets();
  // const { isDarkMode } = useTheme();
  const googleMapsAPIKey = process.env.EXPO_GOOGLE_MAPS_API_KEY;

  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [firstFoodRender, setFirstFoodRender] = useState(true);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [viewingDirections, setViewingDirections] = useState(false);
  const mapViewRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const opalKeyLocation = {
    latitude: 24.5581707,
    longitude: -81.8068997,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (mapViewRef.current && userLocation) {
          mapViewRef.current.animateToRegion(
            {
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        }
      }
      appState.current = nextAppState;
    };

    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    return () => appStateListener.remove();
  }, [userLocation]);

  useEffect(() => {
    const startLocationWatcher = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        setUserLocation(opalKeyLocation);
        return;
      }

      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({ latitude, longitude });

          if (mapViewRef.current) {
            mapViewRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          }
        }
      );

      return () => watcher.remove();
    };

    startLocationWatcher();
  }, []);

  const fetchFoodPlaces = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&type=restaurant&keyword=fast_food|cafe|bar|bakery&key=${googleMapsAPIKey}`
      );
      const data = await response.json();

      const placesWithDistance = data.results.map((place) => {
        const distanceInKm = calculateDistance(
          location.latitude,
          location.longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        );
        const distanceInFeet = distanceInKm * 3280.84;
        return { ...place, distance: distanceInFeet };
      });

      placesWithDistance.sort((a, b) => a.distance - b.distance);

      setFoodPlaces(placesWithDistance);
    } catch (error) {
      console.error('Error fetching food places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation && firstFoodRender) {
      fetchFoodPlaces(userLocation);
      setFirstFoodRender(false);
    }
  }, [userLocation, firstFoodRender]);

  const handleDirectionsPress = (latitude, longitude) => {
    setDestination({ latitude, longitude });
    setViewingDirections(true);

    if (mapViewRef.current) {
      mapViewRef.current.fitToCoordinates(
        [userLocation || opalKeyLocation, { latitude, longitude }],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }

    bottomSheetRef.current?.close();
  };

  const handleCancelDirections = () => {
    setDestination(null);
    setViewingDirections(false);
    setRouteCoordinates([]);
    setRemainingDistance(null);
  };

  const handleFastFoodIconPress = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleRefreshFoodPlaces = () => {
    if (userLocation) {
      fetchFoodPlaces(userLocation);
    }
  };

  const handleLocationIconPress = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access location was denied');
      setUserLocation(opalKeyLocation);
      setLoadingLocation(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setUserLocation({ latitude, longitude });
    setLoadingLocation(false);

    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const renderItem = ({ item }) => (
    <NearbyListItem
      item={item}
      // isDarkMode={isDarkMode}
      handleDirectionsPress={handleDirectionsPress}
      getPlacePhotoURL={(photo_reference) => getPlacePhotoUrl(photo_reference, googleMapsAPIKey)}
      setSelectedPhoto={setSelectedPhoto}
    />
  );

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <MapView
            ref={mapViewRef}
            className="flex-1"
            initialRegion={opalKeyLocation}
          >
            <Marker
              coordinate={opalKeyLocation}
              title="Opal Key Resort & Marina"
              description="245 Front St."
            >
              <Icon name="hook" type="material-community" size={40} color="#80b733" />
            </Marker>
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
              >
                <Icon name="location-pin" type="material" size={40} color="#ff6b6b" />
              </Marker>
            )}
            {(userLocation || opalKeyLocation) && destination && (
              <>
                <MapViewDirections
                  origin={userLocation || opalKeyLocation}
                  destination={destination}
                  apikey={googleMapsAPIKey}
                  strokeWidth={3}
                  strokeColor="#42b7b4"
                  onError={(errorMessage) => {
                    console.error('Error with directions: ', errorMessage);
                    Alert.alert('Error', 'Unable to get directions');
                  }}
                  onReady={(result) => {
                    if (result.coordinates && result.coordinates.length > 0) {
                      setRouteCoordinates(result.coordinates);
                      setRemainingDistance(result.distance);
                    } else {
                      Alert.alert('No coordinates received for the route.');
                    }
                  }}
                />
                {routeCoordinates.length > 0 && (
                  <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#42b7b4"
                    strokeWidth={3}
                  />
                )}
                <Marker coordinate={destination} title="Destination">
                  <Icon name="wrong-location" type="material" size={30} color="#ff6b6b" />
                </Marker>
              </>
            )}
          </MapView>

          {viewingDirections && remainingDistance !== null && (
            <View
              style={{
                position: 'absolute',
                top: 45,
                left: 20,
                backgroundColor: '#4b9995',
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {formatDistanceInFeet(remainingDistance)}
              </Text>
            </View>
          )}

          {viewingDirections && (
            <TouchableOpacity
              onPress={handleCancelDirections}
              style={{
                position: 'absolute',
                top: 45,
                right: 20,
                backgroundColor: '#ff6b6b',
                padding: 12,
                borderRadius: 999,
              }}
              activeOpacity={0.7}
            >
              <Icon name="progress-close" type="material-community" size={30} color="#fff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleFastFoodIconPress}
            style={{
              position: 'absolute',
              bottom: insets.bottom + 55,
              right: 20,
              backgroundColor: '#4b9995',
              padding: 16,
              borderRadius: 999,
            }}
            activeOpacity={0.7}
          >
            <Icon name="fastfood" type="material" size={30} color="#fff" />
          </TouchableOpacity>

          <View
            style={{
              position: 'absolute',
              bottom: insets.bottom + 55,
              left: 20,
              backgroundColor: '#4b9995',
              borderRadius: 999,
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 8,
            }}
          >
            <TouchableOpacity
              onPress={handleLocationIconPress}
              style={{
                padding: 10,
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              {loadingLocation ? (
                <ActivityIndicator size={24} color="#b4dea2" />
              ) : (
                <Icon name="location-on" type="material" size={24} color="#fff" />
              )}
            </TouchableOpacity>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ffffff50', marginVertical: 8 }} />

            <TouchableOpacity
              onPress={() => {
                if (mapViewRef.current) {
                  mapViewRef.current.animateToRegion(opalKeyLocation, 1000);
                }
                fetchFoodPlaces(opalKeyLocation);
              }}
              style={{
                padding: 10,
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              <Icon name="hook" type="material-community" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: '#f2f2f2' }}
          >
            <BottomSheetView
              style={{
                paddingTop: insets.top - 60,
                paddingBottom: insets.bottom + 50,
                paddingHorizontal: 16,
                flex: 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#121212', flex: 1 }}>
                  Restaurants Nearby
                </Text>
                <TouchableOpacity onPress={handleRefreshFoodPlaces} activeOpacity={0.7}>
                  <Icon name="refresh" type="material" size={24} color="#4b9995" />
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#4b9995" />
              ) : (
                <FlatList
                  data={foodPlaces}
                  keyExtractor={(item) => item.place_id}
                  renderItem={renderItem}
                />
              )}
            </BottomSheetView>
          </BottomSheet>

          <FullSizeImageModal
            visible={selectedPhoto !== null}
            onClose={() => setSelectedPhoto(null)}
            image={{ uri: selectedPhoto }}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
  );
};

export default Nearby;