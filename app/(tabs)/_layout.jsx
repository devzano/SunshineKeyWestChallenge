import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Icon } from '@rneui/themed';
import { useTheme } from '../../context/themeContext';

const TabIcon = ({ type, icon, color, name, focused }) => {
  return (
    <View>
      <Icon type={type} name={icon} color={color} />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  // const { isDarkMode } = useTheme();
  // const backgroundColor = isDarkMode ? '#000' : '#fff';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#b4dea2',
          tabBarInactiveTintColor: '#4b9995',
          tabBarStyle: {
            backgroundColor: '#fff',
            position: 'absolute',
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                type={"material"}
                icon={"home"}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Events',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                type={"material"}
                icon={"event"}
                color={color}
                name="Events"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="nearby"
          options={{
            title: 'Nearby',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                type={"material"}
                icon={"near-me"}
                color={color}
                name="Nearby"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>

      <StatusBar style="dark" />
    </>
  );
};

export default TabsLayout;