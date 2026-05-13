// =========================================================
// STEMM LAB — EARTHQUAKE ENGINEERING SIMULATOR
// =========================================================

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";

import {
  LineChart,
} from "react-native-chart-kit";

const screenWidth =
  Dimensions.get("window").width;

// =========================================================
// MAIN SCREEN
// =========================================================

export default function EarthquakeScreen() {

  // =========================================================
  // STATES
  // =========================================================

  const [running,
    setRunning] =
    useState(false);

  const [richter,
    setRichter] =
    useState(0);

  const [integrity,
    setIntegrity] =
    useState(100);

  const [danger,
    setDanger] =
    useState("SAFE");

  const [history,
    setHistory] =
    useState<number[]>([]);

  const shakeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // =========================================================
  // SHAKE ENGINE
  // =========================================================

  useEffect(() => {

    let interval: any;

    if (running) {

      interval =
        setInterval(() => {

          // RANDOM RICHTER

          const quake =
            (
              2 +
              Math.random() * 7
            ).toFixed(1);

          const value =
            Number(quake);

          setRichter(value);

          // STRUCTURAL DAMAGE

          const newIntegrity =
            Math.max(
              0,
              100 - value * 10
            );

          setIntegrity(
            Math.floor(
              newIntegrity
            )
          );

          // DANGER LEVEL

          if (value < 4) {

            setDanger("SAFE");

          } else if (
            value < 6
          ) {

            setDanger("WARNING");

          } else {

            setDanger(
              "CRITICAL"
            );
          }

          // HISTORY

          setHistory(prev => [

            ...prev.slice(-9),

            value,
          ]);

          // SHAKE ANIMATION

          Animated.sequence([

            Animated.timing(
              shakeAnim,
              {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              shakeAnim,
              {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              shakeAnim,
              {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
              }
            ),
          ]).start();

        }, 1500);
    }

    return () =>
      clearInterval(interval);

  }, [running]);

  // =========================================================
  // START
  // =========================================================

  const startSimulation =
    () => {

      setRunning(true);

      setHistory([]);
    };

  // =========================================================
  // STOP
  // =========================================================

  const stopSimulation =
    () => {

      setRunning(false);
    };

  // =========================================================
  // COLORS
  // =========================================================

  const getDangerColor =
    () => {

      if (
        danger === "SAFE"
      )
        return "#22c55e";

      if (
        danger ===
        "WARNING"
      )
        return "#f59e0b";

      return "#ef4444";
    };

  // =========================================================
  // UI
  // =========================================================

  return (

    <ScrollView
      style={styles.container}
    >

      {/* HERO */}

      <View style={styles.hero}>

        <Text style={styles.heroTitle}>
          🌍 Earthquake Engineering
        </Text>

        <Text style={styles.heroSubtitle}>
          Structural Integrity &
          Disaster Simulation Lab
        </Text>

      </View>

      {/* SHAKE AREA */}

      <Animated.View
        style={[

          styles.shakeCard,

          {
            transform: [
              {
                translateX:
                  shakeAnim,
              },
            ],
          },
        ]}
      >

        <Text style={styles.richterValue}>
          {richter.toFixed(1)}
        </Text>

        <Text style={styles.richterLabel}>
          Richter Scale
        </Text>

      </Animated.View>

      {/* CONTROLS */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Simulation Controls
        </Text>

        {!running ? (

          <TouchableOpacity
            style={styles.startBtn}
            onPress={
              startSimulation
            }
          >

            <Text style={styles.btnText}>
              ▶ START SIMULATION
            </Text>

          </TouchableOpacity>

        ) : (

          <TouchableOpacity
            style={styles.stopBtn}
            onPress={
              stopSimulation
            }
          >

            <Text style={styles.btnText}>
              ■ STOP SIMULATION
            </Text>

          </TouchableOpacity>

        )}

      </View>

      {/* ENGINEERING DASHBOARD */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          🏗 Structural Analytics
        </Text>

        <View style={styles.row}>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {integrity}%
            </Text>

            <Text style={styles.metricLabel}>
              Integrity
            </Text>

          </View>

          <View
            style={[

              styles.metric,

              {
                backgroundColor:
                  getDangerColor(),
              },
            ]}
          >

            <Text
              style={
                styles.dangerText
              }
            >
              {danger}
            </Text>

            <Text
              style={
                styles.dangerLabel
              }
            >
              Status
            </Text>

          </View>

        </View>

      </View>

      {/* GRAPH */}

      {history.length > 0 && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            📈 Seismic Activity
          </Text>

          <LineChart
            data={{

              labels:
                history.map(
                  (_, i) =>
                    `T${i + 1}`
                ),

              datasets: [
                {
                  data:
                    history,
                },
              ],
            }}

            width={
              screenWidth - 40
            }

            height={240}

            yAxisSuffix="R"

            chartConfig={{

              backgroundGradientFrom:
                "#ffffff",

              backgroundGradientTo:
                "#ffffff",

              decimalPlaces: 1,

              color: () =>
                "#ef4444",

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

      {/* SCIENCE INFO */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          🌍 Engineering Concepts
        </Text>

        <Text style={styles.infoText}>
          • Structural resonance
        </Text>

        <Text style={styles.infoText}>
          • Seismic vibration analysis
        </Text>

        <Text style={styles.infoText}>
          • Earthquake intensity
        </Text>

        <Text style={styles.infoText}>
          • Civil engineering safety
        </Text>

        <Text style={styles.infoText}>
          • Structural failure modelling
        </Text>

      </View>

    </ScrollView>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#fef2f2",
      padding: 12,
    },

    hero: {
      backgroundColor:
        "#b91c1c",
      padding: 24,
      borderRadius: 24,
      marginBottom: 16,
    },

    heroTitle: {
      color: "#ffffff",
      fontSize: 28,
      fontWeight: "bold",
    },

    heroSubtitle: {
      color: "#fecaca",
      marginTop: 8,
      fontSize: 18,
    },

    shakeCard: {
      backgroundColor:
        "#ffffff",
      padding: 40,
      borderRadius: 24,
      alignItems: "center",
      marginBottom: 16,
    },

    richterValue: {
      fontSize: 72,
      fontWeight: "bold",
      color: "#dc2626",
    },

    richterLabel: {
      fontSize: 24,
      fontWeight: "600",
      color: "#374151",
      marginTop: 8,
    },

    card: {
      backgroundColor:
        "#ffffff",
      padding: 20,
      borderRadius: 24,
      marginBottom: 16,
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 18,
      color: "#111827",
    },

    startBtn: {
      backgroundColor:
        "#22c55e",
      padding: 20,
      borderRadius: 18,
    },

    stopBtn: {
      backgroundColor:
        "#ef4444",
      padding: 20,
      borderRadius: 18,
    },

    btnText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
    },

    row: {
      flexDirection: "row",
      gap: 12,
    },

    metric: {
      flex: 1,
      backgroundColor:
        "#fee2e2",
      padding: 20,
      borderRadius: 18,
      alignItems: "center",
    },

    metricValue: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#b91c1c",
    },

    metricLabel: {
      marginTop: 6,
      color: "#7f1d1d",
      fontWeight: "600",
    },

    dangerText: {
      color: "#ffffff",
      fontSize: 26,
      fontWeight: "bold",
    },

    dangerLabel: {
      color: "#ffffff",
      marginTop: 6,
      fontWeight: "600",
    },

    infoText: {
      fontSize: 16,
      marginBottom: 10,
      color: "#374151",
    },
  });
