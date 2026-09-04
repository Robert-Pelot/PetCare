import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PetProvider } from './src/context/PetContext';
import { AppointmentsScreen } from './src/screens/AppointmentsScreen';
import { CareLogScreen } from './src/screens/CareLogScreen';
import { DietScheduleScreen } from './src/screens/DietScheduleScreen';
import { GroomingInfoScreen } from './src/screens/GroomingInfoScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MedicalHistoryScreen } from './src/screens/MedicalHistoryScreen';
import { PetFormScreen } from './src/screens/PetFormScreen';
import { PetProfileScreen } from './src/screens/PetProfileScreen';
import { colors } from './src/theme';
import type { MainTabParamList, RootStackParamList } from './src/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.surface,
    primary: colors.primary,
    text: colors.text,
  },
};

const tabIcons: Record<keyof MainTabParamList, string> = {
  Home: '⌂',
  Profile: '🐾',
  'Care Log': '✓',
  Appointments: '◷',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: '800' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: route.name === 'Profile' ? 17 : 22 }}>
            {tabIcons[route.name]}
          </Text>
        ),
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: { borderTopColor: colors.border, height: 66, paddingBottom: 8 },
      })}
    >
      <Tab.Screen component={HomeScreen} name="Home" />
      <Tab.Screen component={PetProfileScreen} name="Profile" />
      <Tab.Screen component={CareLogScreen} name="Care Log" />
      <Tab.Screen component={AppointmentsScreen} name="Appointments" />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PetProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <RootStack.Navigator
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
              headerShadowVisible: false,
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.primaryDark,
              headerTitleStyle: { color: colors.text, fontWeight: '800' },
            }}
          >
            <RootStack.Screen component={MainTabs} name="Main" options={{ headerShown: false }} />
            <RootStack.Screen
              component={PetFormScreen}
              name="PetForm"
              options={({ route }) => ({
                title: route.params.mode === 'edit' ? 'Edit Pet' : 'Add Pet',
              })}
            />
            <RootStack.Screen
              component={MedicalHistoryScreen}
              name="MedicalHistory"
              options={{ title: 'Medical History' }}
            />
            <RootStack.Screen
              component={DietScheduleScreen}
              name="DietSchedule"
              options={{ title: 'Diet & Feeding' }}
            />
            <RootStack.Screen
              component={GroomingInfoScreen}
              name="GroomingInfo"
              options={{ title: 'Grooming' }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </PetProvider>
    </SafeAreaProvider>
  );
}
