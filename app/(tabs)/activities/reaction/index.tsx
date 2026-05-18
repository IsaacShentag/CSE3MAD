import {
  saveExperiment
} from "../../../../services/firestore";

import React, {
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";

import {
  LineChart,
} from "react-native-chart-kit";

const screenWidth =
  Dimensions.get("window").width;

export default function ReactionScreen() {

  const [gameState,
    setGameState] =
    useState("idle");

  const [message,
    setMessage] =
    useState(
      "Press START"
    );

  const [startTime,
    setStartTime] =
    useState(0);

  const [scores,
    setScores] =
    useState<number[]>([]);

  const [bestScore,
    setBestScore] =
    useState<number | null>(
      null
    );

  // =====================================================
  // START GAME
  // =====================================================

  const startGame = () => {

    setGameState("waiting");

    setMessage(
      "Wait for GREEN..."
    );

    const delay =
      1000 +
      Math.random() * 4000;

    setTimeout(() => {

      setGameState("ready");

      setMessage(
        "TAP NOW!"
      );

      setStartTime(
        Date.now()
      );

    }, delay);
  };

  // =====================================================
  // HANDLE TAP
  // =====================================================

  const handleTap = async () => {

    // TOO EARLY

    if (
      gameState === "waiting"
    ) {

      setMessage(
        "Too Early!"
      );

      setGameState("idle");

      return;
    }

    // SUCCESS

    if (
      gameState === "ready"
    ) {

      const result =
        Date.now() -
        startTime;

      // =================================================
      // FIRESTORE CLOUD SAVE
      // =================================================

      await saveExperiment(
        "reaction",
        result
      );

      console.log(
        "Reaction experiment uploaded to Firestore"
      );

      // OPTIONAL WOW ALERT

      Alert.alert(
        "Cloud Upload Complete",
        "Scientific experiment uploaded to Firebase Firestore."
      );

      // =================================================
      // LOCAL ANALYTICS
      // =================================================

      const updatedScores = [
        ...scores,
        result,
      ];

      setScores(
        updatedScores
      );

      // BEST SCORE

      if (
        bestScore === null ||
        result < bestScore
      ) {

        setBestScore(
          result
        );
      }

      setMessage(
        `${result} ms`
      );

      setGameState("idle");
    }
  };

  // =====================================================
  // AVERAGE
  // =====================================================

  const average =
    scores.length > 0
      ? (
          scores.reduce(
            (a, b) => a + b,
            0
          ) / scores.length
        ).toFixed(1)
      : "0";

  return (

    <ScrollView
      style={styles.container}
    >

      {/* HERO */}

      <View style={styles.hero}>

        <Text style={styles.heroTitle}>
          ⚡ Reaction Board
        </Text>

        <Text style={styles.heroSubtitle}>
          Human Performance
          Laboratory
        </Text>

      </View>

      {/* GAME AREA */}

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTap}
        style={[

          styles.gameArea,

          gameState ===
            "ready" && {
            backgroundColor:
              "#22c55e",
          },

          gameState ===
            "waiting" && {
            backgroundColor:
              "#ef4444",
          },
        ]}
      >

        <Text style={styles.gameText}>
          {message}
        </Text>

      </TouchableOpacity>

      {/* START */}

      <TouchableOpacity
        style={styles.startBtn}
        onPress={startGame}
      >

        <Text style={styles.btnText}>
          START TEST
        </Text>

      </TouchableOpacity>

      {/* STATS */}

      <View style={styles.card}>

        <Text style={styles.title}>
          🧠 Neuroscience Analytics
        </Text>

        <View style={styles.row}>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {scores.length}
            </Text>

            <Text style={styles.metricLabel}>
              Trials
            </Text>

          </View>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {average}
            </Text>

            <Text style={styles.metricLabel}>
              Avg ms
            </Text>

          </View>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {bestScore ?? "-"}
            </Text>

            <Text style={styles.metricLabel}>
              Best
            </Text>

          </View>

        </View>

      </View>

      {/* GRAPH */}

      {scores.length > 0 && (

        <View style={styles.card}>

          <Text style={styles.title}>
            📈 Reaction Analysis
          </Text>

          <LineChart
            data={{

              labels:
                scores.map(
                  (_, i) =>
                    `T${i + 1}`
                ),

              datasets: [
                {
                  data: scores,
                },
              ],
            }}

            width={
              screenWidth - 40
            }

            height={240}

            yAxisSuffix="ms"

            chartConfig={{

              backgroundGradientFrom:
                "#ffffff",

              backgroundGradientTo:
                "#ffffff",

              decimalPlaces: 0,

              color: () =>
                "#7c3aed",

              labelColor: () =>
                "#111827",
            }}

            bezier

            style={{
              borderRadius: 16,
            }}
          />

        </View>
      )}

    </ScrollView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#f3f4f6",
      padding: 12,
    },

    hero: {
      backgroundColor:
        "#7c3aed",
      padding: 24,
      borderRadius: 24,
      marginBottom: 16,
    },

    heroTitle: {
      color: "#ffffff",
      fontSize: 30,
      fontWeight: "bold",
    },

    heroSubtitle: {
      color: "#e9d5ff",
      marginTop: 8,
      fontSize: 18,
    },

    gameArea: {
      height: 320,
      backgroundColor:
        "#111827",
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    gameText: {
      color: "#ffffff",
      fontSize: 34,
      fontWeight: "bold",
    },

    startBtn: {
      backgroundColor:
        "#2563eb",
      padding: 20,
      borderRadius: 18,
      marginBottom: 20,
    },

    btnText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 20,
    },

    card: {
      backgroundColor:
        "#ffffff",
      padding: 20,
      borderRadius: 20,
      marginBottom: 16,
    },

    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
    },

    row: {
      flexDirection: "row",
      gap: 10,
    },

    metric: {
      flex: 1,
      backgroundColor:
        "#ede9fe",
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
    },

    metricValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#7c3aed",
    },

    metricLabel: {
      marginTop: 6,
      color: "#4b5563",
      fontWeight: "600",
    },
  });
