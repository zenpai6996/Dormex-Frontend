import { useColorScheme } from "@/components/useColorScheme";
import {
	OnboardingContext,
	OnboardingProvider,
} from "@/context/OnboardingContext";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toastier";
import { AlertContainer } from "rn-custom-alert-prompt";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

// Separate component that uses auth - rendered INSIDE AuthProvider
function AppContent() {
	const { loading, token } = useAuth();
	const onboarding = useContext(OnboardingContext);
	const segments = useSegments();
	const rootSegment = segments[0];
	const isInAuth = rootSegment === "(auth)";
	const isInOnboarding = rootSegment === "(onboarding)";

	// Show loading screen while auth/onboarding is initializing
	if (loading || onboarding?.loading) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</LinearGradient>
		);
	}

	if (token) {
		if (isInAuth || isInOnboarding || !rootSegment) {
			return <Redirect href="/(tabs)" />;
		}
		return null;
	}

	if (!onboarding?.hasCompletedOnboarding) {
		if (!isInOnboarding) {
			return <Redirect href="/(onboarding)/screen1" />;
		}
		return null;
	}

	if (!isInAuth) {
		return <Redirect href="/(auth)" />;
	}

	return null;
}

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		Outfit: require("../assets/fonts/Outfit/Outfit-Bold.ttf"),
		Saira: require("../assets/fonts/Saira-Bold.ttf"),
		...FontAwesome.font,
	});
	const colorScheme = useColorScheme();

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

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<OnboardingProvider>
					<ThemeProvider
						value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
					>
						<ToastProvider position="bottom" animation="zoomIn">
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
								<Stack.Screen
									name="create-student"
									options={{
										presentation: "modal",
										headerShown: false,
										animation: "slide_from_bottom",
									}}
								/>
								<Stack.Screen
									name="leave-applications"
									options={{
										presentation: "modal",
										headerShown: false,
										animation: "slide_from_bottom",
									}}
								/>
							</Stack>
							<AppContent />
						</ToastProvider>
					</ThemeProvider>
				</OnboardingProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
