import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface WaitingForRoomCardProps {
	blockName: string;
}

export default function WaitingForRoomCard({
	blockName,
}: WaitingForRoomCardProps) {
	return (
		<LinearGradient
			colors={["rgba(59,130,246,0.1)", "rgba(59,130,246,0.05)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(59,130,246,0.2)",
				padding: 24,
				marginBottom: 20,
			}}
		>
			<View
				style={{
					width: 70,
					height: 70,
					borderRadius: 20,
					backgroundColor: "rgba(59,130,246,0.1)",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
					alignSelf: "center",
				}}
			>
				<FontAwesome name="clock-o" size={32} color="#60A5FA" />
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
				Room Assignment Pending
			</Text>

			<Text
				style={{
					color: "#9CA3AF",
					fontSize: 14,
					textAlign: "center",
					marginBottom: 16,
					lineHeight: 20,
				}}
			>
				You've successfully joined{" "}
				<Text style={{ color: "#60A5FA", fontWeight: "600" }}>
					Block {blockName}
				</Text>
				. Your room is being assigned by the administrator.
			</Text>

			<View
				style={{
					backgroundColor: "rgba(59,130,246,0.1)",
					borderRadius: 12,
					padding: 16,
					alignItems: "center",
				}}
			>
				<Text
					style={{
						color: "#60A5FA",
						fontSize: 13,
						textAlign: "center",
					}}
				>
					Check back later or contact your administrator for updates
				</Text>
			</View>
		</LinearGradient>
	);
}
