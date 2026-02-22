import { useColorScheme } from "@/components/useColorScheme";
import { OnboardingContext } from "@/context/OnboardingContext";
import { useAuth } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Redirect, Tabs } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { LuHome, LuMessageSquare, LuUtensilsCrossed } from "rn-icons/lu";

function TabBarIcon({
	name,
	color,
	focused,
}: {
	name: "home" | "utensils" | "alert-triangle";
	color: string;
	focused?: boolean;
}) {
	const iconSize = focused ? 32 : 26;

	switch (name) {
		case "home":
			return <LuHome size={iconSize} color={color} strokeWidth={1.5} />;
		case "utensils":
			return (
				<LuUtensilsCrossed size={iconSize} color={color} strokeWidth={1.5} />
			);
		case "alert-triangle":
			return (
				<LuMessageSquare size={iconSize} color={color} strokeWidth={1.5} />
			);
		default:
			return null;
	}
}

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const auth = useAuth();
	const onboarding = useContext(OnboardingContext);

	if (auth?.loading || onboarding?.loading) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</LinearGradient>
		);
	}

	if (!auth?.token) {
		if (!onboarding?.hasCompletedOnboarding) {
			return <Redirect href="/(onboarding)/screen1" />;
		}
		return <Redirect href="/(auth)" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					marginHorizontal: 20,
					position: "absolute",
					bottom: 20,
					left: 20,
					right: 20,
					backgroundColor: "#1A1F32",
					borderRadius: 40,
					borderTopWidth: 0,
					height: 70,
					paddingBottom: 0,
					paddingTop: 10,
					elevation: 0,
					shadowColor: "#FFCC00",
					shadowOffset: {
						width: 0,
						height: 4,
					},
					shadowOpacity: 0.15,
					shadowRadius: 8,
					borderWidth: 1,
					borderColor: "rgba(255,204,0,0.3)",
				},

				tabBarActiveTintColor: "#FFCC00",
				tabBarInactiveTintColor: "#9CA3AF",
				tabBarShowLabel: false,
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "500",
				},
				tabBarItemStyle: {
					paddingVertical: 5,
				},
				tabBarBackground: () => (
					<LinearGradient
						colors={["#1A1F32", "#1A1F32"]}
						style={{
							flex: 1,
							borderRadius: 40,
						}}
					/>
				),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<View
							style={{
								width: 56,
								height: 46,
								borderRadius: 28,
								backgroundColor: focused
									? "rgba(255, 204, 0, 0.07)"
									: "transparent",
								borderWidth: focused ? 1 : 0,
								borderColor: focused ? "#FFCC00" : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TabBarIcon name="home" color={color} focused={focused} />
						</View>
					),
					headerRight: () => (
						<Link href="/modal" asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="info-circle"
										size={25}
										color="#FFCC00"
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
					title: "Mess",
					tabBarIcon: ({ color, focused }) => (
						<View
							style={{
								width: 56,
								height: 46,
								borderRadius: 28,
								backgroundColor: focused
									? "rgba(255, 204, 0, 0.07)"
									: "transparent",
								borderWidth: focused ? 1 : 0,
								borderColor: focused ? "#FFCC00" : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TabBarIcon name="utensils" color={color} focused={focused} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="three"
				options={{
					title: "Complaints",
					tabBarIcon: ({ color, focused }) => (
						<View
							style={{
								width: 56,
								height: 46,
								borderRadius: 28,
								backgroundColor: focused
									? "rgba(255, 204, 0, 0.07)"
									: "transparent",
								borderWidth: focused ? 1 : 0,
								borderColor: focused ? "#FFCC00" : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TabBarIcon
								name="alert-triangle"
								color={color}
								focused={focused}
							/>
						</View>
					),
				}}
			/>
		</Tabs>
	);
}
