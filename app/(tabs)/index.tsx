import React, { useEffect, useState } from "react";

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

// FIREBASE
import { auth, db } from "../../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  addDoc,
} from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

const GRAVITY = 9.8;

const DEFAULT_HEIGHT = 1;
const DEFAULT_MASS = 0.2;

const getIdealTime = (h: number) =>
  Math.sqrt((2 * h) / GRAVITY);

const PROTOTYPES = [
  { key: "baseline", label: "Baseline (Vacuum)" },
  { key: "p1", label: "Prototype 1" },
  { key: "p2", label: "Prototype 2" },
  { key: "p3", label: "Prototype 3" },
];

export default function App() {
  const [activeTab, setActiveTab] =
    useState("baseline");

  // AUTH
  const [username, setUsername] =
    useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] = useState<any>(null);

  // LAB DATA
  const idealTimeExact =
    getIdealTime(DEFAULT_HEIGHT);

  const [time, setTime] = useState(
    String(idealTimeExact)
  );

  const [height, setHeight] = useState(
    String(DEFAULT_HEIGHT)
  );

  const [mass, setMass] = useState(
    String(DEFAULT_MASS)
  );

  const [recorded, setRecorded] =
    useState(false);

  const [data, setData] = useState({
    baseline: [],
    p1: [],
    p2: [],
    p3: [],
  });

  // ================= AUTH STATE =================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return unsubscribe;
  }, []);

  // ================= SIGNUP =================

  const signUp = async () => {
    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await addDoc(
        collection(db, "users"),
        {
          uid: userCredential.user.uid,
          username: username,
          email: email,
          createdAt:
            new Date().toISOString(),
        }
      );

      alert("Signup successful");

    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  // ================= LOGIN =================

  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful");

    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  // ================= LOGOUT =================

  const logout = async () => {
    try {
      await signOut(auth);

      alert("Logged out");

    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  // ================= RECORD =================

  const fakeRecord = () => {
    setRecorded(true);
  };

  // ================= PHYSICS =================

  const calculatePhysics = (
    t: number,
    h: number,
    m: number
  ) => {
    const idealTime = getIdealTime(h);

    const acceleration =
      (2 * h) / (t * t);

    const velocity = acceleration * t;

    const weight = m * GRAVITY;

    const netForce =
      m * acceleration;

    let dragForce =
      weight - netForce;

    if (Math.abs(dragForce) < 1e-6) {
      dragForce = 0;
    }

    const timeDiff = t - idealTime;

    const gForce =
      acceleration / GRAVITY;

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

  // ================= SAVE FIRESTORE =================

  const saveToFirestore = async (
    experiment: any
  ) => {
    try {
      await addDoc(
        collection(db, "experiments"),
        experiment
      );

      console.log(
        "Saved to Firestore"
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ================= ADD EXPERIMENT =================

  const addExperiment = async () => {
    const t = parseFloat(time);

    const h = parseFloat(height);

    const m = parseFloat(mass);

    if (isNaN(t) || t <= 0)
      return;

    const physics =
      calculatePhysics(t, h, m);

    const newExp = {
      id: Date.now(),

      username:
        username || "anonymous",

      userEmail:
        user?.email || "anonymous",

      prototype: activeTab,

      time: t,

      height: h,

      mass: m,

      physics,

      recorded,

      createdAt:
        new Date().toISOString(),
    };

    setData({
      ...data,

      [activeTab]: [
        ...data[activeTab],
        newExp,
      ],
    });

    await saveToFirestore(newExp);

    setRecorded(false);
  };

  // ================= DELETE =================

  const deleteExperiment = (
    id: number
  ) => {
    setData({
      ...data,

      [activeTab]:
        data[activeTab].filter(
          (e: any) => e.id !== id
        ),
    });
  };

  const getTimes = (arr: any[]) =>
    arr.map((e) => e.time);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        🪂 Parachute Lab
      </Text>

      {/* ================= AUTH CARD ================= */}

      <View style={styles.card}>
        <Text style={styles.title}>
          Firebase Authentication
        </Text>

        {user ? (
          // ================= LOGGED IN =================
          <View style={styles.loggedInBox}>

            <Text style={styles.loggedInText}>
              ✅ Logged In
            </Text>

            <Text style={styles.userText}>
              Username: {username}
            </Text>

            <Text style={styles.userText}>
              Email: {user.email}
            </Text>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={logout}
            >
              <Text style={styles.buttonText}>
                Logout
              </Text>
            </TouchableOpacity>

          </View>
        ) : (
          // ================= LOGGED OUT =================
          <>

            <Text
              style={{
                color: "red",
                marginBottom: 10,
              }}
            >
              ❌ Not Logged In
            </Text>

            {/* USERNAME */}
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />

            {/* EMAIL */}
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            {/* PASSWORD */}
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            {/* SIGNUP */}
            <TouchableOpacity
              style={styles.button}
              onPress={signUp}
            >
              <Text style={styles.buttonText}>
                Sign Up
              </Text>
            </TouchableOpacity>

            {/* LOGIN */}
            <TouchableOpacity
              style={styles.recordBtn}
              onPress={login}
            >
              <Text style={styles.buttonText}>
                Login
              </Text>
            </TouchableOpacity>

          </>
        )}
      </View>

      {/* ================= TABS ================= */}

      <View style={styles.tabs}>
        {PROTOTYPES.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.tab,
              activeTab === p.key &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(p.key)
            }
          >
            <Text style={styles.tabText}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= INPUT ================= */}

      <View style={styles.card}>

        <Text style={styles.label}>
          Time (s)
        </Text>

        <TextInput
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />

        <Text style={styles.label}>
          Height (m)
        </Text>

        <TextInput
          value={height}
          onChangeText={setHeight}
          style={styles.input}
        />

        <Text style={styles.label}>
          Mass (kg)
        </Text>

        <TextInput
          value={mass}
          onChangeText={setMass}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.recordBtn}
          onPress={fakeRecord}
        >
          <Text style={styles.buttonText}>
            {recorded
              ? "Recorded ✔"
              : "Record Experiment"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={addExperiment}
        >
          <Text style={styles.buttonText}>
            Add Trial
          </Text>
        </TouchableOpacity>

      </View>

      {/* ================= GRAPH ================= */}

      {data[activeTab].length > 0 && (
        <View style={styles.card}>

          <Text style={styles.title}>
            📈 Trial Improvement
          </Text>

          <LineChart
            data={{
              labels:
                data[activeTab].map(
                  (_, i) => `T${i + 1}`
                ),

              datasets: [
                {
                  data: getTimes(
                    data[activeTab]
                  ),
                },
              ],
            }}

            width={screenWidth - 20}

            height={220}

            chartConfig={chartConfig}
          />

        </View>
      )}
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

  container: {
    flex: 1,
    padding: 10,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
  },

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

  label: {
    fontWeight: "600",
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

  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 10,
  },

  tab: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ccc",
  },

  activeTab: {
    backgroundColor: "#4f46e5",
  },

  tabText: {
    color: "#fff",
    textAlign: "center",
  },

  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  loggedInBox: {
    backgroundColor: "#d1fae5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  loggedInText: {
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
  },

  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
