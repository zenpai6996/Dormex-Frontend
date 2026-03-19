// app/(auth)/register.tsx
import { useAuth } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

export default function Register() {
	const auth = useAuth();
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [rollNo, setRollNo] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [phoneNumber, setPhoneNumber] = useState("");
	const [branch, setBranch] = useState("IT");
	const [showDatePicker, setShowDatePicker] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const branches = ["IT", "CS", "ECE", "EE", "ME", "CE", "OTHER"];

	const handleRegister = async () => {
		// Validate all fields
		if (
			!name ||
			!email ||
			!password ||
			!confirmPassword ||
			!rollNo ||
			!phoneNumber ||
			!branch
		) {
			Alert.alert({
				title: "Error",
				description: "Please fill in all the fields",
				showCancelButton: false,
			});
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert({
				title: "Error",
				description: "Passwords do not match",
				showCancelButton: false,
			});
			return;
		}

		if (password.length < 8) {
			Alert.alert({
				title: "Error",
				description: "Password must be at least 8 characters",
				showCancelButton: false,
			});
			return;
		}

		// Validate phone number (simple validation)
		if (phoneNumber.length < 10) {
			Alert.alert({
				title: "Error",
				description: "Please enter a valid phone number",
				showCancelButton: false,
			});
			return;
		}

		try {
			setIsLoading(true);

			const res = await fetch(
				`${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						email,
						password,
						rollNo,
						dateOfBirth: dateOfBirth.toISOString(),
						phoneNumber,
						branch,
					}),
				},
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Registration failed");
			}

			Alert.alert({
				title: "Success",
				description: "Registration successful! Please log in.",
				showCancelButton: false,
				buttons: [
					{
						text: "OK",
						onPress: () => router.replace("/(auth)/login"),
					},
				],
			});
		} catch (error: any) {
			Alert.alert({
				title: "Error",
				description: error.message || "Registration failed. Please try again.",
				showCancelButton: false,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
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
						{/* Header */}
						<Animated.View
							entering={FadeInDown.delay(100).duration(500)}
							style={{ alignItems: "center", marginBottom: 30 }}
						>
							<Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>
								Create Account
							</Text>
							<Text style={{ color: "#9CA3AF", fontSize: 16, marginTop: 8 }}>
								Join Dorm<Text style={{ color: "#FFCC00" }}>Ex</Text> today
							</Text>
						</Animated.View>

						{/* Form */}
						<Animated.View entering={FadeInDown.delay(200).duration(500)}>
							{/* Name Input */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Full Name
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
									<FontAwesome name="user" size={20} color="#9CA3AF" />
									<TextInput
										placeholder="Enter your full name"
										placeholderTextColor="#6B7280"
										value={name}
										onChangeText={setName}
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

							{/* Email Input */}
							<View style={{ marginBottom: 16 }}>
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
										borderColor: "rgba(255,255,255,0.2)",
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

							{/* Roll Number Input */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Roll Number
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
									<FontAwesome name="id-card" size={20} color="#9CA3AF" />
									<TextInput
										placeholder="e.g., 2306229"
										placeholderTextColor="#6B7280"
										value={rollNo}
										onChangeText={setRollNo}
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

							{/* Phone Number Input */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Phone Number
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
									<FontAwesome name="phone" size={20} color="#9CA3AF" />
									<TextInput
										placeholder="Enter your phone number"
										placeholderTextColor="#6B7280"
										value={phoneNumber}
										onChangeText={setPhoneNumber}
										keyboardType="phone-pad"
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

							{/* Date of Birth */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Date of Birth
								</Text>
								<Pressable
									onPress={() => setShowDatePicker(true)}
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 16,
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.2)",
										paddingHorizontal: 16,
										paddingVertical: 16,
									}}
								>
									<FontAwesome name="calendar" size={20} color="#9CA3AF" />
									<Text style={{ color: "#fff", marginLeft: 12, flex: 1 }}>
										{dateOfBirth.toLocaleDateString()}
									</Text>
								</Pressable>
								{showDatePicker && (
									<DateTimePicker
										value={dateOfBirth}
										mode="date"
										display="default"
										onChange={(event, selectedDate) => {
											setShowDatePicker(false);
											if (selectedDate) {
												setDateOfBirth(selectedDate);
											}
										}}
										maximumDate={new Date()}
									/>
								)}
							</View>

							{/* Branch Picker */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Branch
								</Text>
								<View
									style={{
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 16,
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.2)",
										overflow: "hidden",
									}}
								>
									<Picker
										selectedValue={branch}
										onValueChange={(itemValue) => setBranch(itemValue)}
										style={{ color: "#fff" }}
										dropdownIconColor="#FFCC00"
									>
										{branches.map((b) => (
											<Picker.Item key={b} label={b} value={b} color="#000" />
										))}
									</Picker>
								</View>
							</View>

							{/* Password Input */}
							<View style={{ marginBottom: 16 }}>
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
										placeholder="8-16 characters"
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

							{/* Confirm Password Input */}
							<View style={{ marginBottom: 24 }}>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Confirm Password
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
										placeholder="Re-enter password"
										placeholderTextColor="#6B7280"
										value={confirmPassword}
										onChangeText={setConfirmPassword}
										secureTextEntry={!showConfirmPassword}
										style={{
											flex: 1,
											color: "#fff",
											paddingVertical: 16,
											paddingHorizontal: 12,
											fontSize: 16,
										}}
									/>
									<Pressable
										onPress={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										<FontAwesome
											name={showConfirmPassword ? "eye-slash" : "eye"}
											size={20}
											color="#9CA3AF"
										/>
									</Pressable>
								</View>
							</View>

							{/* Register Button */}
							<Pressable
								onPress={handleRegister}
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
									{isLoading ? "Creating Account..." : "Create Account"}
								</Text>
							</Pressable>

							{/* Login Link */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text style={{ color: "#9CA3AF", fontSize: 14 }}>
									Already have an account?{" "}
								</Text>
								<Pressable onPress={() => router.push("/(auth)/login")}>
									<Text
										style={{
											color: "#ffcc00",
											fontSize: 14,
											fontWeight: "600",
										}}
									>
										Log In
									</Text>
								</Pressable>
							</View>
						</Animated.View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}
