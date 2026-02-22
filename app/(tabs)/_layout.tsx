import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import React, { useContext } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { OnboardingContext } from "@/context/OnboardingContext";
import { useAuth } from "@/src/context/AuthContext";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const auth = useAuth();
	const onboarding = useContext(OnboardingContext);

	if (auth?.loading || onboarding?.loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!auth?.token) {
		// If user hasn't completed onboarding, send them to onboarding
		if (!onboarding?.hasCompletedOnboarding) {
			return <Redirect href="/(onboarding)/screen1" />;
		}
		// If they've completed onboarding but aren't logged in, send to auth
		return <Redirect href="/(auth)" />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					headerRight: () => (
						<Link href="/modal" asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="info-circle"
										size={25}
										color={Colors[colorScheme ?? "light"].text}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					headerShown: false,
					title: "Mess",
					tabBarIcon: ({ color }) => <TabBarIcon name="spoon" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="three"
				options={{
					headerShown: false,
					title: "Complaints",
					tabBarIcon: ({ color }) => <TabBarIcon name="shield" color={color} />,
				}}
			/>
		</Tabs>
	);
}
