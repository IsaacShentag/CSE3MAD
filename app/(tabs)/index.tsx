import React, { useEffect, useState } from "react";

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

// FIREBASE AUTH ONLY
import { auth } from "../../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

// ================= SQLITE DATABASE =================

const db = SQLite.openDatabaseSync(
  "parachuteLab.db"
);

const GRAVITY = 9.8;

const DEFAULT_HEIGHT = 1;
const DEFAULT_MASS = 0.2;

const getIdealTime = (h: number) =>
  Math.sqrt((2 * h) / GRAVITY);

const PROTOTYPES = [
  {
    key: "baseline",
    label: "Baseline (Vacuum)",
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
  const [activeTab, setActiveTab] =
    useState("baseline");

  // ================= AUTH =================

  const [username, setUsername] =
    useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] = useState<any>(
    null
  );

  // ================= INPUTS =================

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

  // ================= DATABASE DATA =================

  const [data, setData] = useState<any>({
    baseline: [],
    p1: [],
    p2: [],
    p3: [],
  });

  // ================= CREATE DATABASE TABLE =================

  useEffect(() => {
    createTable();
    loadExperiments();
  }, []);

  const createTable = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS experiments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,

          username TEXT,

          userEmail TEXT,

          prototype TEXT,

          time REAL,

          height REAL,

          mass REAL,

          velocity REAL,

          acceleration REAL,

          weight REAL,

          netForce REAL,

          dragForce REAL,

          timeDiff REAL,

          gForce REAL,

          createdAt TEXT
        );
      `);

      console.log(
        "SQLite table created"
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOAD FROM DATABASE =================

  const loadExperiments = async () => {
    try {
      const rows: any =
        await db.getAllAsync(
          `SELECT * FROM experiments ORDER BY id DESC`
        );

      const groupedData: any = {
        baseline: [],
        p1: [],
        p2: [],
        p3: [],
      };

      rows.forEach((row: any) => {
        if (
          groupedData[row.prototype]
        ) {
          groupedData[
            row.prototype
          ].push(row);
        }
      });

      setData(groupedData);

      console.log(
        "Loaded from SQLite database"
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ================= FIREBASE AUTH =================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
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
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Signup successful");

    } catch (error: any) {
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
      alert(error.message);
    }
  };

  // ================= LOGOUT =================

  const logout = async () => {
    try {
      await signOut(auth);

      alert("Logged out");

    } catch (error: any) {
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

    const dragForce =
      weight - netForce;

    const timeDiff =
      t - idealTime;

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
    };
  };

  // ================= SAVE TO DATABASE =================

  const addExperiment = async () => {
    try {
      const t = parseFloat(time);

      const h = parseFloat(height);

      const m = parseFloat(mass);

      if (isNaN(t) || t <= 0) {
        alert("Invalid time");
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
          username,
          userEmail,
          prototype,
          time,
          height,
          mass,
          velocity,
          acceleration,
          weight,
          netForce,
          dragForce,
          timeDiff,
          gForce,
          createdAt
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          username ||
            "anonymous",

          user?.email ||
            "anonymous",

          activeTab,

          t,

          h,

          m,

          physics.velocity,

          physics.acceleration,

          physics.weight,

          physics.netForce,

          physics.dragForce,

          physics.timeDiff,

          physics.gForce,

          new Date().toISOString(),
        ]
      );

      await loadExperiments();

      setRecorded(false);

      alert(
        "Experiment saved to SQLite database"
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE SINGLE =================

  const deleteExperiment =
    async (id: number) => {
      try {
        await db.runAsync(
          `DELETE FROM experiments WHERE id = ?`,
          [id]
        );

        await loadExperiments();

        alert(
          "Record deleted"
        );

      } catch (error) {
        console.log(error);
      }
    };

  // ================= DELETE ALL =================

  const deleteAllExperiments =
    () => {
      Alert.alert(
        "Delete Database",
        "Delete ALL experiment data and start fresh?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Delete All",
            style:
              "destructive",

            onPress:
              async () => {
                try {
                  await db.runAsync(
                    `DELETE FROM experiments`
                  );

                  await loadExperiments();

                  alert(
                    "Database cleared successfully"
                  );

                } catch (
                  error
                ) {
                  console.log(
                    error
                  );
                }
              },
          },
        ]
      );
    };

  // ================= RESTORE / RELOAD =================

  const restoreDatabase =
    async () => {
      await loadExperiments();

      alert(
        "Database restored/reloaded"
      );
    };

  const getTimes = (arr: any[]) =>
    arr.map(
      (e: any) => e.time
    );

  return (
    <ScrollView
      style={styles.container}
    >
      {/* HEADER */}

      <Text style={styles.header}>
        🪂 Parachute Lab
      </Text>

      {/* ================= AUTH SECTION ================= */}

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

            <Text
              style={
                styles.userText
              }
            >
              Username:{" "}
              {username ||
                "Unknown"}
            </Text>

            <Text
              style={
                styles.userText
              }
            >
              Email:{" "}
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

      {/* ================= DATABASE CONTROL PANEL ================= */}

      <View style={styles.databaseCard}>
        <Text
          style={
            styles.databaseTitle
          }
        >
          🗄 SQLite Database Control Panel
        </Text>

        <Text
          style={
            styles.databaseText
          }
        >
          ✔ Save experiment data
        </Text>

        <Text
          style={
            styles.databaseText
          }
        >
          ✔ Load stored records
        </Text>

        <Text
          style={
            styles.databaseText
          }
        >
          ✔ Delete individual rows
        </Text>

        <Text
          style={
            styles.databaseText
          }
        >
          ✔ Reset entire database
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
            Restore / Reload Database
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
            Delete Entire Database
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= TABS ================= */}

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

      {/* ================= INPUT CARD ================= */}

      <View style={styles.card}>
        <Text
          style={styles.label}
        >
          Time (s)
        </Text>

        <TextInput
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />

        <Text
          style={styles.label}
        >
          Height (m)
        </Text>

        <TextInput
          value={height}
          onChangeText={
            setHeight
          }
          style={styles.input}
        />

        <Text
          style={styles.label}
        >
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
            Save To SQLite Database
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= DATABASE RECORDS ================= */}

      <View style={styles.card}>
        <Text style={styles.title}>
          📦 Stored Database Records
        </Text>

        {data[activeTab]
          .length === 0 ? (
          <Text>
            No experiments stored.
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
                <Text>
                  Database ID:{" "}
                  {item.id}
                </Text>

                <Text>
                  Username:{" "}
                  {
                    item.username
                  }
                </Text>

                <Text>
                  Email:{" "}
                  {
                    item.userEmail
                  }
                </Text>

                <Text>
                  Prototype:{" "}
                  {
                    item.prototype
                  }
                </Text>

                <Text>
                  Time:{" "}
                  {item.time}s
                </Text>

                <Text>
                  Height:{" "}
                  {item.height}m
                </Text>

                <Text>
                  Mass:{" "}
                  {item.mass}kg
                </Text>

                <Text>
                  Created:{" "}
                  {
                    item.createdAt
                  }
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
                    Delete This Record
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )
        )}
      </View>

      {/* ================= GRAPH ================= */}

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
            📈 Trial Improvement
          </Text>

          <LineChart
            data={{
              labels:
                data[
                  activeTab
                ].map(
                  (
                    _: any,
                    i: number
                  ) =>
                    `T${
                      i + 1
                    }`
                ),

              datasets: [
                {
                  data: getTimes(
                    data[
                      activeTab
                    ]
                  ),
                },
              ],
            }}
            width={
              screenWidth -
              20
            }
            height={220}
            chartConfig={
              chartConfig
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom:
    "#fff",

  backgroundGradientTo:
    "#fff",

  decimalPlaces: 3,

  color: () => "#4f46e5",
};

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
      marginBottom: 10,
    },

    card: {
      backgroundColor:
        "#fff",

      padding: 12,

      marginBottom: 10,

      borderRadius: 10,
    },

    databaseCard: {
      backgroundColor:
        "#dbeafe",

      padding: 15,

      borderRadius: 10,

      marginBottom: 10,

      borderWidth: 2,

      borderColor:
        "#2563eb",
    },

    databaseTitle: {
      fontSize: 18,

      fontWeight: "bold",

      marginBottom: 10,

      color: "#1e3a8a",
    },

    databaseText: {
      marginBottom: 6,

      fontSize: 15,
    },

    input: {
      borderWidth: 1,

      padding: 8,

      marginBottom: 6,

      borderRadius: 5,
    },

    label: {
      fontWeight: "600",
    },

    button: {
      backgroundColor:
        "#4f46e5",

      padding: 12,

      marginTop: 5,

      borderRadius: 5,
    },

    restoreBtn: {
      backgroundColor:
        "#0ea5e9",

      padding: 12,

      marginTop: 10,

      borderRadius: 5,
    },

    recordBtn: {
      backgroundColor:
        "#10b981",

      padding: 12,

      marginTop: 5,

      borderRadius: 5,
    },

    logoutBtn: {
      backgroundColor:
        "#ef4444",

      padding: 12,

      marginTop: 10,

      borderRadius: 5,
    },

    buttonText: {
      color: "#fff",

      textAlign: "center",

      fontWeight: "bold",
    },

    tabs: {
      flexDirection: "row",

      marginBottom: 10,
    },

    tab: {
      flex: 1,

      padding: 10,

      backgroundColor:
        "#ccc",
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

      padding: 10,

      borderRadius: 8,
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

    recordCard: {
      borderWidth: 1,

      borderColor:
        "#ddd",

      borderRadius: 8,

      padding: 10,

      marginBottom: 10,

      backgroundColor:
        "#fafafa",
    },
  });
