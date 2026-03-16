import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface Roommate {
	_id: string;
	name?: string;
	email?: string;
	status?: string;
}

interface RoommateCardProps {
	roomNumber: string;
	roommates: Roommate[];
	currentUserId: string;
}

export default function RoommateCard({
	roomNumber,
	roommates,
	currentUserId,
}: RoommateCardProps) {
	const validRoommates = roommates.filter(
		(r) => r && r._id && r.name && r._id !== currentUserId,
	);

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 20,
				marginBottom: 16,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<View
					style={{
						width: 48,
						height: 48,
						borderRadius: 25,
						backgroundColor: "rgba(255,204,0,0.1)",
						alignItems: "center",
						justifyContent: "center",
						marginRight: 12,
					}}
				>
					<FontAwesome name="bed" size={20} color="#FFCC00" />
				</View>
				<View>
					<Text
						style={{
							color: "white",
							fontSize: 18,
							fontWeight: "bold",
						}}
					>
						Room : {roomNumber}
					</Text>
					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 13,
						}}
					>
						{roommates.length}{" "}
						{roommates.length === 1 ? "occupant" : "occupants"}
					</Text>
				</View>
			</View>

			<View
				style={{
					height: 1,
					backgroundColor: "rgba(255,255,255,0.1)",
					marginBottom: 16,
				}}
			/>

			{validRoommates.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						paddingVertical: 12,
					}}
				>
					<Text
						style={{
							color: "#6B7280",
							fontSize: 14,
						}}
					>
						No roommates yet
					</Text>
					<Text
						style={{
							color: "#4B5563",
							fontSize: 12,
							marginTop: 4,
						}}
					>
						You have this room to yourself
					</Text>
				</View>
			) : (
				validRoommates.map((roommate, index) => (
					<View
						key={roommate._id}
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingVertical: 5,
							borderBottomWidth: index < validRoommates.length - 1 ? 1 : 0,
							borderBottomColor: "rgba(255,255,255,0.05)",
						}}
					>
						<View
							style={{
								width: 40,
								height: 40,
								borderRadius: 20,
								backgroundColor: "rgba(74,222,128,0.1)",
								alignItems: "center",
								justifyContent: "center",
								marginRight: 12,
							}}
						>
							<Text
								style={{
									color: "#4ADE80",
									fontSize: 14,
									fontWeight: "bold",
								}}
							>
								{(roommate.name || "?").charAt(0).toUpperCase()}
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text
								style={{
									color: "white",
									fontSize: 15,
									fontWeight: "500",
									marginBottom: 2,
								}}
							>
								{roommate.name || "Unknown"}
							</Text>
							{/* <Text
								style={{
									color: "#6B7280",
									fontSize: 12,
								}}
							>
								{roommate.email || "No email"}
							</Text> */}
						</View>
						<View
							style={{
								backgroundColor:
									roommate.status === "ACTIVE"
										? "rgba(34,197,94,0.1)"
										: "rgba(156,163,175,0.1)",
								paddingHorizontal: 8,
								paddingVertical: 3,
								borderRadius: 6,
							}}
						>
							<Text
								style={{
									color: roommate.status === "ACTIVE" ? "#4ADE80" : "#9CA3AF",
									fontSize: 10,
									fontWeight: "600",
								}}
							>
								{roommate.status || "UNKNOWN"}
							</Text>
						</View>
					</View>
				))
			)}
		</LinearGradient>
	);
}
