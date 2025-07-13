import { Button, Text, View } from "react-native";
const AccountScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏠 Account Screen</Text>
      <Button title="Go to Details" />
    </View>
  );
};

export default AccountScreen;
