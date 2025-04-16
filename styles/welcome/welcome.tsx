import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
    responsiveHeight,
    responsiveWidth,
} from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({

    buttonText: {
        color: "white",
        textAlign: "center",
    },
    slideImage:{
        alignSelf: "center",
        marginBottom: 30,
    },
    welcomeButtonStyle:{
        backgroundColor: "#3860be",
        width: responsiveWidth(88),
        height: responsiveHeight(5.5),
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    }
});