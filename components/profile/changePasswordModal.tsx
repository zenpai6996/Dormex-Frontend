import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";

interface ChangePasswordModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => Promise<void>;
	isLoading: boolean;
}

export default function ChangePasswordModal({
	visible,
	onClose,
	onSubmit,
	isLoading,
}: ChangePasswordModalProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleSubmit = async () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			return;
		}
		if (newPassword !== confirmPassword) {
			return;
		}
		if (newPassword.length < 6) {
			return;
		}
		await onSubmit({ currentPassword, newPassword, confirmPassword });
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	const handleClose = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		onClose();
	};

	const isFormValid = () => {
		return (
			currentPassword.length > 0 &&
			newPassword.length >= 6 &&
			confirmPassword.length >= 6 &&
			newPassword === confirmPassword
		);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.7)",
						justifyContent: "center",
						alignItems: "center",
						padding: 16,
					}}
					onPress={handleClose}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={{ width: "100%", maxWidth: 400 }}
					>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderRadius: 24,
								borderWidth: 1,
								borderColor: "#1A1F32",
								padding: 20,
							}}
						>
							<View style={{ alignItems: "center", marginBottom: 20 }}>
								<View
									style={{
										width: 60,
										height: 60,
										borderRadius: 30,
										backgroundColor: "rgba(255,204,0,0.1)",
										alignItems: "center",
										justifyContent: "center",
										borderWidth: 1,
										borderColor: "rgba(255,204,0,0.3)",
									}}
								>
									<FontAwesome name="lock" size={28} color="#FFCC00" />
								</View>
								<Text
									style={{
										color: "white",
										fontSize: 20,
										fontWeight: "bold",
										marginTop: 12,
									}}
								>
									Change Password
								</Text>
							</View>

							{/* Current Password */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 13,
										marginBottom: 8,
										marginLeft: 4,
									}}
								>
									Current Password
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(0,0,0,0.3)",
										borderRadius: 12,
										borderWidth: 1,
										borderColor: "rgba(255,204,0,0.2)",
										paddingHorizontal: 12,
									}}
								>
									<FontAwesome
										name="key"
										size={16}
										color="#FFCC00"
										style={{ marginRight: 10 }}
									/>
									<TextInput
										value={currentPassword}
										onChangeText={setCurrentPassword}
										placeholder="Enter current password"
										placeholderTextColor="#6B7280"
										secureTextEntry={!showCurrent}
										style={{
											flex: 1,
											paddingVertical: 14,
											color: "white",
											fontSize: 16,
										}}
									/>
									<Pressable onPress={() => setShowCurrent(!showCurrent)}>
										<FontAwesome
											name={showCurrent ? "eye-slash" : "eye"}
											size={16}
											color="#6B7280"
										/>
									</Pressable>
								</View>
							</View>

							{/* New Password */}
							<View style={{ marginBottom: 16 }}>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 13,
										marginBottom: 8,
										marginLeft: 4,
									}}
								>
									New Password
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(0,0,0,0.3)",
										borderRadius: 12,
										borderWidth: 1,
										borderColor: "rgba(255,204,0,0.2)",
										paddingHorizontal: 12,
									}}
								>
									<FontAwesome
										name="lock"
										size={16}
										color="#FFCC00"
										style={{ marginRight: 10 }}
									/>
									<TextInput
										value={newPassword}
										onChangeText={setNewPassword}
										placeholder="Enter new password"
										placeholderTextColor="#6B7280"
										secureTextEntry={!showNew}
										style={{
											flex: 1,
											paddingVertical: 14,
											color: "white",
											fontSize: 16,
										}}
									/>
									<Pressable onPress={() => setShowNew(!showNew)}>
										<FontAwesome
											name={showNew ? "eye-slash" : "eye"}
											size={16}
											color="#6B7280"
										/>
									</Pressable>
								</View>
								{newPassword.length > 0 && newPassword.length < 6 && (
									<Text
										style={{ color: "#EF4444", fontSize: 11, marginTop: 4 }}
									>
										Password must be at least 6 characters
									</Text>
								)}
							</View>

							{/* Confirm Password */}
							<View style={{ marginBottom: 24 }}>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 13,
										marginBottom: 8,
										marginLeft: 4,
									}}
								>
									Confirm Password
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(0,0,0,0.3)",
										borderRadius: 12,
										borderWidth: 1,
										borderColor: "rgba(255,204,0,0.2)",
										paddingHorizontal: 12,
									}}
								>
									<FontAwesome
										name="lock"
										size={16}
										color="#FFCC00"
										style={{ marginRight: 10 }}
									/>
									<TextInput
										value={confirmPassword}
										onChangeText={setConfirmPassword}
										placeholder="Confirm new password"
										placeholderTextColor="#6B7280"
										secureTextEntry={!showConfirm}
										style={{
											flex: 1,
											paddingVertical: 14,
											color: "white",
											fontSize: 16,
										}}
									/>
									<Pressable onPress={() => setShowConfirm(!showConfirm)}>
										<FontAwesome
											name={showConfirm ? "eye-slash" : "eye"}
											size={16}
											color="#6B7280"
										/>
									</Pressable>
								</View>
								{confirmPassword.length > 0 &&
									newPassword !== confirmPassword && (
										<Text
											style={{ color: "#EF4444", fontSize: 11, marginTop: 4 }}
										>
											Passwords do not match
										</Text>
									)}
							</View>

							<View style={{ flexDirection: "row", gap: 12 }}>
								<Pressable
									onPress={handleClose}
									style={({ pressed }) => ({
										flex: 1,
										backgroundColor: "rgba(255,255,255,0.05)",
										padding: 14,
										borderRadius: 12,
										alignItems: "center",
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.1)",
										opacity: pressed ? 0.8 : 1,
									})}
								>
									<Text
										style={{
											color: "#9CA3AF",
											fontSize: 16,
											fontWeight: "600",
										}}
									>
										Cancel
									</Text>
								</Pressable>

								<Pressable
									onPress={handleSubmit}
									disabled={isLoading || !isFormValid()}
									style={({ pressed }) => ({
										flex: 1,
										backgroundColor: isFormValid()
											? "#FFCC00"
											: "rgba(255,204,0,0.3)",
										padding: 14,
										borderRadius: 12,
										alignItems: "center",
										opacity: pressed && isFormValid() ? 0.8 : 1,
									})}
								>
									{isLoading ? (
										<ActivityIndicator color="#0A0F1E" />
									) : (
										<Text
											style={{
												color: isFormValid() ? "#0A0F1E" : "#6B7280",
												fontSize: 16,
												fontWeight: "bold",
											}}
										>
											Update
										</Text>
									)}
								</Pressable>
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</KeyboardAvoidingView>
		</Modal>
	);
}
