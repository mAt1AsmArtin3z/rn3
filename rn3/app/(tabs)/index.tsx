import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Error', 'La autenticación biométrica no está configurada en este dispositivo');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación requerida para acceder a la app',
        fallbackLabel: 'Usar contraseña',
      });

      if (result.success) {
        setIsAuthenticated(true);
        setAuthFailed(false);
        router.push('/menu'); // Redirigir a la nueva pestaña "Menu"
      } else {
        setAuthFailed(true);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un problema al autenticar');
    }
  };

  const handleRetryAuthentication = () => {
    authenticate();
  };

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{authFailed ? 'Autenticación fallida. Intenta de nuevo.' : 'Autenticación en progreso...'}</Text>
        {authFailed && (
          <Button title="Intentar de nuevo" onPress={handleRetryAuthentication} />
        )}
      </View>
    );
  }

  return null; // No se muestra nada más en esta pantalla después de la autenticación.
}
