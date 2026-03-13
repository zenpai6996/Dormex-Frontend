import { useAuth } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
	onClose?: () => void;
}

export default function ErrorState({
	message = "Failed to load dashboard",
	onRetry,
	onClose,
}: ErrorStateProps) {
	const { logout } = useAuth();
	const router = useRouter();

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
							onClose?.();
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

	return (
		<LinearGradient
			colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 24,
			}}
		>
			<View
				style={{
					width: 80,
					height: 80,
					borderRadius: 40,
					backgroundColor: "rgba(239,68,68,0.1)",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 24,
				}}
			>
				<FontAwesome name="exclamation-triangle" size={32} color="#EF4444" />
			</View>

			<Text
				style={{
					color: "white",
					fontSize: 20,
					fontWeight: "600",
					marginBottom: 8,
				}}
			>
				Oops!
			</Text>

			<Text
				style={{
					color: "#9CA3AF",
					fontSize: 16,
					textAlign: "center",
					marginBottom: 24,
				}}
			>
				{message}
			</Text>

			{onRetry && (
				<Pressable
					onPress={onRetry}
					style={({ pressed }) => ({
						backgroundColor: pressed ? "#ffcc00ad" : "#ffcc00",
						paddingVertical: 12,
						paddingHorizontal: 24,
						borderRadius: 30,
						alignItems: "center",
						transform: [{ scale: pressed ? 0.98 : 1 }],
					})}
				>
					<Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>
						Try Again
					</Text>
				</Pressable>
			)}
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
		</LinearGradient>
	);
}
