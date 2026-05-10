import React, {
  useState,
} from "react";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import ParachuteScreen
  from "./activities/parachute";

import SoundScreen
  from "./activities/sound";

export default function Index() {

  const [activity,
    setActivity] =
    useState("parachute");

  return (

    <View style={{ flex: 1 }}>

      {/* TOP NAV */}

      <View style={styles.topBar}>

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
            🪂 Parachute
          </Text>

        </TouchableOpacity>

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
            🔊 Sound
          </Text>

        </TouchableOpacity>

      </View>

      {/* SCREEN */}

      {activity ===
        "parachute" && (
        <ParachuteScreen />
      )}

      {activity ===
        "sound" && (
        <SoundScreen />
      )}

    </View>
  );
}

const styles =
  StyleSheet.create({

    topBar: {
      flexDirection: "row",
      backgroundColor:
        "#111827",
      paddingTop: 50,
      paddingBottom: 12,
      paddingHorizontal: 10,
      gap: 10,
    },

    button: {
      flex: 1,
      backgroundColor:
        "#374151",
      padding: 14,
      borderRadius: 12,
    },

    activeButton: {
      backgroundColor:
        "#7c3aed",
    },

    text: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
    },
  });
