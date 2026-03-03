import { joinBlock } from "@/src/api/joinBlock.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";

interface JoinBlockCardProps {
	onSuccess: () => void;
}

export default function JoinBlockCard({ onSuccess }: JoinBlockCardProps) {
	const { token } = useAuth();
	const [inviteCode, setInviteCode] = useState("");
	const [loading, setLoading] = useState(false);

	const handleJoin = async () => {
		if (!inviteCode.trim()) {
			ToastService.showError({
				message: "Please enter an invite code",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setLoading(true);
		try {
			await joinBlock(token!, inviteCode.trim().toLowerCase());
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Successfully joined block!",
				duration: 3000,
				position: "bottom",
			});
			setInviteCode("");
			onSuccess();
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to join block",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 24,
				marginBottom: 20,
			}}
		>
			<View
				style={{
					width: 70,
					height: 70,
					borderRadius: 20,
					backgroundColor: "rgba(255,204,0,0.1)",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
					alignSelf: "center",
				}}
			>
				<FontAwesome name="key" size={32} color="#FFCC00" />
			</View>

			<Text
				style={{
					color: "white",
					fontSize: 20,
					fontWeight: "bold",
					textAlign: "center",
					marginBottom: 8,
				}}
			>
				Join a Block
			</Text>

			<Text
				style={{
					color: "#9CA3AF",
					fontSize: 14,
					textAlign: "center",
					marginBottom: 24,
					lineHeight: 20,
				}}
			>
				Enter the invite code provided by your administrator to join your hostel
				block
			</Text>

			<View
				style={{
					backgroundColor: "rgba(0,0,0,0.3)",
					borderRadius: 12,
					borderWidth: 1,
					borderColor: "rgba(255,204,0,0.3)",
					marginBottom: 16,
				}}
			>
				<TextInput
					value={inviteCode}
					onChangeText={setInviteCode}
					placeholder="Enter 8-character code"
					placeholderTextColor="#6B7280"
					autoCapitalize="none"
					autoCorrect={false}
					maxLength={8}
					style={{
						color: "white",
						fontSize: 18,
						padding: 16,
						textAlign: "center",
						letterSpacing: 2,
						fontWeight: "600",
					}}
				/>
			</View>

			<Pressable
				onPress={handleJoin}
				disabled={loading}
				style={({ pressed }) => ({
					backgroundColor: "#FFCC00",
					borderRadius: 12,
					padding: 16,
					alignItems: "center",
					opacity: loading ? 0.7 : pressed ? 0.9 : 1,
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
						Join Block
					</Text>
				)}
			</Pressable>

			<View
				style={{
					marginTop: 20,
					padding: 12,
					backgroundColor: "rgba(255,255,255,0.03)",
					borderRadius: 8,
				}}
			>
				<Text
					style={{
						color: "#6B7280",
						fontSize: 12,
						textAlign: "center",
					}}
				>
					Contact your hostel administrator if you don't have an invite code
				</Text>
			</View>
		</LinearGradient>
	);
}
