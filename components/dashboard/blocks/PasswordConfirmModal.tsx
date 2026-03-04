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

interface PasswordConfirmModalProps {
	visible: boolean;
	onClose: () => void;
	onConfirm: (password: string) => Promise<void>;
	blockName: string;
	isLoading: boolean;
}

export default function PasswordConfirmModal({
	visible,
	onClose,
	onConfirm,
	blockName,
	isLoading,
}: PasswordConfirmModalProps) {
	const [password, setPassword] = useState("");

	const handleConfirm = async () => {
		if (!password.trim()) {
			return;
		}
		await onConfirm(password);
		setPassword("");
	};

	const handleClose = () => {
		setPassword("");
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
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
							colors={["#1A1F32", "#0A0F1E"]}
							style={{
								borderRadius: 24,
								borderWidth: 1,
								borderColor: "rgba(255,204,0,0.3)",
								padding: 20,
							}}
						>
							{/* Warning Icon */}
							<View
								style={{
									alignItems: "center",
									marginBottom: 16,
								}}
							>
								<View
									style={{
										width: 70,
										height: 70,
										borderRadius: 35,
										backgroundColor: "rgba(239,68,68,0.15)",
										alignItems: "center",
										justifyContent: "center",
										borderWidth: 2,
										borderColor: "rgba(239,68,68,0.3)",
									}}
								>
									<FontAwesome name="warning" size={32} color="#EF4444" />
								</View>
							</View>

							{/* Title */}
							<Text
								style={{
									color: "white",
									fontSize: 22,
									fontWeight: "bold",
									textAlign: "center",
									marginBottom: 8,
								}}
							>
								Delete Block {blockName}
							</Text>

							{/* Warning Message */}
							<Text
								style={{
									color: "#EF4444",
									fontSize: 14,
									textAlign: "center",
									marginBottom: 16,
									backgroundColor: "rgba(239,68,68,0.1)",
									padding: 12,
									borderRadius: 12,
									borderWidth: 1,
									borderColor: "rgba(239,68,68,0.2)",
								}}
							>
								This action cannot be undone. All rooms and student assignments
								in this block will be permanently deleted.
							</Text>

							{/* Password Input */}
							<View style={{ marginBottom: 20 }}>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 13,
										marginBottom: 8,
										marginLeft: 4,
									}}
								>
									Enter your admin password to confirm
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
										value={password}
										onChangeText={setPassword}
										placeholder="Enter password"
										placeholderTextColor="#6B7280"
										secureTextEntry
										autoFocus
										style={{
											flex: 1,
											paddingVertical: 14,
											color: "white",
											fontSize: 16,
										}}
									/>
								</View>
							</View>

							{/* Action Buttons */}
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
									onPress={handleConfirm}
									disabled={isLoading || !password.trim()}
									style={({ pressed }) => ({
										flex: 1,
										backgroundColor: password.trim()
											? "rgba(239,68,68,0.9)"
											: "rgba(239,68,68,0.3)",
										padding: 14,
										borderRadius: 12,
										alignItems: "center",
										borderWidth: 1,
										borderColor: password.trim()
											? "#EF4444"
											: "rgba(239,68,68,0.2)",
										opacity: pressed && password.trim() ? 0.8 : 1,
									})}
								>
									{isLoading ? (
										<ActivityIndicator color="white" size="small" />
									) : (
										<Text
											style={{
												color: password.trim() ? "white" : "#6B7280",
												fontSize: 16,
												fontWeight: "600",
											}}
										>
											Delete
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
