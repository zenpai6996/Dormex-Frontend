<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 220" width="900" height="220">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1f2e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e2235;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#252a3d;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="900" height="220" fill="url(#bg)" rx="12"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="55" x2="900" y2="55" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="0" y1="110" x2="900" y2="110" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="0" y1="165" x2="900" y2="165" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="225" y1="0" x2="225" y2="220" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="450" y1="0" x2="450" y2="220" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="675" y1="0" x2="675" y2="220" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>

  <!-- Glow orb left -->
  <circle cx="120" cy="110" r="80" fill="#6366f1" fill-opacity="0.08"/>
  <!-- Glow orb right -->
  <circle cx="780" cy="110" r="80" fill="#a78bfa" fill-opacity="0.06"/>

  <!-- Icon: building -->
  <rect x="60" y="70" width="50" height="80" fill="none" stroke="url(#accent)" stroke-width="2" rx="4" filter="url(#glow)"/>
  <rect x="70" y="82" width="10" height="10" fill="#6366f1" fill-opacity="0.8" rx="1"/>
  <rect x="90" y="82" width="10" height="10" fill="#6366f1" fill-opacity="0.8" rx="1"/>
  <rect x="70" y="100" width="10" height="10" fill="#a78bfa" fill-opacity="0.8" rx="1"/>
  <rect x="90" y="100" width="10" height="10" fill="#a78bfa" fill-opacity="0.8" rx="1"/>
  <rect x="70" y="118" width="10" height="10" fill="#6366f1" fill-opacity="0.6" rx="1"/>
  <rect x="90" y="118" width="10" height="10" fill="#6366f1" fill-opacity="0.6" rx="1"/>
  <rect x="78" y="135" width="14" height="15" fill="#a78bfa" fill-opacity="0.5" rx="2"/>

  <!-- Accent bar under title -->
  <rect x="160" y="124" width="200" height="3" fill="url(#accent)" rx="2"/>

  <!-- Title -->
  <text x="163" y="115" font-family="'Segoe UI', Arial, sans-serif" font-size="52" font-weight="800" fill="url(#accent)" filter="url(#glow)" letter-spacing="-1">DORMEX</text>

  <!-- Subtitle -->
  <text x="163" y="148" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="#94a3b8" letter-spacing="3">HOSTEL MANAGEMENT SYSTEM</text>

  <!-- Divider -->
  <line x1="160" y1="165" x2="420" y2="165" stroke="#2d3352" stroke-width="1"/>



<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)

</div>

---

## 📖 Overview

**Dormex** is a cross-platform mobile application built with React Native and Expo for streamlining hostel operations. It provides two dedicated portals — one for **students** and one for **admins/wardens** — making day-to-day hostel management effortless.

---

## ✨ Features

### 🏠 Room Booking & Allocation
- Students can browse available rooms and submit booking requests
- Admins can allocate, reassign, and manage room occupancy

### 🔧 Complaints & Maintenance
- Students can raise maintenance complaints directly from the app
- Admins can track, update, and resolve complaints in real time

### 🍽️ Mess Menu Management
- Admins can create and update the weekly mess menu
- Students get a clean, easy-to-read daily/weekly mess menu view

### 👥 Dual Role System
- **Student Portal** — room info, complaints, mess menu at a glance
- **Admin Portal** — full control over rooms, complaints, and menu

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo | Build tooling & device APIs |
| TypeScript | Type-safe development |
| Expo Router | File-based navigation |
| React Context | Global state management |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your device

### Installation

```bash
# Clone the repository
git clone https://github.com/zenpai6996/Dormex-Frontend.git
cd Dormex-Frontend

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS) to run the app on your device.

> ⚠️ This frontend requires the [Dormex Backend](https://github.com/zenpai6996/Dormex-Backend) to be running. Make sure to configure your API base URL in the constants before starting.

---

## 📁 Project Structure

```
Dormex-Frontend/
├── app/          # Expo Router screens & navigation
├── components/   # Reusable UI components
├── context/      # React Context providers
├── assets/       # Images, fonts & static files
└── src/          # Core utilities & helpers
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
>
