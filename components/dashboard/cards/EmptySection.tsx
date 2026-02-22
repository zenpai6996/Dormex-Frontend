import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface EmptySectionProps {
	title: string;
	message: string;
	icon?: string;
}

export default function EmptySection({
	title,
	message,
	icon = "info-circle",
}: EmptySectionProps) {
	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
			style={{
				borderRadius: 16,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 24,
				alignItems: "center",
				marginBottom: 16,
			}}
		>
			<View
				style={{
					width: 60,
					height: 60,
					borderRadius: 30,
					backgroundColor: "rgba(255,204,0,0.1)",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
				}}
			>
				<FontAwesome name={icon} size={28} color="#FFCC00" />
			</View>
			<Text
				style={{
					color: "white",
					fontSize: 18,
					fontWeight: "600",
					marginBottom: 8,
				}}
			>
				{title}
			</Text>
			<Text style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}>
				{message}
			</Text>
		</LinearGradient>
	);
}
