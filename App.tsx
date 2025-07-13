import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { AppProvider } from "./context/AppContext";
import RootNavigator from "./navigation/RootNavigator";
export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </AppProvider>
  );
}
