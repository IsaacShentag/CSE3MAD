# 🪂 Advanced Parachute Physics Laboratory

A professional-grade mobile physics experimentation platform developed using **React Native**, **Firebase Authentication**, and **SQLite relational databases**.

This application allows users to scientifically analyze parachute experiments and compare real-world drag conditions against ideal vacuum physics using accurate kinematic equations and force calculations.

---

# 📱 Application Overview

The **Advanced Parachute Physics Laboratory** simulates and records experimental free-fall tests for parachute systems under different drag conditions.

Users can:
- authenticate securely
- store experiments locally in a relational SQLite database
- compare vacuum vs drag performance
- visualize results on graphs
- calculate advanced physics metrics automatically

The application is designed to reflect:
- professional engineering software
- scientific laboratory systems
- accurate physics computation
- modern mobile UI/UX practices

---

# 🚀 Features

## 🔐 Firebase Authentication
- Secure user login and signup
- User-specific experiment databases
- Persistent sessions
- Firebase cloud authentication

---

## 🗄 SQLite Relational Database
- Fully relational database structure
- Per-user experiment storage
- Persistent offline storage
- Dynamic record deletion
- Database reload/reset functionality

---

## 🧪 Scientific Physics Engine

The application performs physically accurate calculations using SI units and real-world equations.

### Physics Calculations Include:

| Calculation | Formula |
|---|---|
| Vacuum Fall Time | \( t = \sqrt{\frac{2h}{g}} \) |
| Acceleration | \( a = \frac{2h}{t^2} \) |
| Velocity | \( v = at \) |
| Force | \( F = ma \) |
| Momentum | \( p = mv \) |
| Kinetic Energy | \( KE = \frac{1}{2}mv^2 \) |
| Drag Force | \( F_d = mg - ma \) |
| G-Force | \( \frac{a}{g} \) |

---

# 🌍 Scientific Accuracy

The application uses internationally accepted Earth gravity:

```txt
g = 9.80665 m/s²
```

Vacuum fall timing is automatically calculated using full scientific precision.

Example for a 1-meter drop:

```txt
0.4515236409 seconds
```

This creates extremely accurate comparisons between:
- ideal vacuum conditions
- real atmospheric drag
- parachute resistance

---

# 📊 Experimental Graphing

The application dynamically visualizes:
- experimental fall time
- trial progression
- drag influence trends

Graph improvements include:
- readable Y-axis scaling
- proper second formatting
- left-to-right chronological ordering
- scientific data visualization

---

# 👤 Multi-User Architecture

Each authenticated user has:
- independent stored experiments
- isolated SQLite records
- secure Firebase authentication state

This ensures:
- personalized datasets
- no data overlap
- scalable architecture

---

# 🧠 Technologies Used

| Technology | Purpose |
|---|---|
| React Native | Mobile application framework |
| Expo | Development environment |
| Firebase Authentication | Secure authentication |
| SQLite | Relational local database |
| TypeScript | Type-safe development |
| React Native Chart Kit | Scientific graphing |

---

# 🏗 Database Structure

The SQLite database stores:

| Field | Description |
|---|---|
| uid | Firebase user ID |
| prototype | Prototype category |
| time | Experimental fall time |
| height | Drop height |
| mass | Object mass |
| idealTime | Perfect vacuum time |
| acceleration | Measured acceleration |
| velocity | Final velocity |
| dragForce | Calculated drag |
| kineticEnergy | Energy calculation |
| momentum | Momentum calculation |
| gForce | Relative g-force |
| createdAt | Timestamp |

---

# 📂 Project Structure

```txt
project/
│
├── firebase.js
├── app/
│   └── index.tsx
│
├── package.json
├── README.md
└── assets/
```

---

# ⚙ Installation

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Install SQLite

```bash
npm install expo-sqlite
```

---

## 3. Start Development Server

```bash
npx expo start --clear
```

---

# 🔥 Firebase Setup

Create a Firebase project and enable:
- Authentication
- Email/Password Sign-In

Then configure:

```js
firebase.js
```

with your Firebase credentials.

---

# 🧪 Example Scientific Output

Example vacuum experiment:

| Metric | Value |
|---|---|
| Experimental Time | 0.451523s |
| Vacuum Time | 0.451523s |
| Velocity | 4.429m/s |
| Acceleration | 9.80665m/s² |
| Drag Force | 0.000N |

Example parachute experiment:

| Metric | Value |
|---|---|
| Experimental Time | 4.000s |
| Velocity | 0.500m/s |
| Drag Force | 1.937N |
| Acceleration Loss | 9.681m/s² |

---

# 🎯 Educational Purpose

This project demonstrates:
- mobile software engineering
- relational database systems
- scientific computing
- authentication systems
- data visualization
- physics simulation
- engineering analysis

---

# 🧑‍💻 Author

Developed as an advanced engineering and physics experimentation platform using modern mobile development technologies.

---

# 📜 License

This project is intended for:
- educational use
- scientific experimentation
- engineering demonstrations
- academic assessment

---

# 🏆 Final Notes

The Advanced Parachute Physics Laboratory was designed to emulate professional engineering software while maintaining scientific correctness and modern application architecture.

The system demonstrates:
- accurate physics computation
- relational database implementation
- secure authentication
- persistent data management
- experimental visualization
- scalable software architecture
