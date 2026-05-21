import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.131'; // Update this to your computer's local LAN IP

export const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api' 
  : `http://${LOCAL_IP}:3000/api`;
