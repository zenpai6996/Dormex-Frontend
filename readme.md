# Dormex (Frontend)

React Native + Expo mobile app for hostel management. Includes dedicated student and admin experiences for rooms, complaints, and mess menus.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)

## What it does

- Student portal: view room info, raise complaints, see mess menu
- Admin portal: manage rooms, complaints, and mess menu updates
- Expo Router navigation and shared UI components

## Tech stack

- React Native, Expo, TypeScript
- Expo Router for navigation
- React Context for state

## Quickstart

```bash
git clone https://github.com/zenpai6996/Dormex-Frontend.git
cd Dormex-Frontend
npm install
npm run start
```

Requires the backend running and the API base URL configured in the app constants.

## Scripts

- `npm run start` - start Expo dev server
- `npm run android` - run on Android
- `npm run ios` - run on iOS
- `npm run web` - run on web

## Structure

```
Dormex-Frontend/
app/          # screens and routes
components/   # reusable UI components
context/      # context providers
assets/       # images, fonts, animations
src/          # APIs, schemas, utils, types
```

## Related

- Backend: https://github.com/zenpai6996/Dormex-Backend

## License

See LICENSE.
