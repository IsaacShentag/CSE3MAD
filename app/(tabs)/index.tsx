import React, {
  useState,
} from "react";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import ParachuteScreen
  from "./activities/parachute";

import SoundScreen
  from "./activities/sound";

import ReactionScreen
  from "./activities/reaction";

import BreathingScreen
  from "./activities/breathing";

export default function Index() {

  const [activity,
    setActivity] =
    useState("parachute");

  return (

    <View style={{ flex: 1 }}>

      {/* =====================================================
          STEMM LAB NAVIGATION
      ===================================================== */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.topBar}
      >

        {/* PARACHUTE */}

        <TouchableOpacity
          style={[
            styles.button,

            activity ===
              "parachute" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setActivity(
              "parachute"
            )
          }
        >

          <Text style={styles.text}>
            🪂 Physics
          </Text>

        </TouchableOpacity>

        {/* SOUND */}

        <TouchableOpacity
          style={[
            styles.button,

            activity ===
              "sound" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setActivity(
              "sound"
            )
          }
        >

          <Text style={styles.text}>
            🔊 Environment
          </Text>

        </TouchableOpacity>

        {/* REACTION */}

        <TouchableOpacity
          style={[
            styles.button,

            activity ===
              "reaction" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setActivity(
              "reaction"
            )
          }
        >

          <Text style={styles.text}>
            ⚡ Neuroscience
          </Text>

        </TouchableOpacity>

        {/* BREATHING */}

        <TouchableOpacity
          style={[
            styles.button,

            activity ===
              "breathing" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setActivity(
              "breathing"
            )
          }
        >

          <Text style={styles.text}>
            🌬 Wellness
          </Text>

        </TouchableOpacity>

      </ScrollView>

      {/* =====================================================
          ACTIVE STEMM MODULE
      ===================================================== */}

      {activity ===
        "parachute" && (
        <ParachuteScreen />
      )}

      {activity ===
        "sound" && (
        <SoundScreen />
      )}

      {activity ===
        "reaction" && (
        <ReactionScreen />
      )}

      {activity ===
        "breathing" && (
        <BreathingScreen />
      )}

    </View>
  );
}

const styles =
  StyleSheet.create({

    topBar: {
      flexGrow: 0,
      flexDirection: "row",
      backgroundColor:
        "#0f172a",
      paddingTop: 52,
      paddingBottom: 14,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        "#1e293b",
    },

    button: {
      backgroundColor:
        "#1e293b",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 16,
      marginRight: 12,
      minWidth: 145,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },

    activeButton: {
      backgroundColor:
        "#7c3aed",
    },

    text: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 15,
    },
  });
