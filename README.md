# 🪂 Advanced Parachute Physics Laboratory

A professional-grade mobile physics experimentation platform developed using **React Native**, **Firebase Authentication**, and **SQLite relational databases**.

The application enables users to scientifically analyze parachute experiments and compare real-world atmospheric drag against ideal vacuum physics using accurate Newtonian mechanics and scientific computation.

---

# 📱 Application Overview

The **Advanced Parachute Physics Laboratory** simulates and records free-fall experiments under different drag conditions.

The system provides:

- Secure Firebase authentication
- Per-user relational database storage
- Scientific experiment recording
- Real-time physics calculations
- Vacuum vs drag comparison
- Experimental graph visualization
- Advanced SI-unit calculations

The application was designed to emulate:
- engineering software
- scientific laboratory systems
- research-grade physics tools
- modern mobile scientific interfaces

---

# 🚀 Features

## 🔐 Firebase Authentication

- Secure login/signup
- User-specific experiment databases
- Persistent authentication sessions
- Firebase cloud authentication

---

## 🗄 SQLite Relational Database

- Fully relational local database
- Persistent offline experiment storage
- Per-user isolated records
- Dynamic experiment deletion
- Full database reset/reload functionality

---

# 🧪 Scientific Physics Engine

The application performs scientifically accurate calculations using classical Newtonian mechanics and SI units.

---

## 📘 Perfect Vacuum Fall Time

The ideal free-fall time in a vacuum is calculated using:

$$
t = \sqrt{\frac{2h}{g}}
$$

Where:

- \( t \) = fall time (seconds)
- \( h \) = height (meters)
- \( g \) = gravitational acceleration

---

## 📘 Standard Gravity

The application uses internationally accepted Earth gravity:

$$
g = 9.80665 \ \text{m/s}^2
$$

---

## 📘 Acceleration

Acceleration is derived from:

$$
a = \frac{2h}{t^2}
$$

Where:

- \( a \) = acceleration
- \( h \) = height
- \( t \) = time

---

## 📘 Velocity

Velocity is calculated using:

$$
v = at
$$

---

## 📘 Newton's Second Law

Net force acting on the object:

$$
F = ma
$$

---

## 📘 Drag Force

Atmospheric drag force is estimated using:

$$
F_d = mg - ma
$$

Where:

- \( F_d \) = drag force
- \( mg \) = gravitational force
- \( ma \) = net force

---

## 📘 Momentum

Momentum is calculated using:

$$
p = mv
$$

---

## 📘 Kinetic Energy

Kinetic energy is calculated using:

$$
KE = \frac{1}{2}mv^2
$$

---

## 📘 Relative G-Force

Relative gravitational force is calculated using:

$$
G = \frac{a}{g}
$$

---

## 📘 Experimental Vacuum Difference

The system automatically compares real-world fall time against theoretical vacuum timing:

$$
\Delta t = t_{experimental} - t_{vacuum}
$$

This enables direct scientific analysis of:
- parachute drag
- aerodynamic resistance
- acceleration reduction
- energy loss
- force changes

---

# 🌍 Scientific Accuracy

The application uses full scientific precision for all calculations.

Example perfect vacuum fall for a 1-meter drop:

$$
t = \sqrt{\frac{2(1)}{9.80665}}
$$

$$
t = 0.4515236409 \ \text{seconds}
$$

This allows highly accurate comparison between:
- ideal vacuum conditions
- atmospheric drag
- parachute performance
- aerodynamic efficiency

---

# 📊 Experimental Graphing

The application dynamically visualizes:
- experimental fall time
- drag influence
- parachute performance trends
- trial progression

Graph features include:
- readable Y-axis scaling
- second-based scientific formatting
- chronological left-to-right progression
- professional scientific visualization

---

# 👤 Multi-User Architecture

Each authenticated user has:
- independent experiment storage
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
| Expo | Mobile development environment |
| Firebase Authentication | Secure authentication |
| SQLite | Relational database |
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

## Perfect Vacuum Example

| Metric | Value |
|---|---|
| Experimental Time | 0.4515236409s |
| Vacuum Time | 0.4515236409s |
| Velocity | 4.429446918m/s |
| Acceleration | 9.806650000m/s² |
| Drag Force | 0.000000000N |

---

## Parachute Example

| Metric | Value |
|---|---|
| Experimental Time | 4.000000000s |
| Velocity | 0.500000000m/s |
| Drag Force | 1.937000000N |
| Acceleration Loss | 9.681650000m/s² |

---

# 🎯 Educational Purpose

This project demonstrates:
- mobile software engineering
- relational database systems
- scientific computing
- authentication systems
- experimental data analysis
- data visualization
- physics simulation
- engineering analysis

---

# 🧑‍💻 Author

Developed as a professional engineering and scientific experimentation platform using modern mobile development technologies.

---

# 📜 License

This project is intended for:
- educational use
- scientific experimentation
- engineering demonstrations
- academic assessment

---

# 🏆 Final Notes

The Advanced Parachute Physics Laboratory was designed to emulate professional engineering software while maintaining scientific correctness and modern mobile application architecture.

The system demonstrates:
- accurate physics computation
- scientific precision
- relational database implementation
- secure authentication
- persistent data management
- experimental visualization
- scalable software engineering principles
