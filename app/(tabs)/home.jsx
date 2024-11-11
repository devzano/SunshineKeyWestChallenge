import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/themeContext';
import { Image, ScrollView, Text, View, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { Icon } from '@rneui/themed';
import { images } from '../../constants';
import TextModal from '../../components/TextModal';
import CustomButton from '../../components/CustomButton';
import FeedbackModal from '../../components/FeedbackModal';
import PhotoModal from '../../components/ImageModals/PhotoModal';
import FullSizeImageModal from '../../components/ImageModals/FullSizeImageModal';
import { benefitingTheDRI, charityFishingTournament, over$4MillionRaised } from '../../utils/helpers';

const Home = () => {
  // const { isDarkMode, toggleTheme } = useTheme();
  const sendgridAPIKey = process.env.EXPO_SENDGRID_API_KEY;
  const devEmail = process.env.EXPO_PUBLIC_DEV_EMAIL;

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  const [textModalVisible, setTextModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [emailSuccessModalVisible, setEmailSuccessModalVisible] = useState(false);

  const openTextModal = (title, details) => {
    setSelectedDetails({ title, details });
    setTextModalVisible(true);
  };

  const openPhotoModal = () => {
    setPhotoModalVisible(true);
  };

  const openFullImageModal = (image) => {
    setPhotoModalVisible(false);
    setSelectedImage(image);
    setFullImageModalVisible(true);
  };

  const closeFullImageModal = () => {
    setFullImageModalVisible(false);
    setPhotoModalVisible(true);
  };

  const sendFeedbackEmail = async (feedback) => {
    const emailContent = {
      personalizations: [
        {
          to: [{ email: devEmail }],
          subject: "Sunshine Key West Challenge Feedback",
        },
      ],
      from: { email: "rmanzano.se@gmail.com" },
      content: [
        {
          type: "text/plain",
          value: `Rating: ${feedback.rating}\nName: ${feedback.name}\nEmail: ${feedback.email}\nMessage: ${feedback.message}`,
        },
      ],
    };

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sendgridAPIKey}`,
        },
        body: JSON.stringify(emailContent),
      });

      if (response.ok) {
        console.log("Feedback email sent successfully");
        setEmailSuccessModalVisible(true);
      } else {
        console.error("Failed to send feedback email", response.statusText);
      }
    } catch (error) {
      console.error("Error sending feedback email:", error);
    }
  };

  const handleFeedbackSubmit = (feedback) => {
    sendFeedbackEmail(feedback);
  };

  const photos = [
    images.photo1,
    images.photo2,
    images.photo3,
    images.photo4,
    images.photo5,
    images.photo6,
    images.photo7,
    images.photo8,
    images.photo9,
    images.photo10
  ];

  const sponsorImages = [
    images.sponsor1,
    images.sponsor2,
    images.sponsor3,
    images.sponsor4,
    images.sponsor5,
  ];

  const infiniteSponsorImages = [...sponsorImages, ...sponsorImages];

  useEffect(() => {
    let index = 0;
    const scrollInterval = setInterval(() => {
      index++;
      scrollViewRef.current.scrollTo({ x: (index * screenWidth) / 2, animated: true });

      if (index >= sponsorImages.length) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({ x: 0, animated: false });
          index = 0;
        }, 500);
      }
    }, 2000);

    return () => clearInterval(scrollInterval);
  }, [screenWidth, sponsorImages.length]);

  useEffect(() => {
    if (!contactModalVisible && feedbackModalVisible) {
      setFeedbackModalVisible(true);
    }
  }, [contactModalVisible]);

  return (
    <SafeAreaView className="h-full bg-[#f2f2f2]">
      {/* <View className="absolute top-16 left-4 z-10">
        <TouchableOpacity onPress={toggleTheme}>
          <Icon
            type="feather"
            name={isDarkMode ? "sun" : "moon"}
            size={28}
            color={isDarkMode ? '#f2f2f2' : '#121212'}
          />
        </TouchableOpacity>
      </View> */}

      <View className="absolute top-16 right-4 z-10">
        <TouchableOpacity onPress={() => setContactModalVisible(true)}>
          <Icon
            type="material"
            name="contact-support"
            size={30}
            color={'#121212'}
          />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-2">
        <Image
          source={images.logo}
          className="w-[260px] h-[94px]"
          resizeMode="contain"
        />
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mt-10"
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {infiniteSponsorImages.map((sponsor, index) => {
          const inputRange = [
            (index - 1) * (screenWidth / 2),
            index * (screenWidth / 2),
            (index + 1) * (screenWidth / 2),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{ transform: [{ scale }] }}
              className="mr-4 mt-0 mb-2"
            >
              <Image
                source={sponsor}
                className="w-[120px] h-[60px]"
                resizeMode="contain"
              />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View className="flex-grow justify-start">
        <View className="w-full items-center px-4 mb-14">
          <View className="flex-row justify-between items-center w-full">
            <View className="flex-1 items-center mr-2">
              <TouchableOpacity className="items-center justify-center" onPress={() => openTextModal('Charity Fishing Tournament', charityFishingTournament)}>
                <Image
                  source={images.boat}
                  className="w-[160px] h-[94px] mb-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-1xl font-bold text-center text-#000">
                Charity Fishing Tournament
              </Text>
              <Text className="text-sm font-pregular text-center text-#000" >
                The tournament takes place in the Florida Keys, in the Gulf of Mexico.
              </Text>
            </View>

            <View className="flex-1 items-center ml-2">
              <TouchableOpacity className="items-center justify-center" onPress={openPhotoModal}>
                <Image
                  source={images.fish}
                  className="w-[160px] h-[94px] mb-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-1xl font-bold text-center text-#000" >Over 150 Anglers</Text>
              <Text className="text-sm font-pregular text-center text-#000" >
                Now in its 36th year, over 150 anglers participate in this event to support the DRI.
              </Text>
            </View>
          </View>

          <View className="m-6"></View>

          <View className="flex-row justify-between items-center w-full">
            <View className="flex-1 items-center mr-2">
              <TouchableOpacity className="items-center justify-center" onPress={() => openTextModal('Benefiting the DRI', benefitingTheDRI)}>
                <Image
                  source={images.dri}
                  className="w-[160px] h-[94px] mb-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-1xl font-bold text-center text-#000" >Benefiting the DRI</Text>
              <Text className="text-sm font-pregular text-center text-#000" >
                Supporting the millions of families affected by diabetes, the DRI is the best hope for a cure.
              </Text>
            </View>

            <View className="flex-1 items-center ml-2">
              <TouchableOpacity className="items-center justify-center" onPress={() => openTextModal('Over $4 Million Raised', over$4MillionRaised)}>
                <Image
                  source={images.giving}
                  className="w-[160px] h-[94px] mb-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-1xl font-bold text-center text-#000" >Over $4 Million Raised</Text>
              <Text className="text-sm font-pregular text-center text-#000" >
                The tournament has raised $4 million for diabetes and mental illness research.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <StatusBar style='auto' />

      <TextModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        title="Contact Us"
        details={`Get in touch with the\nTournament Director: Kathy Palomo\n724 South Flagler Ave.\nHomestead, Florida 33030\n786-346-8941\nkathy@sunshinekeywestchallenge.com`}
        buttonText={"Leave Feedback"}
        onButtonPress={() => {
          setContactModalVisible(false);
          setFeedbackModalVisible(true);
        }}
      />

      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <TextModal
        visible={textModalVisible}
        onClose={() => setTextModalVisible(false)}
        title={selectedDetails.title}
        details={selectedDetails.details}
      />

      <PhotoModal
        visible={photoModalVisible}
        onClose={() => setPhotoModalVisible(false)}
        title="Anglers"
        photos={photos}
        onImagePress={openFullImageModal}
      />

      {selectedImage && (
        <FullSizeImageModal
          visible={fullImageModalVisible}
          onClose={closeFullImageModal}
          image={selectedImage}
        />
      )}

      <Modal visible={emailSuccessModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="w-4/5 bg-[#f2f2f2] p-5 rounded-md shadow-lg">
            <Text className="text-lg font-psemibold text-[#121212] mb-4">Feedback Submitted</Text>
            <Text className="text-base font-pregular text-[#121212] mb-4">Thank you for your feedback! We have received your message.</Text>
            <CustomButton
              handlePress={() => setEmailSuccessModalVisible(false)}
              containerStyles="w-[48%] items-center justify-center"
              bgHexColor={"#42b7b4"}
              title={"Close"}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;