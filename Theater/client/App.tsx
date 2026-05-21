import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './src/screens/HomeScreen';
import ShowDetailsScreen from './src/screens/ShowDetailsScreen';
import MyReservationsScreen from './src/screens/MyReservationsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VerifyLoginCodeScreen from './src/screens/VerifyLoginCodeScreen';
import { useAuthStore } from './src/store/useAuthStore';

// Disable native screens for compatibility
enableScreens(false);

const Stack = createStackNavigator();

export default function App() {
  const token = useAuthStore((state) => state.token);
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    loadAuth().finally(() => setAuthLoaded(true));
  }, [loadAuth]);

  if (!authLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyLoginCode" component={VerifyLoginCodeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Shows" component={HomeScreen} />
            <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
            <Stack.Screen name="Reservations" component={MyReservationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
