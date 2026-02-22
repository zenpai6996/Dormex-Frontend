// app/(onboarding)/_layout.tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="screen1"
		>
			<Stack.Screen name="screen1" options={{ headerShown: false }} />
		</Stack>
	);
}
