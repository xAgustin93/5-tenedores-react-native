import React from "react";
import { View } from "react-native";
import { Text, Icon, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { styles } from "./UserNotLogged.styles";

export function UserNotLogged() {
  const navigation = useNavigation();

  const goToLogin = () => {
    navigation.navigate(screen.account.tab, {
      screen: screen.account.login,
    });
  };

  return (
    <View style={styles.content}>
      <Icon type="material-community" name="alert-outline" size={80} />
      <Text style={styles.info}>
        Necesitas estar logeado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={goToLogin}
      />
    </View>
  );
}
