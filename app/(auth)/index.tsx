// app/(auth)/index.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Onboarding() {
	const router = useRouter();

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<View style={{ flex: 1, justifyContent: "space-between", padding: 24 }}>
				{/* Header with Glass Icon */}
				<Animated.View
					entering={FadeInUp.delay(100).duration(500)}
					style={{ alignItems: "center", marginTop: 60 }}
				>
					<Text style={{ color: "#fff", fontSize: 36, fontWeight: "bold" }}>
						Dorm
						<Text style={{ color: "#FFCC00" }}>Ex</Text>
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 16, marginTop: 8 }}>
						Hostel Management System
					</Text>
				</Animated.View>

				{/* Features with Glass Icons */}
				<Animated.View entering={FadeInDown.delay(100).duration(500)}>
					<FeatureItem
						icon="users"
						title="Roommate Matcher"
						description="Find compatible roommates "
					/>
					<FeatureItem
						icon="spoon"
						title="Mess Timetable"
						description="Get updates about attendance and mess"
					/>
					<FeatureItem
						icon="shield"
						title="Complaint"
						description="Get issues and complaints resolved"
					/>
				</Animated.View>

				{/* Glass Buttons */}
				<Animated.View entering={FadeInDown.delay(100).duration(500)}>
					<Pressable
						onPress={() => router.push("/(auth)/login")}
						style={({ pressed }) => ({
							backgroundColor: pressed ? "#ffcc00ad" : "#ffcc00",
							paddingVertical: 16,
							borderRadius: 30,
							alignItems: "center",
							marginBottom: 12,
							transform: [{ scale: pressed ? 0.98 : 1 }],
						})}
					>
						<Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
							Log In
						</Text>
					</Pressable>

					<Pressable
						onPress={() => router.push("/(auth)/register")}
						style={({ pressed }) => ({
							backgroundColor: "rgba(255,255,255,0.1)",
							paddingVertical: 16,
							borderRadius: 30,
							alignItems: "center",
							borderWidth: 1,
							borderColor: "#FFCC00",
							transform: [{ scale: pressed ? 0.98 : 1 }],
						})}
					>
						<Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
							Create Account
						</Text>
					</Pressable>

					<Text
						style={{
							color: "#edf0f6",
							textAlign: "center",
							marginTop: 24,
							fontSize: 12,
						}}
					>
						By continuing, you agree to our{"\n"}
						<Text style={{ color: "#FFCC00" }}>Terms of Service</Text> and{" "}
						<Text style={{ color: "#FFCC00" }}>Privacy Policy</Text>
					</Text>
				</Animated.View>
			</View>
		</LinearGradient>
	);
}

function FeatureItem({
	icon,
	title,
	description,
}: {
	icon: any;
	title: string;
	description: string;
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				marginBottom: 24,
				alignItems: "center",
			}}
		>
			{/* Glass Icon Container */}
			<BlurView
				intensity={15}
				tint="dark"
				style={{
					width: 55,
					height: 55,
					borderRadius: 18,
					overflow: "hidden",
					backgroundColor: "rgba(255,255,255,0.05)",
					borderWidth: 1,
					borderColor: "rgba(255,255,255,0.15)",
					alignItems: "center",
					justifyContent: "center",
					marginRight: 16,
					shadowColor: "#ffcc00",
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.2,
					shadowRadius: 10,
					elevation: 5,
				}}
			>
				<LinearGradient
					colors={["rgba(79,70,229,0.2)", "#ffcc00"]}
					style={{
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<FontAwesome name={icon} size={24} color="#fff" />
				</LinearGradient>
			</BlurView>

			<View style={{ flex: 1 }}>
				<Text
					style={{
						color: "#fff",
						fontSize: 16,
						fontWeight: "600",
						marginBottom: 4,
					}}
				>
					{title}
				</Text>
				<Text style={{ color: "#9CA3AF", fontSize: 14 }}>{description}</Text>
			</View>
		</View>
	);
}
