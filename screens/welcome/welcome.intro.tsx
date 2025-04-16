import React from "react";
import { Image, Text, View } from "react-native";
import { Nunito_400Regular, Nunito_700Bold, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import AppIntroSlider from "react-native-app-intro-slider";
import { onboardingSwiperData } from '../../constants/constans';
import { router } from "expo-router";
import { commonStyles } from "@/common/common.styles";
import { styles } from "@/styles/welcome/welcome";


export default function WelcomIntroScreen() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const renderItem = ({ item }: { item: onboardingSwiperDataType }) => (
        <LinearGradient
            colors={["#a0afd2", "#F6F7F9", "#E8EEF9"]}
            style={{ flex: 1, paddingHorizontal: 16 }}
        >
            <View style={{ marginTop: 80 }}>
                <Image
                    source={item.image}
                    style={{ alignSelf: "center", marginBottom: 30 }}
                />
                <Text style={[commonStyles.title, { fontFamily: "Raleway_700Bold" }]}>
                    {item.title}
                </Text>
                <View style={{ marginTop: 15 }}>
                    <Text
                        style={[
                            commonStyles.description,
                            { fontFamily: "Nunito_400Regular" },
                        ]}
                    >
                        {item.description}
                    </Text>
                    <Text
                        style={[
                            commonStyles.description,
                            { fontFamily: "Nunito_400Regular" },
                        ]}
                    >
                        {item.sortDescrition}
                    </Text>
                    <Text
                        style={[
                            commonStyles.description,
                            { fontFamily: "Nunito_400Regular" },
                        ]}
                    >
                        {item.sortDescrition2}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );

    return (
        <AppIntroSlider
          renderItem={renderItem}
          data={onboardingSwiperData}
          onDone={() => {
            router.push("/login");
          }}
          onSkip={() => {
            router.push("/login");
          }}
          renderNextButton={() => (
            <View style={styles.welcomeButtonStyle}>
              <Text
                style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
              >
                Next
              </Text>
            </View>
          )}
          renderDoneButton={() => (
            <View style={styles.welcomeButtonStyle}>
              <Text
                style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
              >
                Done
              </Text>
            </View>
          )}
          showSkipButton={false}
          dotStyle={commonStyles.dotStyle}
          bottomButton={true}
          activeDotStyle={commonStyles.activeDotStyle}
        />
      );
}