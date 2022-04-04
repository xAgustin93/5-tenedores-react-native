import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeEmailForm.data";
import { styles } from "./ChangeEmailForm.styles";

export function ChangeEmailForm(props) {
  const { onClose, onReload } = props;
  const [showPassword, setShowPassword] = useState(false);

  const onShowPassword = () => setShowPassword((prevState) => !prevState);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const currentUser = getAuth().currentUser;

        const credentials = EmailAuthProvider.credential(
          currentUser.email,
          formValue.password
        );
        reauthenticateWithCredential(currentUser, credentials);

        await updateEmail(currentUser, formValue.email);

        onReload();
        onClose();
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar el email",
        });
      }
    },
  });

  return (
    <View style={styles.content}>
      <Input
        placeholder="Nuevo email"
        containerStyle={styles.input}
        onChangeText={(text) => formik.setFieldValue("email", text)}
        errorMessage={formik.errors.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: onShowPassword,
        }}
        onChangeText={(text) => formik.setFieldValue("password", text)}
        errorMessage={formik.errors.password}
      />
      <Button
        title="Cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}
