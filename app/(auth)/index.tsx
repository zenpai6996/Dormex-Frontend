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
			colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
			style={{ flex: 1 }}
		>
			<View style={{ flex: 1, justifyContent: "space-between", padding: 24 }}>
				{/* Header with Glass Icon */}
				<Animated.View
					entering={FadeInUp.delay(100).duration(500)}
					style={{ alignItems: "center", marginTop: 60 }}
				>
					{/* <BlurView
						intensity={20}
						tint="dark"
						style={{
							width: 90,
							height: 90,
							borderRadius: 25,
							overflow: "hidden",
							backgroundColor: "rgba(255,255,255,0.1)",
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.2)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 20,
							shadowColor: "#4F46E5",
							shadowOffset: { width: 0, height: 10 },
							shadowOpacity: 0.3,
							shadowRadius: 20,
							elevation: 10,
						}}
					>
						<LinearGradient
							colors={["rgba(79,70,229,0.4)", "rgba(79,70,229,0.1)"]}
							style={{
								width: "100%",
								height: "100%",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={{ color: "#fff", fontSize: 45, fontWeight: "bold" }}>
								D
							</Text>
						</LinearGradient>
					</BlurView> */}

					<Text style={{ color: "#fff", fontSize: 36, fontWeight: "bold" }}>
						Dorm<Text style={{ color: "#4F46E5" }}>Ex</Text>
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
						icon="bell"
						title="Instant Notifications"
						description="Get updates about attendance and mess"
					/>
					<FeatureItem
						icon="shield"
						title="Secure & Safe"
						description="Secure system for management"
					/>
				</Animated.View>

				{/* Glass Buttons */}
				<Animated.View entering={FadeInDown.delay(100).duration(500)}>
					{/* Primary Glass Button */}
					<Pressable
						onPress={() => router.push("/(auth)/login")}
						style={({ pressed }) => ({
							transform: [{ scale: pressed ? 0.98 : 1 }],
							marginBottom: 12,
						})}
					>
						{({ pressed }) => (
							<BlurView
								intensity={pressed ? 30 : 20}
								tint="dark"
								style={{
									paddingVertical: 16,
									borderRadius: 30,
									overflow: "hidden",
									backgroundColor: "rgba(79,70,229,0.2)",
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.2)",
									alignItems: "center",
									shadowColor: "#4F46E5",
									shadowOffset: { width: 0, height: 8 },
									shadowOpacity: pressed ? 0.5 : 0.3,
									shadowRadius: 15,
									elevation: 8,
								}}
							>
								<LinearGradient
									colors={[
										"rgba(79,70,229,0.4)",
										"rgba(79,70,229,0.1)",
										"rgba(79,70,229,0.2)",
									]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={{
										position: "absolute",
										width: "100%",
										height: "100%",
									}}
								/>
								<Text
									style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}
								>
									Log In
								</Text>
							</BlurView>
						)}
					</Pressable>

					{/* Secondary Glass Button */}
					<Pressable
						onPress={() => router.push("/(auth)/register")}
						style={({ pressed }) => ({
							transform: [{ scale: pressed ? 0.98 : 1 }],
						})}
					>
						{({ pressed }) => (
							<BlurView
								intensity={pressed ? 25 : 15}
								tint="dark"
								style={{
									paddingVertical: 16,
									borderRadius: 30,
									overflow: "hidden",
									backgroundColor: "rgba(255,255,255,0.05)",
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.15)",
									alignItems: "center",
									shadowColor: "#fff",
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.1,
									shadowRadius: 10,
									elevation: 4,
								}}
							>
								<Text
									style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}
								>
									Create Account
								</Text>
							</BlurView>
						)}
					</Pressable>

					<Text
						style={{
							color: "#6B7280",
							textAlign: "center",
							marginTop: 24,
							fontSize: 12,
						}}
					>
						By continuing, you agree to our{"\n"}
						<Text style={{ color: "#4F46E5" }}>Terms of Service</Text> and{" "}
						<Text style={{ color: "#4F46E5" }}>Privacy Policy</Text>
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
					shadowColor: "#4F46E5",
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.2,
					shadowRadius: 10,
					elevation: 5,
				}}
			>
				<LinearGradient
					colors={["rgba(79,70,229,0.2)", "rgba(79,70,229,0.05)"]}
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
