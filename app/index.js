import { StyleSheet } from 'react-native';
import LoginScreen from './login';

export default function AppWrapper() {
  return (   
    <LoginScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
