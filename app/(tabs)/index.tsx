import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const GRAVITY = 9.8;

const DEFAULT_HEIGHT = 1;
const DEFAULT_MASS = 0.2;

const getIdealTime = (h) => Math.sqrt((2 * h) / GRAVITY);

const PROTOTYPES = [
  { key: "baseline", label: "Baseline (Vacuum)" },
  { key: "p1", label: "Prototype 1" },
  { key: "p2", label: "Prototype 2" },
  { key: "p3", label: "Prototype 3" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("baseline");

  const idealTimeExact = getIdealTime(DEFAULT_HEIGHT);

  const [time, setTime] = useState(String(idealTimeExact));
  const [height, setHeight] = useState(String(DEFAULT_HEIGHT));
  const [mass, setMass] = useState(String(DEFAULT_MASS));

  const [recorded, setRecorded] = useState(false);

  const [data, setData] = useState({
    baseline: [],
    p1: [],
    p2: [],
    p3: [],
  });

  // ---------------- RECORD ----------------
  const fakeRecord = () => {
    setRecorded(true);
  };

  // ---------------- PHYSICS ----------------
  const calculatePhysics = (t, h, m) => {
    const idealTime = getIdealTime(h);

    const acceleration = (2 * h) / (t * t);
    const velocity = acceleration * t;

    const weight = m * GRAVITY;
    const netForce = m * acceleration;

    let dragForce = weight - netForce;
    if (Math.abs(dragForce) < 1e-6) dragForce = 0;

    const timeDiff = t - idealTime;
    const gForce = acceleration / GRAVITY;

    return {
      velocity,
      acceleration,
      weight,
      netForce,
      dragForce,
      timeDiff,
      gForce,
      idealTime,
    };
  };

  // ---------------- ADD ----------------
  const addExperiment = () => {
    const t = parseFloat(time);
    const h = parseFloat(height);
    const m = parseFloat(mass);

    if (isNaN(t) || t <= 0) return;

    const physics = calculatePhysics(t, h, m);

    const newExp = {
      id: Date.now(),
      time: t,
      physics,
      recorded,
    };

    setData({
      ...data,
      [activeTab]: [...data[activeTab], newExp],
    });

    setRecorded(false);
  };

  const deleteExperiment = (id) => {
    setData({
      ...data,
      [activeTab]: data[activeTab].filter((e) => e.id !== id),
    });
  };

  const getTimes = (arr) => arr.map((e) => e.time);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🪂 Parachute Lab</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        {PROTOTYPES.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.tab,
              activeTab === p.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(p.key)}
          >
            <Text style={styles.tabText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* INPUT */}
      <View style={styles.card}>
        <Text style={styles.label}>Time (s)</Text>
        <TextInput value={time} onChangeText={setTime} style={styles.input} />

        <Text style={styles.label}>Height (m)</Text>
        <TextInput value={height} onChangeText={setHeight} style={styles.input} />

        <Text style={styles.label}>Mass (kg)</Text>
        <TextInput value={mass} onChangeText={setMass} style={styles.input} />

        <TouchableOpacity style={styles.recordBtn} onPress={fakeRecord}>
          <Text style={styles.buttonText}>
            {recorded ? "Recorded ✔" : "Record Experiment"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={addExperiment}>
          <Text style={styles.buttonText}>Add Trial</Text>
        </TouchableOpacity>
      </View>

      {/* GRAPH AFTER INPUT */}
      {data[activeTab].length > 0 && (
        <View style={styles.card}>
          <Text style={styles.title}>📈 Trial Improvement</Text>

          <LineChart
            data={{
              labels: data[activeTab].map((_, i) => `T${i + 1}`),
              datasets: [{ data: getTimes(data[activeTab]) }],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={chartConfig}
          />
        </View>
      )}

      {/* RESULTS (LATEST FIRST) */}
      {[...data[activeTab]].reverse().map((e, i) => (
        <View key={e.id} style={styles.card}>
          <Text style={styles.title}>
            Trial {data[activeTab].length - i}
          </Text>

          {e.recorded && <Text style={{ color: "green" }}>📹 Recorded</Text>}

          {/* IDEAL */}
          <Text style={styles.section}>Ideal (Vacuum)</Text>
          <Text>Time: {e.physics.idealTime.toFixed(6)} s</Text>
          <Text>Drag Force: 0.000000 N</Text>

          {/* EXPERIMENT */}
          <Text style={styles.section}>Experiment</Text>

          <Text>Weight: {e.physics.weight.toFixed(6)} N</Text>
          <Text>Net Force: {e.physics.netForce.toFixed(6)} N</Text>

          <Text style={{ fontWeight: "bold" }}>
            Drag Force: {e.physics.dragForce.toFixed(6)} N
          </Text>

          <Text>
            Time Difference: {e.physics.timeDiff.toFixed(6)} s
          </Text>

          <Text>Acceleration: {e.physics.acceleration.toFixed(6)} m/s²</Text>
          <Text>Velocity: {e.physics.velocity.toFixed(6)} m/s</Text>
          <Text>G-Force: {e.physics.gForce.toFixed(6)} g</Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteExperiment(e.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 6,
  color: () => "#4f46e5",
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 22, fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },

  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 6,
  },

  label: { fontWeight: "600" },

  section: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#4f46e5",
  },

  button: {
    backgroundColor: "#4f46e5",
    padding: 10,
    marginTop: 5,
  },

  recordBtn: {
    backgroundColor: "#10b981",
    padding: 10,
    marginTop: 5,
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    marginTop: 6,
  },

  buttonText: { color: "#fff", textAlign: "center" },

  tabs: { flexDirection: "row", marginBottom: 10 },

  tab: { flex: 1, padding: 10, backgroundColor: "#ccc" },
  activeTab: { backgroundColor: "#4f46e5" },

  tabText: { color: "#fff", textAlign: "center" },

  title: { fontWeight: "bold" },
});
