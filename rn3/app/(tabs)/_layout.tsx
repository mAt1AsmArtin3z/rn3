import { Tabs } from 'expo-router';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext'; // Asegúrate de que esta ruta sea correcta
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false, // Asegúrate de que no se muestre la cabecera
          tabBarStyle: { display: 'none' }, // Oculta el menú de navegación
        }}
      >
        <Tabs.Screen
          name="index" // Ruta a tu pantalla de inicio
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu" // Ruta a tu menú
          options={{
            title: 'Menu',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
