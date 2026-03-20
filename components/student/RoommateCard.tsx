import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface Roommate {
	_id: string;
	name?: string;
	email?: string;
	rollNo?: string;
	branch?: string;
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
	const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(
		null,
	);
	const [modalVisible, setModalVisible] = useState(false);

	const validRoommates = roommates.filter(
		(r) => r && r._id && r.name && r._id !== currentUserId,
	);

	const handleRoommatePress = (roommate: Roommate) => {
		setSelectedRoommate(roommate);
		setModalVisible(true);
	};

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
			{/* Header */}
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
						borderRadius: 14,
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
						Room {roomNumber}
					</Text>
					<Text style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>
						{roommates.length}{" "}
						{roommates.length === 1 ? "occupant" : "occupants"}
					</Text>
				</View>
			</View>

			<View
				style={{
					height: 1,
					backgroundColor: "rgba(255,255,255,0.07)",
					marginBottom: 14,
				}}
			/>

			{/* Roommate list */}
			<View style={{ gap: 10 }}>
				{validRoommates.map((roommate) => (
					<Pressable
						key={roommate._id}
						onPress={() => handleRoommatePress(roommate)}
						style={({ pressed }) => ({
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "rgba(255,255,255,0.04)",
							borderWidth: 1,
							borderColor: pressed
								? "rgba(255,204,0,0.25)"
								: "rgba(255,255,255,0.07)",
							borderRadius: 14,
							padding: 12,
							gap: 12,
							opacity: pressed ? 0.85 : 1,
						})}
					>
						{/* Avatar */}
						<View
							style={{
								width: 34,
								height: 34,
								borderRadius: 20,
								backgroundColor: "rgba(74,222,128,0.1)",
								borderWidth: 1,
								borderColor: "rgba(74,222,128,0.2)",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								style={{
									color: "#4ADE80",
									fontSize: 16,
									fontWeight: "700",
								}}
							>
								{(roommate.name || "?").charAt(0).toUpperCase()}
							</Text>
						</View>

						{/* Name + branch */}
						<View style={{ flex: 1 }}>
							<Text
								style={{
									color: "white",
									fontSize: 14,
									fontWeight: "600",
									marginBottom: 3,
								}}
							>
								{roommate.name || "Unknown"}
							</Text>
						</View>

						{/* Right side: status + chevron */}
						<View style={{ alignItems: "flex-end", gap: 6 }}>
							<FontAwesome name="chevron-right" size={20} color="#FFCC00" />
						</View>
					</Pressable>
				))}
			</View>

			{/* Roommate detail modal */}
			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.6)",
						justifyContent: "center",
						alignItems: "center",
						padding: 24,
					}}
					onPress={() => setModalVisible(false)}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={{ width: "100%", maxWidth: 360 }}
					>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderRadius: 18,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								overflow: "hidden",
							}}
						>
							<View
								style={{
									padding: 18,
									borderBottomWidth: 1,
									borderBottomColor: "rgba(255,255,255,0.07)",
									flexDirection: "row",
									alignItems: "center",
									gap: 12,
								}}
							>
								<View
									style={{
										width: 44,
										height: 44,
										borderRadius: 12,
										backgroundColor: "rgba(255,204,0,0.12)",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Text
										style={{
											color: "#FFCC00",
											fontSize: 16,
											fontWeight: "700",
										}}
									>
										{(selectedRoommate?.name || "?").charAt(0).toUpperCase()}
									</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{ color: "white", fontSize: 16, fontWeight: "700" }}
									>
										{selectedRoommate?.name || "Unknown"}
									</Text>
								</View>
								<Pressable
									onPress={() => setModalVisible(false)}
									style={({ pressed }) => ({
										opacity: pressed ? 0.6 : 1,
										padding: 4,
									})}
								>
									<FontAwesome name="times" size={22} color="#FFCC00" />
								</Pressable>
							</View>

							<View style={{ padding: 18, gap: 10 }}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										gap: 10,
									}}
								>
									<View
										style={{
											flex: 1,
											backgroundColor: "rgba(255,255,255,0.04)",
											borderRadius: 12,
											padding: 12,
										}}
									>
										<Text style={{ color: "#6B7280", fontSize: 11 }}>
											Roll No
										</Text>
										<Text
											style={{ color: "white", fontSize: 14, marginTop: 4 }}
										>
											{selectedRoommate?.rollNo || "Not set"}
										</Text>
									</View>
									<View
										style={{
											flex: 1,
											backgroundColor: "rgba(255,255,255,0.04)",
											borderRadius: 12,
											padding: 12,
										}}
									>
										<Text style={{ color: "#6B7280", fontSize: 11 }}>
											Branch
										</Text>
										<Text
											style={{ color: "white", fontSize: 14, marginTop: 4 }}
										>
											{selectedRoommate?.branch || "Not set"}
										</Text>
									</View>
								</View>
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>
		</LinearGradient>
	);
}
