# Dormex
React Native + Expo mobile app for hostel management. Includes dedicated student and admin experiences for rooms, complaints, and mess menus.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)

---


## What it does

- Student portal: view room info, raise complaints, see mess menu
- Admin portal: manage rooms, complaints, and mess menu updates
- Expo Router navigation and shared UI components

## Tech stack

- React Native, Expo, TypeScript
- Expo Router for navigation
- React Context for state

  

## Screenshots

<table>
  <tr>
    <td align="center"><b>Student Dashboard</b></td>
    <td align="center"><b>Mess Menu</b></td>
    <td align="center"><b>Student Complaints</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/4d78c0fd-cacd-45ed-afed-7bafa0a782c9" width="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/9ec99c4c-047b-4dc1-a107-f414e41b5ec8" width="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/f4205935-51d2-400b-b965-08a5689b81dc" width="220"/></td>
  </tr>
  <tr>
    <td align="center"><b>Admin Dashboard</b></td>
    <td align="center"><b>Menu Management</b></td>
    <td align="center"><b>Admin Complaints</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/7957a846-3e44-431d-83a1-7401ad8b006f" width="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/2137a865-ca54-45e1-9839-4bb096c1404b" width="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/37d6dd9d-a93d-417e-a14a-8369dc4b07a4" width="220"/></td>

  </tr>
  <tr>
    <td align="center"><b>Room Management</b></td>
    <td align="center"><b>Student Management</b></td>
    <td align="center"><b>Profile </b></td>
  </tr>
  <tr>
    <td  align="center"><img src="https://github.com/user-attachments/assets/d22ac22a-a429-4a94-aff3-9778f92fdbd6" width="220"/></td>
    <td  align="center"><img src="https://github.com/user-attachments/assets/25d657fd-7bfb-495a-8b46-31974d2e022b" width="220"/></td>
    <td  align="center"><img src="https://github.com/user-attachments/assets/1998ce63-e477-4d6f-9070-73489a741f5a" width="220"/></td>
  </tr>
</table>

---


## Quickstart

```bash
git clone https://github.com/zenpai6996/Dormex-Frontend.git
cd Dormex-Frontend
npm install
npm run start
```

Requires the backend running and the API base URL configured in the app constants.

## Scripts

- `npm run start` — start Expo dev server
- `npm run android` — run on Android
- `npm run ios` — run on iOS
- `npm run web` — run on web

## Structure

```
Dormex-Frontend/
├── app/          # screens and routes
├── components/   # reusable UI components
├── context/      # context providers
├── assets/       # images, fonts, animations
└── src/          # APIs, schemas, utils, types
```

## Related

- [Backend](https://github.com/zenpai6996/Dormex-Backend)

## License

[LICENSE](LICENSE)
