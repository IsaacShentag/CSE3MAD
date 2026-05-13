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

import EarthquakeScreen
  from "./activities/earthquake";

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

        {/* PHYSICS */}

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

        {/* ENVIRONMENT */}

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

        {/* NEUROSCIENCE */}

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

        {/* WELLNESS */}

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

        {/* ENGINEERING */}

        <TouchableOpacity
          style={[
            styles.button,

            activity ===
              "earthquake" &&
              styles.activeButton,
          ]}
          onPress={() =>
            setActivity(
              "earthquake"
            )
          }
        >

          <Text style={styles.text}>
            🌍 Engineering
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

      {activity ===
        "earthquake" && (
        <EarthquakeScreen />
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
        "#020617",
      paddingTop: 54,
      paddingBottom: 16,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        "#1e293b",
    },

    button: {
      backgroundColor:
        "#1e293b",
      paddingVertical: 15,
      paddingHorizontal: 22,
      borderRadius: 18,
      marginRight: 12,
      minWidth: 155,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
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
      letterSpacing: 0.3,
    },
  });
