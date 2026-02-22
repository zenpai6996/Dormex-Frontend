import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface TodayMenuProps {
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
}

export default function TodayMenu({
	day,
	breakfast,
	lunch,
	dinner,
}: TodayMenuProps) {
	return (
		<LinearGradient
			colors={["rgba(255,204,0,0.1)", "rgba(255,204,0,0.02)"]}
			style={{
				borderRadius: 16,
				borderWidth: 1,
				borderColor: "rgba(255,204,0,0.2)",
				padding: 16,
				marginBottom: 16,
			}}
		>
			<View
				style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
			>
				<FontAwesome name="cutlery" size={20} color="#FFCC00" />
				<Text
					style={{
						color: "white",
						fontSize: 16,
						fontWeight: "600",
						marginLeft: 8,
					}}
				>
					Today's Menu - {day}
				</Text>
			</View>

			<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
				<View style={{ alignItems: "center", flex: 1 }}>
					<View
						style={{
							backgroundColor: "rgba(255,255,255,0.05)",
							width: 40,
							height: 40,
							borderRadius: 20,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
						}}
					>
						<FontAwesome name="sun-o" size={20} color="#FFCC00" />
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
						Breakfast
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontWeight: "500",
							textAlign: "center",
						}}
					>
						{breakfast}
					</Text>
				</View>

				<View style={{ alignItems: "center", flex: 1 }}>
					<View
						style={{
							backgroundColor: "rgba(255,255,255,0.05)",
							width: 40,
							height: 40,
							borderRadius: 20,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
						}}
					>
						<FontAwesome name="sun-o" size={20} color="#FFCC00" />
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
						Lunch
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontWeight: "500",
							textAlign: "center",
						}}
					>
						{lunch}
					</Text>
				</View>

				<View style={{ alignItems: "center", flex: 1 }}>
					<View
						style={{
							backgroundColor: "rgba(255,255,255,0.05)",
							width: 40,
							height: 40,
							borderRadius: 20,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
						}}
					>
						<FontAwesome name="moon-o" size={20} color="#FFCC00" />
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
						Dinner
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontWeight: "500",
							textAlign: "center",
						}}
					>
						{dinner}
					</Text>
				</View>
			</View>
		</LinearGradient>
	);
}
