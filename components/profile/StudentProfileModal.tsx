import { changePassword } from "@/src/api/profile.api";
import { useAuth } from "@/src/context/AuthContext";
import { UserProfile } from "@/src/types/profile.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";
import AboutSection from "./AboutSection";
import ChangePasswordModal from "./changePasswordModal";

interface StudentProfileModalProps {
	onClose: () => void;
	profile: UserProfile | null;
	loading: boolean;
}

export default function StudentProfileModal({
	onClose,
	profile,
	loading,
}: StudentProfileModalProps) {
	const { logout, token } = useAuth();
	const router = useRouter();
	const [passwordModalVisible, setPasswordModalVisible] = useState(false);
	const [changingPassword, setChangingPassword] = useState(false);

	const handleLogout = async () => {
		Alert.alert({
			title: "Logout",
			description: "Are you sure you want to logout?",
			buttons: [
				{
					text: "Cancel",
					textStyle: { color: "#9CA3AF" },
					onPress: () => {},
				},
				{
					text: "Logout",
					textStyle: { color: "#EF4444" },
					onPress: async () => {
						try {
							await logout();
							onClose();
							router.replace("/(auth)");
						} catch (error) {
							ToastService.showError({
								message: "Failed to logout",
								duration: 3000,
								position: "bottom",
							});
						}
					},
				},
			],
		});
	};

	const handleChangePassword = async (data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => {
		if (!profile) return;

		setChangingPassword(true);
		try {
			// Use token from useAuth, not profile._id
			await changePassword(token!, {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
			});
			ToastService.show({
				message: "Password changed successfully",
				duration: 3000,
				position: "bottom",
			});
			setPasswordModalVisible(false);
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to change password",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setChangingPassword(false);
		}
	};

	const getStatusColor = (status?: string) => {
		switch (status) {
			case "ACTIVE":
				return "#4ADE80";
			case "LEFT":
				return "#EF4444";
			case "TRANSFERRED":
				return "#FFB347";
			default:
				return "#9CA3AF";
		}
	};

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<ScrollView
				contentContainerStyle={{
					padding: 16,
					paddingTop: 60,
					paddingBottom: 40,
				}}
				showsVerticalScrollIndicator={false}
			>
				{/* Close button */}
				<Pressable
					onPress={onClose}
					style={{
						alignSelf: "flex-end",
						width: 44,
						height: 44,
						borderRadius: 22,
						backgroundColor: "rgba(255,255,255,0.1)",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 20,
					}}
				>
					<FontAwesome name="close" size={24} color="#FFCC00" />
				</Pressable>

				{/* Header */}
				<View style={{ alignItems: "center", marginBottom: 24 }}>
					<View
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							backgroundColor: "rgba(255,204,0,0.1)",
							alignItems: "center",
							justifyContent: "center",
							borderWidth: 2,
							borderColor: "rgba(255,204,0,0.3)",
							marginBottom: 16,
						}}
					>
						<FontAwesome name="user-circle" size={60} color="#FFCC00" />
					</View>
					{/* <Text
						style={{
							color: "white",
							fontSize: 28,
							fontWeight: "bold",
						}}
					>
						Profile
					</Text> */}
				</View>

				{loading ? (
					<ActivityIndicator color="#FFCC00" style={{ padding: 20 }} />
				) : profile ? (
					<>
						{/* Profile Info Card */}
						<LinearGradient
							colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
							style={{
								borderRadius: 20,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								padding: 22,
								marginBottom: 20,
							}}
						>
							<View style={{ gap: 18 }}>
								<View style={{ gap: 4 }}>
									<Text style={{ color: "white", fontSize: 18 }}>Name</Text>
									<Text
										style={{
											color: "#9CA3AF",
											fontSize: 13,
											fontWeight: "600",
										}}
									>
										{profile.name}
									</Text>
								</View>

								<View style={{ gap: 4 }}>
									<Text style={{ color: "white", fontSize: 18 }}>Email</Text>
									<Text
										style={{
											color: "#9CA3AF",
											fontSize: 13,
										}}
									>
										{profile.email}
									</Text>
								</View>

								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "flex-start",
									}}
								>
									<View style={{ gap: 4 }}>
										<Text style={{ color: "white", fontSize: 15 }}>Status</Text>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												gap: 6,
											}}
										>
											<View
												style={{
													width: 8,
													height: 8,
													borderRadius: 4,
													backgroundColor: getStatusColor(profile.status),
												}}
											/>
											<Text
												style={{
													color: getStatusColor(profile.status),
													fontSize: 14,
													fontWeight: "500",
												}}
											>
												{profile.status}
											</Text>
										</View>
									</View>

									{profile.block && (
										<View style={{ alignItems: "center", gap: 4 }}>
											<Text style={{ color: "white", fontSize: 15 }}>
												Block
											</Text>
											<Text
												style={{
													color: "#FFCC00",
													fontSize: 14,
													fontWeight: "500",
												}}
											>
												{profile.block.name}
											</Text>
										</View>
									)}

									{profile.room && (
										<View style={{ alignItems: "flex-end", gap: 4 }}>
											<Text style={{ color: "white", fontSize: 15 }}>Room</Text>
											<Text
												style={{
													color: "#9CA3AF",
													fontSize: 14,
													fontWeight: "500",
												}}
											>
												{profile.room.roomNumber}
											</Text>
										</View>
									)}
								</View>

								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<View
										style={{
											backgroundColor: "rgba(255,204,0,0.15)",
											paddingHorizontal: 12,
											paddingVertical: 6,
											borderRadius: 8,
										}}
									>
										<Text
											style={{
												color: "#FFCC00",
												fontSize: 13,
												fontWeight: "600",
											}}
										>
											STUDENT
										</Text>
									</View>

									<Text style={{ color: "#6B7280", fontSize: 12 }}>
										Joined {new Date(profile.createdAt).toLocaleDateString()}
									</Text>
								</View>
							</View>
						</LinearGradient>

						{/* Actions */}
						<View style={{ gap: 12 }}>
							<Pressable
								onPress={() => setPasswordModalVisible(true)}
								style={({ pressed }) => ({
									backgroundColor: "rgba(255,204,0,0.1)",
									padding: 18,
									borderRadius: 16,
									borderWidth: 1,
									borderColor: "rgba(255,204,0,0.2)",
									flexDirection: "row",
									alignItems: "center",
									gap: 12,
									opacity: pressed ? 0.8 : 1,
								})}
							>
								<View
									style={{
										width: 44,
										height: 44,
										borderRadius: 12,
										backgroundColor: "rgba(255,204,0,0.15)",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FontAwesome name="lock" size={20} color="#FFCC00" />
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{ color: "white", fontSize: 16, fontWeight: "600" }}
									>
										Change Password
									</Text>
									<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
										Update your password
									</Text>
								</View>
								<FontAwesome name="chevron-right" size={16} color="#6B7280" />
							</Pressable>

							<Pressable
								onPress={handleLogout}
								style={({ pressed }) => ({
									backgroundColor: "rgba(239,68,68,0.1)",
									padding: 18,
									borderRadius: 16,
									borderWidth: 1,
									borderColor: "rgba(239,68,68,0.2)",
									flexDirection: "row",
									alignItems: "center",
									gap: 12,
									opacity: pressed ? 0.8 : 1,
								})}
							>
								<View
									style={{
										width: 44,
										height: 44,
										borderRadius: 12,
										backgroundColor: "rgba(239,68,68,0.15)",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FontAwesome name="sign-out" size={20} color="#EF4444" />
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											color: "#EF4444",
											fontSize: 16,
											fontWeight: "600",
										}}
									>
										Logout
									</Text>
									<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
										Sign out of your account
									</Text>
								</View>
							</Pressable>
						</View>

						{/* About Section */}
						<AboutSection />
					</>
				) : null}
			</ScrollView>

			<ChangePasswordModal
				visible={passwordModalVisible}
				onClose={() => setPasswordModalVisible(false)}
				onSubmit={handleChangePassword}
				isLoading={changingPassword}
			/>
		</LinearGradient>
	);
}
