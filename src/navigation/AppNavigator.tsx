import React from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { BotListScreen } from '../screens/BotListScreen';
import { BotDetailScreen } from '../screens/BotDetailScreen';
import { BotAddScreen } from '../screens/BotAddScreen';
import { BotEditScreen } from '../screens/BotEditScreen';
import { LogsScreen } from '../screens/LogsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, fontSize } from '../theme';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: colors.background },
};

function BotStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="BotList" component={BotListScreen} options={{ title: 'Bots' }} />
      <Stack.Screen name="BotDetail" component={BotDetailScreen} options={{ title: 'Détails du bot' }} />
      <Stack.Screen name="BotAdd" component={BotAddScreen} options={{ title: 'Ajouter un bot' }} />
      <Stack.Screen name="BotEdit" component={BotEditScreen} options={{ title: 'Modifier le bot' }} />
    </Stack.Navigator>
  );
}

const tabIcon = (label: string, focused: boolean) => (
  <Text style={{ color: focused ? colors.primary : colors.textMuted, fontSize: fontSize.lg }}>
    {label === 'Dashboard' ? '◉' : label === 'Bots' ? '⚙' : label === 'Logs' ? '☰' : '⚡'}
  </Text>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => tabIcon(route.name, focused),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Tableau de bord' }} />
      <Tab.Screen name="Bots" component={BotStack} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.surface, width: 260 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primary + '15',
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Tableau de bord' }} />
      <Drawer.Screen name="Bots" component={BotStack} options={{ title: 'Bots' }} />
      <Drawer.Screen name="Logs" component={LogsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  const { width } = useWindowDimensions();
  const useDrawer = width >= 768;

  return (
    <NavigationContainer>
      {useDrawer ? <DrawerNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
}
