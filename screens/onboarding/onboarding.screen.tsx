import { useFonts } from "expo-font";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "@/styles/onboarding/onboarding";
import { router } from "expo-router";


export default function OnBoardingScreen() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <LinearGradient
            colors={["#a0afd2", "#F6F7F9", "#E8EEF9"]}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={styles.firstContainer}>
                <View>
                    <Image
                        source={require("@/assets/logo.png")}
                        style={styles.logo} />
                    <Image
                        source={require("@/assets/onboarding/shape_9.png")}></Image>
                </View>
                <View style={styles.titleWrapper}>
                    <Image style={styles.titleTextShape} source={require("@/assets/onboarding/shape_3.png")}></Image>
                    <Text style={[styles.titleText, { fontFamily: "Raleway_700Bold" }]}>
                        Start Learning With
                    </Text>
                    <Image
                        source={require("@/assets/onboarding/shape_2.png")}
                        style={styles.titleTextShape2}></Image>
                </View>
                <View>
                    <Image
                        source={require("@/assets/onboarding/shape_6.png")}
                        style={styles.titleTextShape3}></Image>
                    <Text
                        style={[styles.titleText, { fontFamily: "Raleway_700Bold" }]}>codeWithBassant</Text>
                </View>
                <View style={styles.dscpWrapper}>
                    <Text style={[styles.dscpText, { fontFamily: "Nunito_400Regular" }]}>
                        Explore a variety of interactive lessons,
                    </Text>
                    <Text style={[styles.dscpText, { fontFamily: "Nunito_400Regular" }]}>
                        Videos, quizzes & assignments.
                    </Text>
                </View>
                <TouchableOpacity style={styles.buttonWrapper}
                onPress={() => router.push("/(routes)/welcome-intro")}>
                    <Text style={[styles.buttonText, { fontFamily: "Nunito_700Bold" }]}>
                        Get Started!
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}