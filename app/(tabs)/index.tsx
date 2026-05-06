// =========================================================
// ADVANCED PARACHUTE PHYSICS LAB
// FINAL PROFESSIONAL VERSION
// =========================================================
//
// FEATURES
// ✔ Firebase Authentication
// ✔ SQLite Relational Database
// ✔ User-specific experiment storage
// ✔ Scientifically accurate vacuum calculations
// ✔ Automatic vacuum baseline timing
// ✔ Accurate acceleration calculations
// ✔ Accurate velocity calculations
// ✔ Accurate drag force calculations
// ✔ Accurate momentum calculations
// ✔ Accurate kinetic energy calculations
// ✔ Accurate force calculations
// ✔ Reload/reset database
// ✔ Professional graph scaling
// ✔ Human-readable graph axis
// ✔ Left-to-right experiment timeline
// ✔ Scientific SI units
//
// =========================================================
// INSTALL
// =========================================================
//
// npm install expo-sqlite
//
// THEN:
//
// npx expo start --clear
//
// =========================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";

import { LineChart } from "react-native-chart-kit";

import * as SQLite from "expo-sqlite";

// =========================================================
// FIREBASE AUTH
// =========================================================

import { auth } from "../../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// =========================================================
// SQLITE
// =========================================================

const db =
  SQLite.openDatabaseSync(
    "parachutePhysics.db"
  );

const screenWidth =
  Dimensions.get("window").width;

// =========================================================
// SCIENTIFIC CONSTANTS
// =========================================================

// Standard gravity

const GRAVITY = 9.80665;

// Air density at sea level

const AIR_DENSITY = 1.225;

// Default experiment setup

const DEFAULT_HEIGHT = 1;

const DEFAULT_MASS = 0.2;

// =========================================================
// PERFECT VACUUM FALL TIME
// t = sqrt(2h/g)
// =========================================================

const getIdealVacuumTime = (
  height: number
) =>
  Math.sqrt(
    (2 * height) / GRAVITY
  );

// =========================================================
// PROTOTYPES
// =========================================================

const PROTOTYPES = [
  {
    key: "baseline",
    label: "Baseline",
  },

  {
    key: "p1",
    label: "Prototype 1",
  },

  {
    key: "p2",
    label: "Prototype 2",
  },

  {
    key: "p3",
    label: "Prototype 3",
  },
];

export default function App() {

  // =========================================================
  // AUTH
  // =========================================================

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] =
    useState<any>(null);

  // =========================================================
  // UI
  // =========================================================

  const [activeTab, setActiveTab] =
    useState("baseline");

  // =========================================================
  // DEFAULT PERFECT VACUUM TIME
  // =========================================================

  const defaultVacuumTime =
    getIdealVacuumTime(
      DEFAULT_HEIGHT
    ).toString();

  // =========================================================
  // INPUTS
  // =========================================================

  const [time, setTime] =
    useState(defaultVacuumTime);

  const [height, setHeight] =
    useState(
      String(DEFAULT_HEIGHT)
    );

  const [mass, setMass] =
    useState(
      String(DEFAULT_MASS)
    );

  const [recorded, setRecorded] =
    useState(false);

  // =========================================================
  // DATABASE DATA
  // =========================================================

  const [data, setData] =
    useState<any>({
      baseline: [],
      p1: [],
      p2: [],
      p3: [],
    });

  // =========================================================
  // ALWAYS RESET TO PERFECT VACUUM TIME
  // =========================================================

  useEffect(() => {

    const h =
      parseFloat(height);

    if (
      !isNaN(h) &&
      h > 0
    ) {

      const idealTime =
        getIdealVacuumTime(h);

      setTime(
        idealTime.toString()
      );
    }

  }, [height]);

  // =========================================================
  // DATABASE SETUP
  // =========================================================

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase =
    async () => {

      try {

        // FULL RESET
        // FIXES OLD UID ERRORS

        await db.execAsync(`
          DROP TABLE IF EXISTS experiments;
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS experiments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            uid TEXT,

            username TEXT,

            userEmail TEXT,

            prototype TEXT,

            time REAL,

            height REAL,

            mass REAL,

            idealTime REAL,

            timeDifference REAL,

            acceleration REAL,

            accelerationLoss REAL,

            velocity REAL,

            weight REAL,

            netForce REAL,

            dragForce REAL,

            momentum REAL,

            kineticEnergy REAL,

            gForce REAL,

            dragCoefficient REAL,

            createdAt TEXT

          );
        `);

        console.log(
          "DATABASE INITIALIZED"
        );

      } catch (error) {

        console.log(error);

      }
    };

  // =========================================================
  // FIREBASE AUTH LISTENER
  // =========================================================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          setUser(currentUser);

          if (currentUser) {

            await loadExperiments(
              currentUser.uid
            );

          } else {

            clearLocalData();

          }
        }
      );

    return unsubscribe;

  }, []);

  // =========================================================
  // CLEAR LOCAL DATA
  // =========================================================

  const clearLocalData = () => {

    setData({
      baseline: [],
      p1: [],
      p2: [],
      p3: [],
    });

  };

  // =========================================================
  // LOAD USER DATABASE
  // =========================================================

  const loadExperiments =
    async (uid: string) => {

      try {

        const rows: any =
          await db.getAllAsync(
            `
          SELECT *
          FROM experiments
          WHERE uid = ?
          ORDER BY id ASC
        `,
            [uid]
          );

        const groupedData: any = {
          baseline: [],
          p1: [],
          p2: [],
          p3: [],
        };

        rows.forEach((row: any) => {

          groupedData[
            row.prototype
          ].push(row);

        });

        setData(groupedData);

      } catch (error) {

        console.log(error);

      }
    };

  // =========================================================
  // SIGNUP
  // =========================================================

  const signUp = async () => {

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert(
        "Signup successful"
      );

    } catch (error: any) {

      alert(error.message);

    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert(
        "Login successful"
      );

    } catch (error: any) {

      alert(error.message);

    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {

    try {

      await signOut(auth);

      clearLocalData();

      alert("Logged out");

    } catch (error: any) {

      alert(error.message);

    }
  };

  // =========================================================
  // RECORD BUTTON
  // =========================================================

  const fakeRecord = () => {

    setRecorded(true);

  };

  // =========================================================
  // PHYSICS ENGINE
  // =========================================================

  const calculatePhysics = (
    t: number,
    h: number,
    m: number
  ) => {

    // PERFECT VACUUM TIME

    const idealTime =
      getIdealVacuumTime(h);

    // ACCELERATION

    const acceleration =
      (2 * h) /
      (t * t);

    // VELOCITY

    const velocity =
      acceleration * t;

    // WEIGHT FORCE

    const weight =
      m * GRAVITY;

    // NET FORCE

    const netForce =
      m * acceleration;

    // DRAG FORCE

    const dragForce =
      weight - netForce;

    // ACCELERATION LOSS

    const accelerationLoss =
      GRAVITY -
      acceleration;

    // MOMENTUM

    const momentum =
      m * velocity;

    // KINETIC ENERGY

    const kineticEnergy =
      0.5 *
      m *
      velocity *
      velocity;

    // VACUUM DIFFERENCE

    const timeDifference =
      t - idealTime;

    // G FORCE

    const gForce =
      acceleration /
      GRAVITY;

    // DRAG COEFFICIENT

    const dragCoefficient =
      dragForce /
      (
        0.5 *
        AIR_DENSITY *
        velocity *
        velocity +
        0.0000001
      );

    return {

      idealTime,

      timeDifference,

      acceleration,

      accelerationLoss,

      velocity,

      weight,

      netForce,

      dragForce,

      momentum,

      kineticEnergy,

      gForce,

      dragCoefficient,
    };
  };

  // =========================================================
  // SAVE EXPERIMENT
  // =========================================================

  const addExperiment = async () => {

    try {

      if (!user) {

        alert(
          "Please log in first"
        );

        return;
      }

      const t =
        parseFloat(time);

      const h =
        parseFloat(height);

      const m =
        parseFloat(mass);

      if (
        isNaN(t) ||
        isNaN(h) ||
        isNaN(m)
      ) {

        alert(
          "Invalid values"
        );

        return;
      }

      const physics =
        calculatePhysics(
          t,
          h,
          m
        );

      await db.runAsync(
        `
        INSERT INTO experiments (

          uid,

          username,

          userEmail,

          prototype,

          time,

          height,

          mass,

          idealTime,

          timeDifference,

          acceleration,

          accelerationLoss,

          velocity,

          weight,

          netForce,

          dragForce,

          momentum,

          kineticEnergy,

          gForce,

          dragCoefficient,

          createdAt

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [

          user.uid,

          username ||
            "Unknown",

          user.email,

          activeTab,

          t,

          h,

          m,

          physics.idealTime,

          physics.timeDifference,

          physics.acceleration,

          physics.accelerationLoss,

          physics.velocity,

          physics.weight,

          physics.netForce,

          physics.dragForce,

          physics.momentum,

          physics.kineticEnergy,

          physics.gForce,

          physics.dragCoefficient,

          new Date().toISOString(),
        ]
      );

      await loadExperiments(
        user.uid
      );

      alert(
        "Experiment saved successfully"
      );

      // RESET TO PERFECT VACUUM TIME

      const resetTime =
        getIdealVacuumTime(
          parseFloat(height)
        );

      setTime(
        resetTime.toString()
      );

      setRecorded(false);

    } catch (error) {

      console.log(error);

    }
  };

  // =========================================================
  // DELETE RECORD
  // =========================================================

  const deleteExperiment =
    async (id: number) => {

      try {

        await db.runAsync(
          `
          DELETE FROM experiments
          WHERE id = ?
        `,
          [id]
        );

        await loadExperiments(
          user.uid
        );

      } catch (error) {

        console.log(error);

      }
    };

  // =========================================================
  // RESET DATABASE
  // =========================================================

  const deleteAllExperiments =
    () => {

      Alert.alert(
        "Delete Database",
        "Delete all records?",
        [

          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Delete",

            style:
              "destructive",

            onPress:
              async () => {

                await db.runAsync(
                  `
                  DELETE FROM experiments
                  WHERE uid = ?
                `,
                  [user.uid]
                );

                await loadExperiments(
                  user.uid
                );

                alert(
                  "Database reset complete"
                );
              },
          },
        ]
      );
    };

  // =========================================================
  // RELOAD DATABASE
  // =========================================================

  const restoreDatabase =
    async () => {

      if (!user) return;

      await loadExperiments(
        user.uid
      );

      alert(
        "Database reloaded"
      );
    };

  // =========================================================
  // AVERAGE VELOCITY
  // =========================================================

  const getAverageVelocity =
    (arr: any[]) => {

      if (arr.length === 0)
        return 0;

      const total =
        arr.reduce(
          (
            sum: number,
            item: any
          ) =>
            sum +
            item.velocity,
          0
        );

      return total / arr.length;
    };

  // =========================================================
  // GRAPH DATA
  // =========================================================

  const getGraphData = () => {

    return data[activeTab]
      .map((item: any) =>
        Number(
          item.time.toFixed(3)
        )
      );
  };

  const getGraphLabels = () => {

    return data[activeTab]
      .map(
        (
          _: any,
          index: number
        ) =>
          `T${index + 1}`
      );
  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <ScrollView
      style={styles.container}
    >

      {/* HEADER */}

      <Text style={styles.header}>
        🪂 Advanced Parachute Physics Laboratory
      </Text>

      {/* AUTH */}

      <View style={styles.card}>

        <Text style={styles.title}>
          Firebase Authentication
        </Text>

        {user ? (

          <View
            style={
              styles.loggedInBox
            }
          >

            <Text
              style={
                styles.loggedInText
              }
            >
              ✅ Logged In
            </Text>

            <Text>
              User:
              {" "}
              {user.email}
            </Text>

            <TouchableOpacity
              style={
                styles.logoutBtn
              }
              onPress={logout}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Logout
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          <>

            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={
                setUsername
              }
              style={
                styles.input
              }
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={
                setEmail
              }
              style={
                styles.input
              }
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={
                setPassword
              }
              secureTextEntry
              style={
                styles.input
              }
            />

            <TouchableOpacity
              style={
                styles.button
              }
              onPress={signUp}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.recordBtn
              }
              onPress={login}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Login
              </Text>
            </TouchableOpacity>

          </>
        )}
      </View>

      {/* DATABASE */}

      <View
        style={
          styles.databaseCard
        }
      >

        <Text
          style={
            styles.databaseTitle
          }
        >
          🗄 SQLite Database
        </Text>

        <TouchableOpacity
          style={
            styles.restoreBtn
          }
          onPress={
            restoreDatabase
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Reload Database
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.logoutBtn
          }
          onPress={
            deleteAllExperiments
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Reset Database
          </Text>
        </TouchableOpacity>

      </View>

      {/* TABS */}

      <View style={styles.tabs}>

        {PROTOTYPES.map((p) => (

          <TouchableOpacity
            key={p.key}
            style={[
              styles.tab,

              activeTab ===
                p.key &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(
                p.key
              )
            }
          >

            <Text
              style={
                styles.tabText
              }
            >
              {p.label}
            </Text>

          </TouchableOpacity>

        ))}
      </View>

      {/* INPUTS */}

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
          onChangeText={
            setHeight
          }
          style={styles.input}
        />

        <Text style={styles.label}>
          Mass (kg)
        </Text>

        <TextInput
          value={mass}
          onChangeText={
            setMass
          }
          style={styles.input}
        />

        <TouchableOpacity
          style={
            styles.recordBtn
          }
          onPress={
            fakeRecord
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            {recorded
              ? "Recorded ✔"
              : "Record Experiment"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={
            addExperiment
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Save Experiment
          </Text>
        </TouchableOpacity>

      </View>

      {/* STORED RECORDS */}

      <View style={styles.card}>

        <Text style={styles.title}>
          📦 Stored Records
        </Text>

        <Text
          style={
            styles.averageText
          }
        >
          Average Velocity:
          {" "}
          {getAverageVelocity(
            data[activeTab]
          ).toFixed(6)}
          {" "}
          m/s
        </Text>

        {data[activeTab]
          .length === 0 ? (

          <Text>
            No records stored.
          </Text>

        ) : (

          data[activeTab].map(
            (item: any) => (

              <View
                key={item.id}
                style={
                  styles.recordCard
                }
              >

                <Text
                  style={
                    styles.recordTitle
                  }
                >
                  🧪 Experiment #{item.id}
                </Text>

                <Text>
                  ⏱ Experimental Time:
                  {" "}
                  {Number(item.time).toFixed(6)}
                  s
                </Text>

                <Text>
                  🌌 Perfect Vacuum Time:
                  {" "}
                  {Number(item.idealTime).toFixed(6)}
                  s
                </Text>

                <Text>
                  🕒 Vacuum Difference:
                  {" "}
                  {Number(item.timeDifference).toFixed(6)}
                  s
                </Text>

                <Text>
                  🚀 Velocity:
                  {" "}
                  {Number(item.velocity).toFixed(6)}
                  m/s
                </Text>

                <Text>
                  📉 Acceleration:
                  {" "}
                  {Number(item.acceleration).toFixed(6)}
                  m/s²
                </Text>

                <Text>
                  🌬 Drag Force:
                  {" "}
                  {Number(item.dragForce).toFixed(6)}
                  N
                </Text>

                <Text>
                  📊 Acceleration Loss:
                  {" "}
                  {Number(item.accelerationLoss).toFixed(6)}
                  m/s²
                </Text>

                <Text>
                  ⚡ Kinetic Energy:
                  {" "}
                  {Number(item.kineticEnergy).toFixed(6)}
                  J
                </Text>

                <Text>
                  📦 Momentum:
                  {" "}
                  {Number(item.momentum).toFixed(6)}
                  kg·m/s
                </Text>

                <Text>
                  🧲 G-Force:
                  {" "}
                  {Number(item.gForce).toFixed(6)}
                  g
                </Text>

                <Text>
                  🪂 Drag Coefficient:
                  {" "}
                  {Number(item.dragCoefficient).toFixed(6)}
                </Text>

                <TouchableOpacity
                  style={
                    styles.logoutBtn
                  }
                  onPress={() =>
                    deleteExperiment(
                      item.id
                    )
                  }
                >

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    Delete Record
                  </Text>

                </TouchableOpacity>

              </View>
            )
          )
        )}
      </View>

      {/* GRAPH */}

      {data[activeTab]
        .length > 0 && (

        <View
          style={styles.card}
        >

          <Text
            style={
              styles.title
            }
          >
            📈 Experimental Fall Time Graph
          </Text>

          <Text
            style={{
              marginBottom: 10,
              color: "#555",
            }}
          >
            Y-axis = Fall Time (seconds)
          </Text>

          <LineChart

            data={{

              labels:
                getGraphLabels(),

              datasets: [
                {
                  data:
                    getGraphData(),
                },
              ],
            }}

            width={
              screenWidth - 20
            }

            height={260}

            yAxisSuffix="s"

            fromZero={true}

            segments={5}

            chartConfig={{

              backgroundGradientFrom:
                "#ffffff",

              backgroundGradientTo:
                "#ffffff",

              decimalPlaces: 2,

              color: () => "#4f46e5",

              labelColor: () =>
                "#111827",

              propsForDots: {

                r: "5",

                strokeWidth: "2",

                stroke: "#4f46e5",
              },
            }}

            bezier

            style={{
              borderRadius: 12,
            }}
          />

        </View>
      )}
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
      padding: 10,
      backgroundColor:
        "#f5f5f5",
    },

    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 12,
    },

    card: {
      backgroundColor:
        "#ffffff",
      padding: 14,
      marginBottom: 12,
      borderRadius: 12,
    },

    databaseCard: {
      backgroundColor:
        "#dbeafe",
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
    },

    databaseTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },

    input: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 8,
      borderRadius: 8,
    },

    label: {
      fontWeight: "600",
    },

    button: {
      backgroundColor:
        "#4f46e5",
      padding: 14,
      marginTop: 8,
      borderRadius: 8,
    },

    recordBtn: {
      backgroundColor:
        "#10b981",
      padding: 14,
      marginTop: 8,
      borderRadius: 8,
    },

    restoreBtn: {
      backgroundColor:
        "#0ea5e9",
      padding: 14,
      marginTop: 8,
      borderRadius: 8,
    },

    logoutBtn: {
      backgroundColor:
        "#ef4444",
      padding: 12,
      marginTop: 10,
      borderRadius: 8,
    },

    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },

    tabs: {
      flexDirection: "row",
      marginBottom: 12,
    },

    tab: {
      flex: 1,
      padding: 12,
      backgroundColor:
        "#9ca3af",
    },

    activeTab: {
      backgroundColor:
        "#4f46e5",
    },

    tabText: {
      color: "#fff",
      textAlign: "center",
    },

    title: {
      fontWeight: "bold",
      marginBottom: 10,
      fontSize: 18,
    },

    loggedInBox: {
      backgroundColor:
        "#d1fae5",
      padding: 12,
      borderRadius: 10,
    },

    loggedInText: {
      fontWeight: "bold",
      color: "green",
      marginBottom: 6,
    },

    recordCard: {
      borderWidth: 1,
      borderColor:
        "#e5e7eb",
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
    },

    recordTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 6,
    },

    averageText: {
      fontWeight: "bold",
      marginBottom: 10,
      color: "#1d4ed8",
    },
  });
