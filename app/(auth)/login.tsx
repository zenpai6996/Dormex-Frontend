// app/(auth)/login.tsx
import { AuthContext } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Alert } from "rn-custom-alert-prompt";

const { width } = Dimensions.get("window");

export default function Login() {
	const auth = useContext(AuthContext);
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert({
				title: "Error",
				description: "Please fill in all the fields",
				showCancelButton: false,
			});
			return;
		}

		try {
			setIsLoading(true);
			await auth?.login(email, password);
			router.replace("/(tabs)");
		} catch (error) {
			Alert.alert({
				title: "Error",
				description: "Invalid Credentials",
				showCancelButton: false,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
			style={{ flex: 1 }}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					showsVerticalScrollIndicator={false}
				>
					<View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
						{/* Back Button */}
						{/* <Animated.View entering={FadeInUp.delay(200).duration(1000)}>
							<Pressable
								onPress={() => router.back()}
								style={({ pressed }) => ({
									position: "absolute",
									top: 20,
									left: 24,
									zIndex: 10,
									opacity: pressed ? 0.7 : 1,
								})}
							>
								<FontAwesome name="arrow-left" size={24} color="#fff" />
							</Pressable>
						</Animated.View> */}

						{/* Header */}
						<Animated.View
							entering={FadeInDown.delay(100).duration(500)}
							style={{ alignItems: "center", marginBottom: 40 }}
						>
							{/* <View
								style={{
									backgroundColor: "#4F46E5",
									width: 70,
									height: 70,
									borderRadius: 18,
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 20,
								}}
							>
								<Text
									style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}
								>
									D
								</Text>
							</View> */}
							<Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>
								Welcome Back!
							</Text>
							<Text style={{ color: "#9CA3AF", fontSize: 16, marginTop: 8 }}>
								Log in to continue to Dorm
								<Text style={{ color: "#FFCC00" }}>Ex</Text>
							</Text>
						</Animated.View>

						{/* Form */}
						<Animated.View entering={FadeInDown.delay(100).duration(500)}>
							{/* Email Input */}
							<View style={{ marginBottom: 20 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Email Address
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 16,
										borderWidth: 1,
										borderColor: isFocused
											? "#4F46E5"
											: "rgba(255,255,255,0.2)",
										paddingHorizontal: 16,
									}}
								>
									<FontAwesome name="envelope" size={20} color="#9CA3AF" />
									<TextInput
										placeholder="Enter your email"
										placeholderTextColor="#6B7280"
										value={email}
										onChangeText={setEmail}
										keyboardType="email-address"
										autoCapitalize="none"
										style={{
											flex: 1,
											color: "#fff",
											paddingVertical: 16,
											paddingHorizontal: 12,
											fontSize: 16,
										}}
									/>
								</View>
							</View>

							{/* Password Input */}
							<View style={{ marginBottom: 20 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Password
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 16,
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.2)",
										paddingHorizontal: 16,
									}}
								>
									<FontAwesome name="lock" size={24} color="#9CA3AF" />
									<TextInput
										placeholder="Enter your password"
										placeholderTextColor="#6B7280"
										value={password}
										onChangeText={setPassword}
										secureTextEntry={!showPassword}
										style={{
											flex: 1,
											color: "#fff",
											paddingVertical: 16,
											paddingHorizontal: 12,
											fontSize: 16,
										}}
									/>
									<Pressable onPress={() => setShowPassword(!showPassword)}>
										<FontAwesome
											name={showPassword ? "eye-slash" : "eye"}
											size={20}
											color="#9CA3AF"
										/>
									</Pressable>
								</View>
							</View>

							{/* Forgot Password */}
							{/* <Pressable
								onPress={() =>
									Alert.alert(
										"Coming Soon",
										"Password reset will be available soon!",
									)
								}
								style={{ alignItems: "flex-end", marginBottom: 24 }}
							>
								<Text style={{ color: "#4F46E5", fontSize: 14 }}>
									Forgot Password?
								</Text>
							</Pressable> */}

							{/* Login Button */}
							<Pressable
								onPress={handleLogin}
								disabled={isLoading}
								style={({ pressed }) => ({
									backgroundColor: pressed ? "#ffcc00ad" : "#ffcc00",
									paddingVertical: 16,
									borderRadius: 30,
									alignItems: "center",
									marginBottom: 20,
									opacity: isLoading ? 0.7 : 1,
									transform: [{ scale: pressed ? 0.98 : 1 }],
								})}
							>
								<Text
									style={{ color: "black", fontSize: 18, fontWeight: "600" }}
								>
									{isLoading ? "Logging in..." : "Log In"}
								</Text>
							</Pressable>

							{/* Divider */}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginVertical: 20,
								}}
							>
								<View
									style={{
										flex: 1,
										height: 1,
										backgroundColor: "rgba(255,255,255,0.1)",
									}}
								/>
								<Text style={{ color: "#9CA3AF", marginHorizontal: 16 }}>
									OR
								</Text>
								<View
									style={{
										flex: 1,
										height: 1,
										backgroundColor: "rgba(255,255,255,0.1)",
									}}
								/>
							</View>

							{/* Create Account Button */}
							<Pressable
								onPress={() => router.push("/(auth)/register")}
								style={({ pressed }) => ({
									backgroundColor: "rgba(255,255,255,0.1)",
									paddingVertical: 16,
									borderRadius: 30,
									alignItems: "center",
									borderWidth: 1,
									borderColor: "#ffcc00",
									transform: [{ scale: pressed ? 0.98 : 1 }],
								})}
							>
								<Text
									style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
								>
									Create New Account
								</Text>
							</Pressable>

							{/* Terms */}
							<Text
								style={{
									color: "#d0d7e6",
									textAlign: "center",
									marginTop: 30,
									fontSize: 12,
								}}
							>
								By continuing, you agree to our{"\n"}
								<Text style={{ color: "#ffcc00" }}>
									Terms of Service
								</Text> and{" "}
								<Text style={{ color: "#ffcc00" }}>Privacy Policy</Text>
							</Text>
						</Animated.View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}
