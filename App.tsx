import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BotProvider } from './src/context/BotContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BotProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </BotProvider>
    </GestureHandlerRootView>
  );
}
