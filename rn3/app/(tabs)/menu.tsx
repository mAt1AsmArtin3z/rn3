import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Share, Text } from 'react-native';
import * as Location from 'expo-location';
import { Gyroscope } from 'expo-sensors';
import { useRouter } from 'expo-router';

const MenuScreen = () => {
  const router = useRouter();
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  // Función para iniciar el giroscopio
  const startGyroscope = async () => {
    try {
      await Gyroscope.setUpdateInterval(1000); // Intervalo de actualización en milisegundos
      const sub = Gyroscope.addListener(data => {
        console.log('Giroscopio Data:', data); // Para verificar que se reciben datos
        setGyroscopeData(data);
      });
      setSubscription(sub);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar el giroscopio');
    }
  };

  // Función para detener el giroscopio
  const stopGyroscope = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  // Función para manejar la ubicación del usuario
  const handleShowLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permiso de ubicación no concedido');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    Alert.alert('Ubicación', `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`);
  };

  // Función para compartir la app
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: '¡Mira esta aplicación increíble! fmdavid.com',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la aplicación');
    }
  };

  // Manejar la visualización de datos del giroscopio
  const handleShowGyroscopeData = () => {
    Alert.alert('Datos del Giroscopio', `X: ${gyroscopeData.x.toFixed(2)}\nY: ${gyroscopeData.y.toFixed(2)}\nZ: ${gyroscopeData.z.toFixed(2)}`);
  };

  useEffect(() => {
    startGyroscope();
    return () => {
      stopGyroscope(); // Limpiar suscripciones al desmontar
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Ir a Perfil" onPress={() => router.push('/profile')} />
      <Button title="Mostrar Ubicación" onPress={handleShowLocation} />
      <Button title="Compartir App" onPress={handleShareApp} />
      <Button title="Mostrar Datos del Giroscopio" onPress={handleShowGyroscopeData} />
      <Text style={{ marginTop: 20 }}>
        Giroscopio - X: {gyroscopeData.x.toFixed(2)} | Y: {gyroscopeData.y.toFixed(2)} | Z: {gyroscopeData.z.toFixed(2)}
      </Text>
    </View>
  );
};

export default MenuScreen;
