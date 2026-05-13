// =========================================================
// STEMM LAB — BREATHING PACE TRAINER
// =========================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
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

export default function BreathingScreen() {

  // =========================================================
  // STATES
  // =========================================================

  const [running,
    setRunning] =
    useState(false);

  const [phase,
    setPhase] =
    useState("READY");

  const [seconds,
    setSeconds] =
    useState(0);

  const [sessions,
    setSessions] =
    useState<number[]>([]);

  const [calmness,
    setCalmness] =
    useState(100);

  const [breaths,
    setBreaths] =
    useState(0);

  const [circleScale] =
    useState(
      new Animated.Value(1)
    );

  // =========================================================
  // BREATHING ENGINE
  // =========================================================

  useEffect(() => {

    let interval: any;

    if (running) {

      interval =
        setInterval(() => {

          setSeconds(prev =>
            prev + 1
          );

        }, 1000);
    }

    return () =>
      clearInterval(interval);

  }, [running]);

  // =========================================================
  // BREATHING CYCLE
  // =========================================================

  useEffect(() => {

    if (!running)
      return;

    const cycle =
      seconds % 8;

    // INHALE

    if (cycle < 4) {

      setPhase("INHALE");

      Animated.timing(
        circleScale,
        {
          toValue: 1.4,
          duration: 4000,
          useNativeDriver: true,
        }
      ).start();
    }

    // EXHALE

    else {

      setPhase("EXHALE");

      Animated.timing(
        circleScale,
        {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }
      ).start();
    }

    // BREATH COUNT

    if (cycle === 0) {

      setBreaths(prev =>
        prev + 1
      );

      // CALMNESS SCORE

      setCalmness(prev =>
        Math.min(
          100,
          prev + 1
        )
      );
    }

  }, [seconds]);

  // =========================================================
  // START SESSION
  // =========================================================

  const startSession = () => {

    setRunning(true);

    setPhase("INHALE");

    setSeconds(0);

    setBreaths(0);

    setCalmness(80);
  };

  // =========================================================
  // END SESSION
  // =========================================================

  const endSession = () => {

    setRunning(false);

    setSessions(prev => [
      ...prev,
      calmness,
    ]);

    setPhase("COMPLETE");
  };

  // =========================================================
  // BREATHS PER MINUTE
  // =========================================================

  const bpm =
    seconds > 0
      ? (
          breaths /
          (seconds / 60)
        ).toFixed(1)
      : "0";

  // =========================================================
  // AVERAGE SCORE
  // =========================================================

  const averageScore =
    sessions.length > 0
      ? (
          sessions.reduce(
            (a, b) => a + b,
            0
          ) / sessions.length
        ).toFixed(1)
      : "0";

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
          🌬 Breathing Pace Trainer
        </Text>

        <Text style={styles.heroSubtitle}>
          Human Wellness &
          Performance Laboratory
        </Text>

      </View>

      {/* BREATHING VISUAL */}

      <View style={styles.visualCard}>

        <Text style={styles.sectionTitle}>
          Guided Breathing System
        </Text>

        <Animated.View
          style={[

            styles.breathCircle,

            {
              transform: [
                {
                  scale:
                    circleScale,
                },
              ],
            },
          ]}
        >

          <Text style={styles.phaseText}>
            {phase}
          </Text>

        </Animated.View>

      </View>

      {/* CONTROLS */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Session Controls
        </Text>

        {!running ? (

          <TouchableOpacity
            style={styles.startBtn}
            onPress={
              startSession
            }
          >

            <Text style={styles.btnText}>
              ▶ START SESSION
            </Text>

          </TouchableOpacity>

        ) : (

          <TouchableOpacity
            style={styles.stopBtn}
            onPress={
              endSession
            }
          >

            <Text style={styles.btnText}>
              ■ END SESSION
            </Text>

          </TouchableOpacity>

        )}

      </View>

      {/* ANALYTICS */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          🧠 Wellness Analytics
        </Text>

        <View style={styles.row}>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {seconds}
            </Text>

            <Text style={styles.metricLabel}>
              Seconds
            </Text>

          </View>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {bpm}
            </Text>

            <Text style={styles.metricLabel}>
              BPM
            </Text>

          </View>

        </View>

        <View style={styles.row}>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {calmness}
            </Text>

            <Text style={styles.metricLabel}>
              Calmness
            </Text>

          </View>

          <View style={styles.metric}>

            <Text style={styles.metricValue}>
              {averageScore}
            </Text>

            <Text style={styles.metricLabel}>
              Avg Score
            </Text>

          </View>

        </View>

      </View>

      {/* GRAPH */}

      {sessions.length > 0 && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            📈 Wellness Progress
          </Text>

          <LineChart
            data={{

              labels:
                sessions.map(
                  (_, i) =>
                    `S${i + 1}`
                ),

              datasets: [
                {
                  data:
                    sessions,
                },
              ],
            }}

            width={
              screenWidth - 40
            }

            height={240}

            yAxisSuffix="%"

            chartConfig={{

              backgroundGradientFrom:
                "#ffffff",

              backgroundGradientTo:
                "#ffffff",

              decimalPlaces: 0,

              color: () =>
                "#06b6d4",

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
          🌍 Scientific Benefits
        </Text>

        <Text style={styles.infoText}>
          • Stress reduction
        </Text>

        <Text style={styles.infoText}>
          • Heart-rate regulation
        </Text>

        <Text style={styles.infoText}>
          • Cognitive focus improvement
        </Text>

        <Text style={styles.infoText}>
          • Nervous-system calming
        </Text>

        <Text style={styles.infoText}>
          • Human performance optimisation
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
        "#ecfeff",
      padding: 12,
    },

    hero: {
      backgroundColor:
        "#0891b2",
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
      color: "#cffafe",
      marginTop: 8,
      fontSize: 18,
    },

    visualCard: {
      backgroundColor:
        "#ffffff",
      padding: 30,
      borderRadius: 24,
      alignItems: "center",
      marginBottom: 16,
    },

    breathCircle: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor:
        "#06b6d4",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 30,
      shadowColor: "#06b6d4",
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 12,
    },

    phaseText: {
      color: "#ffffff",
      fontSize: 30,
      fontWeight: "bold",
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
        "#06b6d4",
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
      marginBottom: 12,
    },

    metric: {
      flex: 1,
      backgroundColor:
        "#cffafe",
      padding: 18,
      borderRadius: 18,
      alignItems: "center",
    },

    metricValue: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#0891b2",
    },

    metricLabel: {
      marginTop: 6,
      color: "#164e63",
      fontWeight: "600",
    },

    infoText: {
      fontSize: 16,
      marginBottom: 10,
      color: "#374151",
    },
  });
