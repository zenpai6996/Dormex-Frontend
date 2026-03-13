import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export default function MenuEmptyState() {
	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
			style={{
				borderRadius: 16,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 20,
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
					marginBottom: 12,
				}}
			>
				<FontAwesome name="cutlery" size={28} color="#FFCC00" />
			</View>

			<Text
				style={{
					color: "white",
					fontSize: 16,
					fontWeight: "600",
					marginBottom: 4,
				}}
			>
				Today's Menu Not Available
			</Text>

			<Text style={{ color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>
				The menu hasn't been set for today.{"\n"}
				Check back later or contact the mess staff.
			</Text>

			{/* Weekly schedule hint */}
			<View
				style={{
					flexDirection: "row",
					marginTop: 16,
					paddingTop: 16,
					borderTopWidth: 1,
					borderTopColor: "rgba(255,255,255,0.1)",
					width: "100%",
				}}
			>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 11 }}>MON</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#4A5568",
							marginTop: 4,
						}}
					/>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 11 }}>TUE</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#4A5568",
							marginTop: 4,
						}}
					/>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 11 }}>WED</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#4A5568",
							marginTop: 4,
						}}
					/>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 11 }}>THU</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#4A5568",
							marginTop: 4,
						}}
					/>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 11 }}>FRI</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#4A5568",
							marginTop: 4,
						}}
					/>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#FFCC00", fontSize: 11 }}>SAT</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#FFCC00",
							marginTop: 4,
						}}
					/>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 11 }}>SUN</Text>
					<View
						style={{
							width: 4,
							height: 4,
							borderRadius: 2,
							backgroundColor: "#4A5568",
							marginTop: 4,
						}}
					/>
				</View>
			</View>
		</LinearGradient>
	);
}
