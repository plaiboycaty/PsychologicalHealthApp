import React, { useRef, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabParamList, AppStackParamList } from '../types/navigation.types';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import HomeScreen from '../screens/home/HomeScreen';
import TestsScreen from '../screens/tests/TestsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import RoadmapScreen from '../screens/roadmap/RoadmapScreen';
import DiaryScreen from '../screens/diaries/DiaryScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();
const mintColor = '#66C5BA';

// --- Hiệu ứng slide-up + fade khi chuyển tab ---
function withTabTransition<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function AnimatedScreen(props: T) {
    const isFocused = useIsFocused();
    // Bắt đầu opacity = 1 để tránh màn trắng trên iOS khi animation chưa kịp chạy
    const slideAnim = useRef(new Animated.Value(30)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (isFocused) {
        slideAnim.setValue(30);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 70,
            friction: 12,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            // Thêm delay nhỏ để iOS kịp render component trước khi fade
            delay: Platform.OS === 'ios' ? 50 : 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Khi mất focus, reset ngay để lần sau hiệu ứng mượt
        slideAnim.setValue(30);
        fadeAnim.setValue(0);
      }
    }, [isFocused]);

    return (
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <WrappedComponent {...props} />
      </Animated.View>
    );
  };
}
// --------------------------------------------------

// --- UI Tạm thời---
const TmpScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{name} Screen</Text></View>
);

// DiariesScreen and RoadmapScreen are now real screens
// ----------------------------------------------------

// Wrap tất cả các màn hình với hiệu ứng slide
const AnimatedHome = withTabTransition(HomeScreen);
const AnimatedTests = withTabTransition(TestsScreen);
const AnimatedRoadmap = withTabTransition(RoadmapScreen);
const AnimatedDiaries = withTabTransition(DiaryScreen);
const AnimatedProfile = withTabTransition(ProfileScreen);
const AnimatedPersonalInfo = withTabTransition(PersonalInfoScreen);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: mintColor,
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarLabelStyle: { fontSize: 11, fontWeight: 'bold' },
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tests') iconName = 'clipboard';
          else if (route.name === 'Roadmap52Hz') iconName = 'musical-notes';
          else if (route.name === 'Diaries') iconName = 'heart';
          else if (route.name === 'Profile') iconName = 'person';

          return (
            <Ionicons name={iconName} size={24} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={AnimatedHome} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Tests" component={AnimatedTests} options={{ tabBarLabel: 'Test' }} />
      <Tab.Screen name="Roadmap52Hz" component={AnimatedRoadmap} options={{ tabBarLabel: '52Hz' }} />
      <Tab.Screen name="Diaries" component={AnimatedDiaries} options={{ tabBarLabel: 'Diary' }} />
      <Tab.Screen name="Profile" component={AnimatedProfile} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PersonalInfo" component={AnimatedPersonalInfo} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 35 : 35,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 70,
    marginHorizontal: 15,
    borderTopWidth: 0,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    paddingBottom: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});