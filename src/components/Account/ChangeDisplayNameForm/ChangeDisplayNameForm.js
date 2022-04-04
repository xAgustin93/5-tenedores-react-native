import React from "react";
import { View } from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeDisplayNameForm.data";
import { styles } from "./ChangeDisplayNameForm.styles";

export function ChangeDisplayNameForm(props) {
  const { onClose, onReload } = props;

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const { displayName } = formValue;
        const currentUser = getAuth().currentUser;
        await updateProfile(currentUser, { displayName });

        onReload();
        onClose();
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar el nombre y apellidos",
        });
      }
    },
  });

  return (
    <View style={styles.content}>
      <Input
        placeholder="Nombre y apellidos"
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        onChangeText={(text) => formik.setFieldValue("displayName", text)}
        errorMessage={formik.errors.displayName}
      />
      <Button
        title="Cambiar nombre y apellidos"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}
