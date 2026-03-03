import { createBlock } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";

export default function CreateBlockModal() {
	const router = useRouter();
	const { token } = useAuth();
	const [name, setName] = useState("");
	const [maxCapacity, setMaxCapacity] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!name.trim() || !maxCapacity.trim()) {
			ToastService.showError({
				message: "Please fill in all fields",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		const capacity = parseInt(maxCapacity);
		if (isNaN(capacity) || capacity <= 0) {
			ToastService.showError({
				message: "Please enter a valid capacity",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setLoading(true);
		try {
			await createBlock(token!, {
				name: name.trim(),
				maxCapacity: capacity,
			});
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Block created successfully!",
				duration: 3000,
				position: "bottom",
			});
			router.back();
		} catch (error) {
			ToastService.showError({
				message:
					error instanceof Error ? error.message : "Failed to create block",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setLoading(false);
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
					style={{ flex: 1 }}
					contentContainerStyle={{ padding: 20, paddingTop: 60 }}
					keyboardShouldPersistTaps="handled"
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 32,
						}}
					>
						<Pressable
							onPress={() => router.back()}
							style={({ pressed }) => ({
								width: 44,
								height: 44,
								borderRadius: 22,
								backgroundColor: "rgba(255,255,255,0.1)",
								alignItems: "center",
								justifyContent: "center",
								marginRight: 16,
								transform: [{ scale: pressed ? 0.95 : 1 }],
							})}
						>
							<FontAwesome name="arrow-left" size={20} color="#FFCC00" />
						</Pressable>
						<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
							Create Block
						</Text>
					</View>

					<View style={{ marginBottom: 24 }}>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								marginBottom: 8,
								marginLeft: 4,
							}}
						>
							Block Name
						</Text>
						<View
							style={{
								backgroundColor: "rgba(255,255,255,0.05)",
								borderRadius: 12,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
							}}
						>
							<TextInput
								value={name}
								onChangeText={setName}
								placeholder="e.g., Block A"
								placeholderTextColor="#6B7280"
								style={{
									color: "white",
									fontSize: 16,
									padding: 16,
								}}
								autoFocus
								editable={!loading}
							/>
						</View>
					</View>

					<View style={{ marginBottom: 32 }}>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								marginBottom: 8,
								marginLeft: 4,
							}}
						>
							Maximum Capacity
						</Text>
						<View
							style={{
								backgroundColor: "rgba(255,255,255,0.05)",
								borderRadius: 12,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
							}}
						>
							<TextInput
								value={maxCapacity}
								onChangeText={setMaxCapacity}
								placeholder="e.g., 100"
								placeholderTextColor="#6B7280"
								keyboardType="number-pad"
								style={{
									color: "white",
									fontSize: 16,
									padding: 16,
								}}
								editable={!loading}
							/>
						</View>
						<Text
							style={{
								color: "#6B7280",
								fontSize: 12,
								marginTop: 8,
								marginLeft: 4,
							}}
						>
							Maximum number of students that can join this block
						</Text>
					</View>

					<Pressable
						onPress={handleSubmit}
						disabled={loading}
						style={({ pressed }) => ({
							backgroundColor: "#FFCC00",
							borderRadius: 12,
							padding: 18,
							alignItems: "center",
							opacity: loading ? 0.7 : pressed ? 0.9 : 1,
							transform: [{ scale: pressed ? 0.98 : 1 }],
						})}
					>
						{loading ? (
							<ActivityIndicator color="#0A0F1E" />
						) : (
							<Text
								style={{
									color: "#0A0F1E",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Create Block
							</Text>
						)}
					</Pressable>

					<View
						style={{
							marginTop: 24,
							padding: 16,
							backgroundColor: "rgba(255,204,0,0.05)",
							borderRadius: 12,
							borderWidth: 1,
							borderColor: "rgba(255,204,0,0.2)",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 8,
							}}
						>
							<FontAwesome
								name="info-circle"
								size={16}
								color="#FFCC00"
								style={{ marginRight: 8 }}
							/>
							<Text
								style={{
									color: "#FFCC00",
									fontSize: 14,
									fontWeight: "600",
								}}
							>
								What happens next?
							</Text>
						</View>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 13,
								lineHeight: 20,
							}}
						>
							An invite code will be automatically generated. Students can use
							this code to join the block. The code will be valid for 7 days.
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}
