import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { tournamentRules, tournamentAwards } from '../utils/helpers';
import Header from '../components/Header';
import { useTheme } from '../context/themeContext';

const TournamentInfo = () => {
  const router = useRouter();
  // const { isDarkMode } = useTheme();

  const [rulesHeaderVisible, setRulesHeaderVisible] = useState(true);
  const [rulesContentOutOfView, setRulesContentOutOfView] = useState(false);
  const [awardsHeaderVisible, setAwardsHeaderVisible] = useState(true);

  const rulesHeaderRef = useRef(null);
  const rulesContentLayout = useRef({ y: 0, height: 0 });
  const awardsHeaderRef = useRef(null);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    rulesHeaderRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setRulesHeaderVisible(pageY + height > scrollY);
    });

    const { y, height } = rulesContentLayout.current;
    setRulesContentOutOfView(scrollY > y + height);

    awardsHeaderRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setAwardsHeaderVisible(pageY + height > scrollY);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f2f2f2]">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center z-10">
          <Icon name="arrow-back" type="material" size={24} color={'#000'} />
        </TouchableOpacity>

        {!rulesHeaderVisible && !rulesContentOutOfView && (
          <View className="absolute left-0 right-0 items-center">
            <Header title={"Tournament Rules"} textDirection={"center"} styles={"font-psemibold text-[#80b733]"} />
          </View>
        )}
        {!awardsHeaderVisible && rulesContentOutOfView && (
          <View className="absolute left-0 right-0 items-center">
            <Header title={"Tournament Awards"} textDirection={"center"} styles={"font-psemibold text-[#0084b2]"} />
          </View>
        )}
      </View>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 10 }}>
        <View ref={rulesHeaderRef}>
          <Header title={"Tournament Rules"} textDirection={"leading"} styles={"font-psemibold text-[#80b733] mb-4"} />
        </View>

        <View
          onLayout={(event) => {
            const { y, height } = event.nativeEvent.layout;
            rulesContentLayout.current = { y, height };
          }}
          className="pl-2 mb-8"
        >
          {tournamentRules.split('\n').map((line, index) => (
            <Text key={index} className="text-base font-pregular leading-6 mb-1 text-black">
              {line.trim()}
            </Text>
          ))}
        </View>

        <View ref={awardsHeaderRef}>
          <Header title={"Tournament Awards"} textDirection={"leading"} styles={"font-psemibold text-[#0084b2] mb-4"} />
        </View>
        <View className="pl-2">
          {tournamentAwards.split('\n').map((line, index) => (
            <Text key={index} className="text-base font-pregular leading-6 mb-1 text-black">
              {line.trim()}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TournamentInfo;