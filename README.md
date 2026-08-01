# 🌾 FASALRAKSHA

### AI-Powered Non-Invasive Animal Intrusion Detection, Risk Assessment & Smart Crop Protection System

> **Protecting Crops • Protecting Animals • Empowering Farmers**

---

## 📖 Overview

FASALRAKSHA is an AI-powered smart farm monitoring and crop protection platform designed to safeguard agricultural fields from stray and grazing animals through real-time Computer Vision, intelligent risk assessment, and non-invasive deterrent mechanisms.

The platform utilizes a YOLO-based object detection model to identify approaching animals using a live webcam feed. Based on the detected animal, confidence score, and contextual information, an intelligent decision engine evaluates the level of threat and recommends appropriate mitigation strategies such as LED strobes, high-frequency acoustic deterrents, and automated water sprayers.

Unlike conventional electric fencing ("Zatka" machines), FASALRAKSHA focuses on protecting crops while ensuring the safety of livestock, wildlife, and farm workers through affordable, intelligent, and animal-friendly technology.

---

# 🎯 Problem Statement

Farmers across agricultural regions suffer significant crop losses due to intrusion by stray and grazing animals including cows, buffaloes, goats, and wild pigs.

Traditional protection methods such as temporary fencing or electric shock fences are either ineffective, expensive, or hazardous to animals and humans.

FASALRAKSHA addresses this challenge by providing an AI-powered monitoring system capable of early animal detection, intelligent threat assessment, automated deterrent recommendations, and real-time farmer notifications while eliminating the need for harmful fencing solutions.

---

# 🚀 Proposed Solution

FASALRAKSHA integrates Artificial Intelligence, Computer Vision, and Smart Farm Monitoring into a unified web platform.

The system continuously observes farm boundaries through a live camera feed, detects approaching animals using a YOLO object detection model, evaluates the intrusion risk through a decision engine, recommends the safest non-invasive deterrent mechanism, alerts farmers instantly, and maintains a complete history of intrusion events for future analysis.

---

# ✨ Key Features

## 🌐 Modern Landing Website

* Modern AgriTech inspired landing page
* Product overview
* Interactive workflow explanation
* System architecture
* Feature showcase
* Technology stack
* Demo credentials
* Fully responsive interface

---

## 🎥 Live Farm Monitoring

* Live webcam integration
* Continuous farm surveillance
* Real-time AI monitoring
* Live detection visualization
* Bounding box overlays
* Confidence score display

---

## 🤖 AI Animal Detection

Powered by **YOLO Object Detection**

* Real-time animal detection
* Live camera prediction
* Multiple livestock support
* Bounding box generation
* Confidence score estimation
* Fast inference pipeline

Supported animals include:

* Cow
* Buffalo
* Goat
* Wild Pig
* Additional livestock classes (expandable)

---

## ⚠️ Intelligent Risk Assessment

The Decision Engine evaluates:

* Animal type
* Detection confidence
* Estimated proximity
* Threat level
* Recommended deterrent strategy

Risk Categories

* 🟢 Low
* 🟡 Medium
* 🔴 High

---

## 🎛 Smart Mitigation Control Panel

Supports both:

### Automatic Mode

The system automatically recommends the most appropriate deterrent mechanism based on AI detection results.

### Manual Mode

Farmers can manually operate deterrent devices.

Available controls:

* 💡 LED Strobe Lights
* 🔊 High Frequency Sound System
* 💧 Water Sprayer
* Emergency Stop
* Activate All Devices

---

## 📱 Smart Alert System

Receive instant notifications containing:

* Animal detected
* Detection confidence
* Risk level
* Detection timestamp
* Recommended mitigation
* Farmer action prompt

---

## 📜 Detection History

Maintain a complete record of every intrusion event.

Stored information includes:

* Animal detected
* Date
* Time
* Confidence score
* Risk level
* Recommended mitigation
* System status

---

## 📊 Interactive Dashboard

A centralized monitoring dashboard providing:

* Farm Overview
* Live Monitoring
* AI Detection
* Smart Mitigation Panel
* Active Alerts
* Detection History
* Device Status
* System Health

---

# ⚙️ System Workflow

```text
Live Camera
      │
      ▼
YOLO Object Detection
      │
      ▼
Animal Classification
      │
      ▼
Confidence Score
      │
      ▼
Decision Engine
      │
      ▼
Risk Assessment
      │
      ▼
Recommended Mitigation
      │
      ▼
LED / Sound / Water Sprayer
      │
      ▼
Farmer Notification
      │
      ▼
Detection History
```

---

# 🏗 System Architecture

```text
                     Live Camera
                          │
                          ▼
                YOLO Object Detection
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
 Animal Classification              Confidence Score
        │
        ▼
 Intelligent Decision Engine
        │
        ▼
 Risk Assessment Module
        │
        ▼
 Smart Mitigation Recommendation
        │
 ┌──────┼──────────────┬─────────────┐
 ▼      ▼              ▼
LED   Sound       Water Sprayer
        │
        ▼
 Notification Engine
        │
        ▼
 Dashboard & Detection History
```

---

# 🖥 Dashboard Modules

### 🏠 Overview

* Today's detections
* Active alerts
* Farm protection status
* System health
* Device status

---

### 🎥 Live Monitoring

* Webcam stream
* Live AI detection
* Bounding boxes
* Confidence score
* Risk indicator

---

### 🤖 Animal Detection

Displays:

* Detected animal
* Confidence score
* Estimated proximity
* Risk level
* Detection timestamp
* AI recommendation

---

### 🎛 Mitigation System

* LED Control
* High Frequency Sound
* Water Sprayer
* Automatic Mode
* Manual Override
* Emergency Shutdown

---

### 🚨 Alerts

Notification center displaying:

* Animal detected
* Threat level
* Detection time
* Suggested actions
* Alert history

---

### 📜 Detection History

Complete event logs containing:

* Animal
* Date
* Time
* Confidence
* Risk Level
* Mitigation Action

---

### ⚙️ Settings

* Farm Information
* Camera Configuration
* Notification Preferences
* System Settings

---

# 💻 Technology Stack

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

## Backend *(Planned)*

* FastAPI

## Artificial Intelligence

* YOLO
* OpenCV
* PyTorch

## Database *(Planned)*

* Supabase

## Version Control

* Git
* GitHub

---

# 📂 Project Structure

```text
src/
│
├── components/
├── hooks/
├── pages/
├── services/
├── utils/
├── assets/
│
├── App.tsx
├── main.tsx
│
public/
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Dishti-ec/TETRA038.git
```

Navigate into the project

```bash
cd TETRA038
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```
---

# 🔑 Demo Credentials

**Email**

```text
demo@fasalraksha.ai
```

**Password**

```text
fasalraksha123
```

---

# 🛣 Roadmap

* ✅ Responsive UI
* ✅ Interactive Dashboard
* 🚧 YOLO Integration
* 🚧 Live Webcam Detection
* 🚧 Decision Engine
* 🚧 Alert System
* 🚧 Detection History
* 🚧 Supabase Integration
* 🚧 Edge Deployment
* 🚧 IoT Device Integration

---

# 🌱 Future Scope

* Edge AI deployment
* Raspberry Pi integration
* ESP32-based IoT devices
* Solar-powered autonomous operation
* Thermal camera integration
* Drone-assisted surveillance
* Mobile application
* SMS & WhatsApp alerts
* Multi-camera monitoring
* Weather-aware monitoring
* AI-powered farm analytics
* Species-specific deterrent optimization

---

# 📚 Research References

The design and conceptual understanding of **FASALRAKSHA** was informed by the following research publications:

1. **AI-Based Smart Animal Detection and Crop Protection System Using Sensors and Sound Alert Mechanism**
   https://ijcope.org/article/ai-based-smart-animal-detection-and-crop-protection-system-using-sensors-and-sound-alert-mechanism/

2. **AI-Based Smart Animal Detection and Crop Protection System Using Sensors and Sound Alert Mechanism (SCRS Publication)**
   https://publications.scrs.in/uploads/final_menuscript/423917d4d56e4cb0995b7bfacbfe96f1.pdf

3. **AI-Based Smart Animal Detection and Crop Protection System Using Sensors and Sound Alert Mechanism (ResearchGate)**
   https://www.researchgate.net/publication/405153916_AI-Based_Smart_Animal_Detection_and_Crop_Protection_System_Using_Sensors_and_Sound_Alert_Mechanism

These publications served as references for understanding AI-assisted animal detection, crop protection strategies, sensor-assisted monitoring, and non-invasive deterrent mechanisms. FASALRAKSHA extends these concepts through a modern web-based monitoring dashboard, YOLO-powered computer vision, intelligent risk assessment, smart mitigation recommendations, and a farmer-centric user experience tailored for practical deployment.

---

# 👥 Team

| Team Member | Responsibility                           |
| ----------- | ---------------------------------------- |
| Member 1    | Frontend Development, UI/UX Design       |
| Member 2    | YOLO Model Training & Computer Vision    |
| Member 3    | Backend Development & System Integration |

---

# 📄 License

This project has been developed as part of a hackathon submission.

All rights belong to the project team unless otherwise specified.

---

# 🌟 Vision

> **"To build an intelligent, affordable, and non-invasive crop protection system that leverages Artificial Intelligence to safeguard farms, protect animals, and empower farmers with smarter agricultural technology."**
