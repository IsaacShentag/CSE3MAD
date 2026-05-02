# STEMM Lab Mobile Application

## Overview

STEMM Lab is a React Native mobile application developed for the CSE3MAD Mobile Application Development assessment. The application transforms STEMM learning activities into interactive mobile experiences using mobile sensors, timers, experiment tracking, and data analysis.

The current implementation focuses on the **Parachute Drop Challenge**, where students design and test parachutes while analysing the effects of gravity, drag force, acceleration, and landing safety.

The application allows students to:

- Record parachute experiment data
- Compare multiple parachute designs
- Calculate forces and motion values
- Visualise performance improvements using charts
- Track experiment results across trials

---

# Technologies Used

## Frontend

- React Native
- Expo
- JavaScript
- React Hooks

## Libraries

- react-native-chart-kit
- react-native-svg

## Development Tools

- Node.js
- npm
- Expo Go
- Visual Studio Code

---

# Features

## Experiment Recording

Users can record parachute experiment trials including:

- Time
- Height
- Mass
- Prototype type

---

## Physics Engine

The application automatically calculates:

- Acceleration
- Velocity
- Weight force
- Net force
- Drag force
- G-force
- Ideal freefall time

---

## Prototype Comparison

Users can compare multiple parachute designs using separate tabs.

Supported prototype categories:

- Baseline
- Prototype 1
- Prototype 2
- Prototype 3

---

## Graphing System

The application visualises trial improvement using line graphs.

This allows students to observe:

- Performance consistency
- Design improvements
- Time reductions or increases

---

## Trial Management

Users can:

- Add trials
- Delete trials
- Review previous results
- Compare experiment outcomes

---

# Installation Guide

## Step 1 – Clone Repository

```bash
git clone <repository-url>
```

---

## Step 2 – Install Dependencies

```bash
npm install
```

Install graph dependencies:

```bash
npm install react-native-chart-kit react-native-svg
```

---

## Step 3 – Start Expo

```bash
npx expo start
```

---

## Step 4 – Run on Phone

1. Install Expo Go
2. Connect to the same Wi-Fi network
3. Scan the QR code
4. Launch the app

---

# Building APK

To generate an Android APK build:

```bash
npm install -g eas-cli
```

Login:

```bash
eas login
```

Configure EAS:

```bash
eas build:configure
```

Generate Android build:

```bash
eas build -p android
```

Expo will generate an installable APK or AAB file.

---

# Testing

## Manual Testing

The application was manually tested for:

- Input handling
- Trial recording
- Physics calculations
- Graph rendering
- Prototype switching
- Trial deletion

---

## Device Testing

The application was tested using:

- Expo Go
- Android mobile device
- Web preview

---

# Known Limitations

Current limitations include:

- No persistent database storage
- No Firebase integration
- No real camera/video recording
- No GPS integration yet
- No authentication system

These features may be implemented in future development sprints.

---

# Future Improvements

Potential future improvements include:

- Real-time camera recording
- Firebase cloud storage
- GPS location tagging
- Team leaderboards
- Sensor integration
- Exporting experiment data
- Improved analytics dashboards
- Authentication system
- Offline support

---

# Agile Development Approach

The project follows an Agile-inspired sprint workflow.

Development involved:

- Planning features
- Incremental implementation
- Continuous testing
- Iterative improvements
- Prototype experimentation

---

# Educational Purpose

The application is designed to support:

- STEMM education
- Engineering design thinking
- Data analysis
- Physics learning
- Experiment-based problem solving

The app encourages students to test hypotheses, analyse results, and iteratively improve designs.

---

# Conclusion

STEMM Lab demonstrates how mobile application development can support educational STEMM activities through interactive experimentation, data collection, and real-time analysis.

The current implementation successfully delivers a functional parachute experiment system aligned with the project specification while providing a strong foundation for future feature expansion.
