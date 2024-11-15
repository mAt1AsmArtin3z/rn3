import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    loadProfileImage();
    requestNotificationPermissions();
    configureNotificationHandler();
  }, []);

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
        console.log('Imagen de perfil cargada:', storedImage);
      } else {
        console.log('No se encontró imagen de perfil guardada.');
      }
    } catch (error) {
      console.error('Error al cargar la imagen de perfil:', error);
    }
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Error', 'Se requieren permisos de notificación para recibir actualizaciones.');
      } else {
        registerForPushNotificationsAsync();
      }
    } else {
      registerForPushNotificationsAsync();
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('Error obteniendo el token de notificación:', error);
    }
  };

  const configureNotificationHandler = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Error', 'Se requiere permiso para acceder a la galería.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.assets[0].uri);
      await saveProfileImage(pickerResult.assets[0].uri);
    }
  };

  const saveProfileImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
      console.log('Imagen de perfil guardada:', uri);
    } catch (error) {
      console.error('Error al guardar la imagen de perfil:', error);
    }
  };

  const sendPushNotification = async () => {
    if (!expoPushToken) {
      Alert.alert('Error', 'No se pudo obtener el token de notificación.');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Actualización de Perfil',
      body: 'Tu perfil ha sido actualizado.',
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    Alert.alert('Notificación Enviada', 'La notificación ha sido enviada.');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil</Text>
      {profileImage && <Image source={{ uri: profileImage }} style={{ width: 200, height: 200 }} />}
      <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
      <Button title="Actualizar" onPress={sendPushNotification} />
    </View>
  );
}
