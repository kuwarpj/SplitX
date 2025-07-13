import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <RootNavigator />
    </NavigationContainer>
  );
}
