import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface BlockStatsCardProps {
	blockName: string;
	totalStudents: number;
	totalRooms: number;
	occupiedRooms: number;
	vacantRooms: number;
	totalCapacity: number;
	occupiedSeats: number;
	availableSeats: number;
	inviteCodeExpiresAt?: string | null;
}

export default function BlockStatsCard({
	blockName,
	totalStudents,
	totalRooms,
	occupiedRooms,
	vacantRooms,
	totalCapacity,
	occupiedSeats,
	availableSeats,
	inviteCodeExpiresAt,
}: BlockStatsCardProps) {
	const [expanded, setExpanded] = useState(false);

	const occupancyRate = Math.round((occupiedSeats / totalCapacity) * 100);
	const roomOccupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

	const isExpiringSoon =
		inviteCodeExpiresAt &&
		new Date(inviteCodeExpiresAt).getTime() - new Date().getTime() <
			7 * 24 * 60 * 60 * 1000;

	return (
		<View style={{ marginBottom: 12 }}>
			<Pressable onPress={() => setExpanded(!expanded)}>
				<LinearGradient
					colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
					style={{
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 16,
					}}
				>
					{/* Header */}
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View
							style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
						>
							<View
								style={{
									width: 40,
									height: 40,
									borderRadius: 12,
									backgroundColor: "rgba(255,204,0,0.1)",
									alignItems: "center",
									justifyContent: "center",
									marginRight: 12,
								}}
							>
								<Text
									style={{ color: "#FFCC00", fontSize: 16, fontWeight: "bold" }}
								>
									{blockName.charAt(0)}
								</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text
									style={{ color: "white", fontSize: 16, fontWeight: "600" }}
								>
									Block {blockName}
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginTop: 4,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											backgroundColor:
												occupancyRate > 90
													? "rgba(239,68,68,0.1)"
													: "rgba(34,197,94,0.1)",
											paddingHorizontal: 8,
											paddingVertical: 2,
											borderRadius: 12,
										}}
									>
										<Text
											style={{
												color: occupancyRate > 90 ? "#EF4444" : "#4ADE80",
												fontSize: 12,
												fontWeight: "500",
											}}
										>
											{occupancyRate}% occupied
										</Text>
									</View>
									{isExpiringSoon && (
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												marginLeft: 8,
												backgroundColor: "rgba(255,204,0,0.1)",
												paddingHorizontal: 8,
												paddingVertical: 2,
												borderRadius: 12,
											}}
										>
											<FontAwesome name="clock-o" size={10} color="#FFCC00" />
											<Text
												style={{
													color: "#FFCC00",
													fontSize: 10,
													marginLeft: 4,
												}}
											>
												Invite expiring
											</Text>
										</View>
									)}
								</View>
							</View>
						</View>
						<FontAwesome
							name={expanded ? "chevron-up" : "chevron-down"}
							size={16}
							color="#9CA3AF"
						/>
					</View>

					{/* Quick Stats */}
					<View
						style={{
							flexDirection: "row",
							marginTop: 16,
							justifyContent: "space-around",
							paddingTop: 12,
							borderTopWidth: 1,
							borderTopColor: "rgba(255,255,255,0.1)",
						}}
					>
						<View style={{ alignItems: "center" }}>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Students</Text>
							<Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
								{totalStudents}
							</Text>
						</View>
						<View style={{ alignItems: "center" }}>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Rooms</Text>
							<Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
								{occupiedRooms}/{totalRooms}
							</Text>
						</View>
						<View style={{ alignItems: "center" }}>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Vacant</Text>
							<Text
								style={{ color: "#4ADE80", fontSize: 16, fontWeight: "600" }}
							>
								{vacantRooms}
							</Text>
						</View>
					</View>

					{/* Expanded Details */}
					{expanded && (
						<View
							style={{
								marginTop: 16,
								paddingTop: 16,
								borderTopWidth: 1,
								borderTopColor: "rgba(255,255,255,0.1)",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									marginBottom: 8,
								}}
							>
								<Text style={{ color: "#9CA3AF" }}>Total Capacity</Text>
								<Text style={{ color: "white", fontWeight: "500" }}>
									{totalCapacity} seats
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									marginBottom: 8,
								}}
							>
								<Text style={{ color: "#9CA3AF" }}>Occupied Seats</Text>
								<Text style={{ color: "white", fontWeight: "500" }}>
									{occupiedSeats}
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									marginBottom: 8,
								}}
							>
								<Text style={{ color: "#9CA3AF" }}>Available Seats</Text>
								<Text style={{ color: "#4ADE80", fontWeight: "500" }}>
									{availableSeats}
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text style={{ color: "#9CA3AF" }}>Room Occupancy</Text>
								<Text style={{ color: "white", fontWeight: "500" }}>
									{roomOccupancyRate}%
								</Text>
							</View>
						</View>
					)}
				</LinearGradient>
			</Pressable>
		</View>
	);
}
