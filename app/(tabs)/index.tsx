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

export default function Index() {

  const [activity,
    setActivity] =
    useState("parachute");

  return (

    <View style={{ flex: 1 }}>

      {/* TOP NAVIGATION */}

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
            🪂 Parachute
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
            🔊 Sound
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
            ⚡ Reaction
          </Text>

        </TouchableOpacity>

      </ScrollView>

      {/* ACTIVE SCREEN */}

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

    </View>
  );
}

const styles =
  StyleSheet.create({

    topBar: {
      flexGrow: 0,
      flexDirection: "row",
      backgroundColor:
        "#111827",
      paddingTop: 50,
      paddingBottom: 12,
      paddingHorizontal: 10,
    },

    button: {
      backgroundColor:
        "#374151",
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 14,
      marginRight: 10,
      minWidth: 120,
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
