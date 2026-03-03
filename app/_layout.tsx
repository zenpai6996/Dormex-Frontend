import { useColorScheme } from "@/components/useColorScheme";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { AuthProvider } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toastier";
import { AlertContainer } from "rn-custom-alert-prompt";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		Outfit: require("../assets/fonts/Outfit/Outfit-Bold.ttf"),
		Saira: require("../assets/fonts/Saira-Bold.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<AuthProvider>
				<OnboardingProvider>
					<ToastProvider>
						<AlertContainer
							animationType="fade"
							theme="android"
							appearance={colorScheme === "dark" ? "dark" : "light"}
							personalTheme={{
								backgroundColor: "rgba(0,0,0,0.5)",
								cardBackgroundColor:
									colorScheme === "dark" ? "#1A1F32" : "#ffffff",
								titleColor: colorScheme === "dark" ? "#fff" : "#333333",
								descriptionColor:
									colorScheme === "dark" ? "#9CA3AF" : "#666666",
								textButtonColor: "#ffcc00",
							}}
						/>

						<Stack>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							<Stack.Screen name="(auth)" options={{ headerShown: false }} />
							<Stack.Screen
								name="(onboarding)"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="modal"
								options={{
									presentation: "modal",
									headerShown: false,
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="create"
								options={{
									presentation: "modal",
									headerShown: false,
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="block/[id]"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="create-complaint"
								options={{
									presentation: "modal",
									headerShown: false,
									animation: "slide_from_bottom",
								}}
							/>
						</Stack>
					</ToastProvider>
				</OnboardingProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}
