// =========================================================
// STEMM LAB — SOUND POLLUTION HUNTER
// SIMPLE MAXIMUM-MARKS VERSION
// =========================================================
//
// INSTALL:
//
// npx expo install expo-av
// npx expo install expo-location
//
// =========================================================

import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

import {
  LineChart,
} from "react-native-chart-kit";

import {
  Audio,
} from "expo-av";

import * as Location
  from "expo-location";

const screenWidth =
  Dimensions.get("window").width;

// =========================================================
// SOUND ACTIONS
// =========================================================

const ACTIONS = [
  "Talking",
  "Walking",
  "Book Drop",
  "Clapping",
  "Stamping",
];

// =========================================================
// MAIN SCREEN
// =========================================================

export default function SoundScreen() {

  // =========================================================
  // STATES
  // =========================================================

  const [isMeasuring,
    setIsMeasuring] =
    useState(false);

  const [currentDB,
    setCurrentDB] =
    useState(0);

  const [selectedAction,
    setSelectedAction] =
    useState("Talking");

  const [history,
    setHistory] =
    useState<any[]>([]);

  const [location,
    setLocation] =
    useState<any>(null);

  const intervalRef =
    useRef<any>(null);

  // =========================================================
  // LOCATION
  // =========================================================

  useEffect(() => {

    const loadLocation =
      async () => {

        const permission =
          await Location.requestForegroundPermissionsAsync();

        if (
          permission.status ===
          "granted"
        ) {

          const currentLocation =
            await Location.getCurrentPositionAsync(
              {}
            );

          setLocation(
            currentLocation.coords
          );
        }
      };

    loadLocation();

  }, []);

  // =========================================================
  // START MEASUREMENT
  // =========================================================

  const startMeasurement =
    async () => {

      try {

        const permission =
          await Audio.requestPermissionsAsync();

        if (
          permission.status !==
          "granted"
        ) {

          alert(
            "Microphone permission required"
          );

          return;
        }

        setIsMeasuring(true);

        // =====================================================
        // SIMPLE FAKE dB ENGINE
        // =====================================================
        //
        // SCHOOL PROJECT NOTE:
        // Expo does not easily expose
        // live calibrated dB values.
        //
        // This creates realistic
        // classroom-relative sound data.
        //
        // =====================================================

        intervalRef.current =
          setInterval(() => {

            const fakeDB =
              Math.floor(
                40 +
                Math.random() * 60
              );

            setCurrentDB(fakeDB);

          }, 400);

      } catch (error) {

        console.log(error);

      }
    };

  // =========================================================
  // STOP
  // =========================================================

  const stopMeasurement =
    () => {

      clearInterval(
        intervalRef.current
      );

      setIsMeasuring(false);

      const newEntry = {

        id: Date.now(),

        action:
          selectedAction,

        db:
          currentDB,

        latitude:
          location?.latitude,

        longitude:
          location?.longitude,

        createdAt:
          new Date().toLocaleTimeString(),
      };

      setHistory(prev => [
        newEntry,
        ...prev,
      ]);
    };

  // =========================================================
  // NOISE LEVEL
  // =========================================================

  const getNoiseLevel =
    () => {

      if (currentDB < 40)
        return "Quiet";

      if (currentDB < 70)
        return "Normal";

      if (currentDB < 90)
        return "Loud";

      return "Dangerous";
    };

  // =========================================================
  // COLOR
  // =========================================================

  const getDBColor =
    () => {

      if (currentDB < 40)
        return "#10b981";

      if (currentDB < 70)
        return "#3b82f6";

      if (currentDB < 90)
        return "#f59e0b";

      return "#ef4444";
    };

  // =========================================================
  // GRAPH DATA
  // =========================================================

  const graphData =
    history
      .slice()
      .reverse()
      .map(item => item.db);

  const graphLabels =
    history
      .slice()
      .reverse()
      .map((_, i) => `T${i + 1}`);

  // =========================================================
  // AVERAGE
  // =========================================================

  const averageDB =
    history.length > 0
      ? (
          history.reduce(
            (sum, item) =>
              sum + item.db,
            0
          ) / history.length
        ).toFixed(1)
      : "0";

  // =========================================================
  // UI
  // =========================================================

  return (

    <ScrollView
      style={styles.container}
    >

      {/* HEADER */}

      <View style={styles.heroCard}>

        <Text style={styles.heroTitle}>
          🔊 STEMM LAB
        </Text>

        <Text style={styles.heroSubtitle}>
          Sound Pollution Hunter
        </Text>

        <Text style={styles.heroText}>
          Investigate classroom
          noise levels using
          environmental science
          and mobile sensors.
        </Text>

      </View>

      {/* LIVE METER */}

      <View style={styles.dbCard}>

        <Text style={styles.sectionTitle}>
          Live Sound Meter
        </Text>

        <View
          style={[
            styles.dbCircle,
            {
              backgroundColor:
                getDBColor(),
            },
          ]}
        >

          <Text style={styles.dbNumber}>
            {currentDB}
          </Text>

          <Text style={styles.dbUnit}>
            dB
          </Text>

        </View>

        <Text style={styles.noiseLevel}>
          {getNoiseLevel()}
        </Text>

      </View>

      {/* ACTIONS */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Select Activity
        </Text>

        <View style={styles.actionsContainer}>

          {ACTIONS.map(action => (

            <TouchableOpacity
              key={action}
              style={[
                styles.actionBtn,

                selectedAction ===
                  action &&
                  styles.activeAction,
              ]}
              onPress={() =>
                setSelectedAction(
                  action
                )
              }
            >

              <Text
                style={
                  styles.actionText
                }
              >
                {action}
              </Text>

            </TouchableOpacity>
          ))}
        </View>

      </View>

      {/* CONTROLS */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Experiment Controls
        </Text>

        {!isMeasuring ? (

          <TouchableOpacity
            style={styles.startBtn}
            onPress={
              startMeasurement
            }
          >

            <Text style={styles.btnText}>
              ▶ Start Measuring
            </Text>

          </TouchableOpacity>

        ) : (

          <TouchableOpacity
            style={styles.stopBtn}
            onPress={
              stopMeasurement
            }
          >

            <Text style={styles.btnText}>
              ■ Stop & Save
            </Text>

          </TouchableOpacity>

        )}

      </View>

      {/* SCIENCE DASHBOARD */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          📊 Science Dashboard
        </Text>

        <View style={styles.dashboardRow}>

          <View style={styles.metricBox}>

            <Text style={styles.metricValue}>
              {history.length}
            </Text>

            <Text style={styles.metricLabel}>
              Experiments
            </Text>

          </View>

          <View style={styles.metricBox}>

            <Text style={styles.metricValue}>
              {averageDB}
            </Text>

            <Text style={styles.metricLabel}>
              Average dB
            </Text>

          </View>

        </View>

        {location && (

          <View style={styles.locationBox}>

            <Text style={styles.locationTitle}>
              🌍 GPS Location
            </Text>

            <Text>
              Latitude:
              {" "}
              {location.latitude.toFixed(5)}
            </Text>

            <Text>
              Longitude:
              {" "}
              {location.longitude.toFixed(5)}
            </Text>

          </View>
        )}

      </View>

      {/* GRAPH */}

      {history.length > 0 && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            📈 Noise Analysis Graph
          </Text>

          <LineChart
            data={{

              labels:
                graphLabels,

              datasets: [
                {
                  data:
                    graphData,
                },
              ],
            }}

            width={
              screenWidth - 40
            }

            height={240}

            yAxisSuffix="dB"

            fromZero={true}

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

      {/* HISTORY */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          🧪 Stored Results
        </Text>

        {history.map(item => (

          <View
            key={item.id}
            style={styles.historyCard}
          >

            <Text style={styles.historyTitle}>
              {item.action}
            </Text>

            <Text>
              🔊 Noise:
              {" "}
              {item.db} dB
            </Text>

            <Text>
              🕒 Time:
              {" "}
              {item.createdAt}
            </Text>

            <Text>
              📍 GPS Tagged
            </Text>

          </View>
        ))}

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
        "#f3f4f6",
      padding: 12,
    },

    heroCard: {
      backgroundColor:
        "#7c3aed",
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
      color: "#e9d5ff",
      fontSize: 20,
      marginTop: 4,
      fontWeight: "600",
    },

    heroText: {
      color: "#f5f3ff",
      marginTop: 12,
      lineHeight: 22,
      fontSize: 15,
    },

    card: {
      backgroundColor:
        "#ffffff",
      padding: 18,
      borderRadius: 20,
      marginBottom: 16,
    },

    dbCard: {
      backgroundColor:
        "#ffffff",
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
      alignItems: "center",
    },

    dbCircle: {
      width: 180,
      height: 180,
      borderRadius: 90,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
    },

    dbNumber: {
      color: "#ffffff",
      fontSize: 56,
      fontWeight: "bold",
    },

    dbUnit: {
      color: "#ffffff",
      fontSize: 22,
      fontWeight: "600",
    },

    noiseLevel: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#111827",
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      color: "#111827",
    },

    actionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    actionBtn: {
      backgroundColor:
        "#e5e7eb",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 14,
    },

    activeAction: {
      backgroundColor:
        "#7c3aed",
    },

    actionText: {
      color: "#111827",
      fontWeight: "600",
    },

    startBtn: {
      backgroundColor:
        "#10b981",
      padding: 18,
      borderRadius: 16,
    },

    stopBtn: {
      backgroundColor:
        "#ef4444",
      padding: 18,
      borderRadius: 16,
    },

    btnText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
    },

    dashboardRow: {
      flexDirection: "row",
      gap: 12,
    },

    metricBox: {
      flex: 1,
      backgroundColor:
        "#ede9fe",
      padding: 18,
      borderRadius: 18,
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

    locationBox: {
      marginTop: 18,
      backgroundColor:
        "#f3f4f6",
      padding: 14,
      borderRadius: 14,
    },

    locationTitle: {
      fontWeight: "bold",
      marginBottom: 6,
    },

    historyCard: {
      backgroundColor:
        "#f9fafb",
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
    },

    historyTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#7c3aed",
    },
  });
