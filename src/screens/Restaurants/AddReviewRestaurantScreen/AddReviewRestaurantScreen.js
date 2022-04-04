import React from "react";
import { View } from "react-native";
import { AirbnbRating, Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  query,
  collection,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { map, mean } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../utils";
import {
  initialValues,
  validationSchema,
} from "./AddReviewRestaurantScreen.data";
import { styles } from "./AddReviewRestaurantScreen.styles";

export function AddReviewRestaurantScreen(props) {
  const { route } = props;
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        const idDoc = uuid();
        const newData = formValue;
        newData.id = idDoc;
        newData.idRestaurant = route.params.idRestaurant;
        newData.idUser = auth.currentUser.uid;
        newData.avatar = auth.currentUser.photoURL;
        newData.createdAt = new Date();

        await setDoc(doc(db, "reviews", idDoc), newData);
        await updateRestaurant();
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Errro al enviar la review",
        });
      }
    },
  });

  const updateRestaurant = async () => {
    const q = query(
      collection(db, "reviews"),
      where("idRestaurant", "==", route.params.idRestaurant)
    );

    onSnapshot(q, async (snapshot) => {
      const reviews = snapshot.docs;
      const arrayStars = map(reviews, (review) => review.data().rating);

      const media = mean(arrayStars);

      const restaurantRef = doc(db, "restaurants", route.params.idRestaurant);

      await updateDoc(restaurantRef, {
        ratingMedia: media,
      });

      navigation.goBack();
    });
  };

  return (
    <View style={styles.content}>
      <View>
        <View style={styles.ratingContent}>
          <AirbnbRating
            count={5}
            reviews={[
              "Pesimo",
              "Deficiente",
              "Normal",
              "Muy bueno",
              "Excelente",
            ]}
            defaultRating={formik.values.rating}
            size={35}
            onFinishRating={(rating) => formik.setFieldValue("rating", rating)}
          />
        </View>

        <View>
          <Input
            placeholder="Titulo"
            onChangeText={(text) => formik.setFieldValue("title", text)}
            errorMessage={formik.errors.title}
          />
          <Input
            placeholder="Comentario"
            multiline
            inputContainerStyle={styles.comment}
            onChangeText={(text) => formik.setFieldValue("comment", text)}
            errorMessage={formik.errors.comment}
          />
        </View>
      </View>

      <Button
        title="Enviar review"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}
