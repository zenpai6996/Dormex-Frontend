import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
}

export default function ErrorState({
	message = "Failed to load dashboard",
	onRetry,
}: ErrorStateProps) {
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
		</LinearGradient>
	);
}
