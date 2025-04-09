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
    firstContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 50,
        justifyContent: "center"
    },
    logo: {
        width: wp("23%"),
        height: hp("10%"),
    },
    titleWrapper: {
        flexDirection: "row",
    },
    titleTextShape:{
        position: "absolute",
        left: -28,
        top: -20,
    },
    titleText:{
        fontSize: hp("4%"),
        textAlign: "center",
    },
    titleTextShape2:{
        position: "absolute",
        right: -40,
        top: -20,
    },
    titleTextShape3:{
        position: "absolute",
        left: 60,
    },
    dscpWrapper: {
        marginTop: 30,
      },
      dscpText: {
        textAlign: "center",
        color: "#575757",
        fontSize: hp("2.3%"),
      },
      buttonWrapper: {
        backgroundColor: "#3860be",
        width: wp("92%"),
        paddingVertical: 18,
        borderRadius: 8,
        marginTop: 40,
      },
      buttonText: {
        color: "white",
        textAlign: "center",
      },
      welcomeButtonStyle:{
        backgroundColor: "#3860be",
        width: responsiveWidth(88),
        height: responsiveHeight(5.5),
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
      }
});