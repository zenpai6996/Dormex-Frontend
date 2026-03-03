import { createComplaint } from "@/src/api/complaint.api";
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

const CATEGORIES = [
	"Maintenance",
	"Cleanliness",
	"Food Quality",
	"Security",
	"Noise",
	"Other",
];

export default function CreateComplaintModal() {
	const router = useRouter();
	const { token } = useAuth();
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!category || !description.trim()) {
			ToastService.showError({
				message: "Please select a category and enter a description",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setLoading(true);
		try {
			await createComplaint(token!, {
				category,
				description: description.trim(),
			});
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Complaint submitted successfully",
				duration: 3000,
				position: "bottom",
			});
			router.back();
		} catch (error) {
			ToastService.showError({
				message: "Failed to submit complaint",
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
							File Complaint
						</Text>
					</View>

					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 12,
						}}
					>
						Select Category
					</Text>

					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							gap: 8,
							marginBottom: 24,
						}}
					>
						{CATEGORIES.map((cat) => (
							<Pressable
								key={cat}
								onPress={() => setCategory(cat)}
								style={{
									backgroundColor:
										category === cat
											? "rgba(239,68,68,0.2)"
											: "rgba(255,255,255,0.05)",
									paddingHorizontal: 16,
									paddingVertical: 10,
									borderRadius: 20,
									borderWidth: 1,
									borderColor:
										category === cat
											? "rgba(239,68,68,0.5)"
											: "rgba(255,255,255,0.1)",
								}}
							>
								<Text
									style={{
										color: category === cat ? "#EF4444" : "#9CA3AF",
										fontSize: 14,
										fontWeight: category === cat ? "600" : "400",
									}}
								>
									{cat}
								</Text>
							</Pressable>
						))}
					</View>

					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 12,
						}}
					>
						Description
					</Text>

					<View
						style={{
							backgroundColor: "rgba(255,255,255,0.05)",
							borderRadius: 12,
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.1)",
							marginBottom: 24,
						}}
					>
						<TextInput
							value={description}
							onChangeText={setDescription}
							placeholder="Describe your issue in detail..."
							placeholderTextColor="#6B7280"
							multiline
							numberOfLines={6}
							textAlignVertical="top"
							style={{
								color: "white",
								fontSize: 16,
								padding: 16,
								height: 150,
							}}
							editable={!loading}
						/>
					</View>

					<Pressable
						onPress={handleSubmit}
						disabled={loading}
						style={({ pressed }) => ({
							backgroundColor: "#EF4444",
							borderRadius: 12,
							padding: 18,
							alignItems: "center",
							opacity: loading ? 0.7 : pressed ? 0.9 : 1,
						})}
					>
						{loading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text
								style={{
									color: "white",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Submit Complaint
							</Text>
						)}
					</Pressable>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}
