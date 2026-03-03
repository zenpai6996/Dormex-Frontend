import { createRoom } from "@/src/api/room.api";
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

interface Room {
	_id: string;
	roomNumber: string;
	capacity: number;
	occupants: any[];
}

interface BlockRoomsProps {
	blockId: string;
	rooms: Room[];
	stats: {
		totalRooms: number;
		occupiedRooms: number;
		totalCapacity: number;
		occupiedSeats: number;
	};
	onRefresh: () => void;
}

export default function BlockRooms({
	blockId,
	rooms,
	stats,
	onRefresh,
}: BlockRoomsProps) {
	const { token } = useAuth();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [roomNumber, setRoomNumber] = useState("");
	const [capacity, setCapacity] = useState("");
	const [loading, setLoading] = useState(false);

	const handleCreateRoom = async () => {
		if (!roomNumber.trim() || !capacity.trim()) {
			ToastService.showError({
				message: "Please fill in all fields",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		const cap = parseInt(capacity);
		if (isNaN(cap) || cap <= 0) {
			ToastService.showError({
				message: "Please enter a valid capacity",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setLoading(true);
		try {
			await createRoom(token!, {
				blockId,
				roomNumber: roomNumber.trim(),
				capacity: cap,
			});
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Room created successfully",
				duration: 3000,
				position: "bottom",
			});
			setRoomNumber("");
			setCapacity("");
			setShowCreateForm(false);
			onRefresh();
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to create room",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	const occupancyPercentage =
		stats.totalCapacity > 0
			? Math.round((stats.occupiedSeats / stats.totalCapacity) * 100)
			: 0;

	return (
		<View>
			<LinearGradient
				colors={["rgba(255,204,0,0.1)", "rgba(255,204,0,0.05)"]}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(255,204,0,0.2)",
					padding: 16,
					marginBottom: 16,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 12,
					}}
				>
					<View style={{ alignItems: "center", flex: 1 }}>
						<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
							Total Rooms
						</Text>
						<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
							{stats.totalRooms}
						</Text>
					</View>
					<View
						style={{
							width: 1,
							backgroundColor: "rgba(255,255,255,0.1)",
						}}
					/>
					<View style={{ alignItems: "center", flex: 1 }}>
						<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
							Occupied
						</Text>
						<Text
							style={{ color: "#4ADE80", fontSize: 24, fontWeight: "bold" }}
						>
							{stats.occupiedRooms}
						</Text>
					</View>
					<View
						style={{
							width: 1,
							backgroundColor: "rgba(255,255,255,0.1)",
						}}
					/>
					<View style={{ alignItems: "center", flex: 1 }}>
						<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
							Occupancy
						</Text>
						<Text
							style={{ color: "#FFCC00", fontSize: 24, fontWeight: "bold" }}
						>
							{occupancyPercentage}%
						</Text>
					</View>
				</View>
				<View
					style={{
						height: 4,
						backgroundColor: "rgba(255,255,255,0.1)",
						borderRadius: 2,
						overflow: "hidden",
					}}
				>
					<View
						style={{
							width: `${occupancyPercentage}%`,
							height: "100%",
							backgroundColor: "#FFCC00",
							borderRadius: 2,
						}}
					/>
				</View>
			</LinearGradient>

			<Pressable
				onPress={() => setShowCreateForm(!showCreateForm)}
				style={({ pressed }) => ({
					backgroundColor: showCreateForm
						? "rgba(239,68,68,0.1)"
						: "rgba(255,204,0,0.1)",
					borderRadius: 12,
					padding: 14,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
					borderWidth: 1,
					borderColor: showCreateForm
						? "rgba(239,68,68,0.3)"
						: "rgba(255,204,0,0.3)",
					transform: [{ scale: pressed ? 0.98 : 1 }],
				})}
			>
				<FontAwesome
					name={showCreateForm ? "times" : "plus"}
					size={16}
					color={showCreateForm ? "#EF4444" : "#FFCC00"}
					style={{ marginRight: 8 }}
				/>
				<Text
					style={{
						color: showCreateForm ? "#EF4444" : "#FFCC00",
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					{showCreateForm ? "Cancel" : "Add New Room"}
				</Text>
			</Pressable>

			{showCreateForm && (
				<LinearGradient
					colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
					style={{
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 16,
						marginBottom: 16,
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 12,
						}}
					>
						Create New Room
					</Text>
					<View style={{ marginBottom: 12 }}>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 12,
								marginBottom: 6,
							}}
						>
							Room Number
						</Text>
						<TextInput
							value={roomNumber}
							onChangeText={setRoomNumber}
							placeholder="e.g., 101"
							placeholderTextColor="#6B7280"
							style={{
								backgroundColor: "rgba(0,0,0,0.3)",
								borderRadius: 8,
								padding: 12,
								color: "white",
								fontSize: 16,
							}}
						/>
					</View>
					<View style={{ marginBottom: 16 }}>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 12,
								marginBottom: 6,
							}}
						>
							Capacity
						</Text>
						<TextInput
							value={capacity}
							onChangeText={setCapacity}
							placeholder="e.g., 2"
							placeholderTextColor="#6B7280"
							keyboardType="number-pad"
							style={{
								backgroundColor: "rgba(0,0,0,0.3)",
								borderRadius: 8,
								padding: 12,
								color: "white",
								fontSize: 16,
							}}
						/>
					</View>
					<Pressable
						onPress={handleCreateRoom}
						disabled={loading}
						style={({ pressed }) => ({
							backgroundColor: "#FFCC00",
							borderRadius: 8,
							padding: 14,
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
								Create Room
							</Text>
						)}
					</Pressable>
				</LinearGradient>
			)}

			{rooms.length === 0 ? (
				<LinearGradient
					colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
					style={{
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 32,
						alignItems: "center",
					}}
				>
					<View
						style={{
							width: 60,
							height: 60,
							borderRadius: 20,
							backgroundColor: "rgba(255,204,0,0.1)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 12,
						}}
					>
						<FontAwesome name="bed" size={28} color="#FFCC00" />
					</View>
					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 4,
						}}
					>
						No Rooms Yet
					</Text>
					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 14,
							textAlign: "center",
						}}
					>
						Add rooms to start assigning students
					</Text>
				</LinearGradient>
			) : (
				rooms.map((room) => {
					const occupancy = Math.round(
						(room.occupants.length / room.capacity) * 100,
					);
					return (
						<LinearGradient
							key={room._id}
							colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								padding: 16,
								marginBottom: 12,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 12,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<View
										style={{
											width: 44,
											height: 44,
											borderRadius: 12,
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
												fontWeight: "600",
											}}
										>
											Room {room.roomNumber}
										</Text>
										<Text
											style={{
												color: "#9CA3AF",
												fontSize: 13,
											}}
										>
											Capacity: {room.capacity} students
										</Text>
									</View>
								</View>
								<View
									style={{
										backgroundColor:
											room.occupants.length === room.capacity
												? "rgba(239,68,68,0.1)"
												: "rgba(34,197,94,0.1)",
										paddingHorizontal: 10,
										paddingVertical: 4,
										borderRadius: 8,
									}}
								>
									<Text
										style={{
											color:
												room.occupants.length === room.capacity
													? "#EF4444"
													: "#4ADE80",
											fontSize: 12,
											fontWeight: "600",
										}}
									>
										{room.occupants.length === room.capacity
											? "Full"
											: "Available"}
									</Text>
								</View>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginBottom: 8,
								}}
							>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 12,
										marginRight: 8,
									}}
								>
									Occupancy:
								</Text>
								<View
									style={{
										flex: 1,
										height: 6,
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 3,
										overflow: "hidden",
									}}
								>
									<View
										style={{
											width: `${occupancy}%`,
											height: "100%",
											backgroundColor:
												occupancy === 100 ? "#EF4444" : "#4ADE80",
											borderRadius: 3,
										}}
									/>
								</View>
								<Text
									style={{
										color: "white",
										fontSize: 12,
										marginLeft: 8,
										fontWeight: "500",
									}}
								>
									{room.occupants.length}/{room.capacity}
								</Text>
							</View>

							{room.occupants.length > 0 && (
								<View
									style={{
										flexDirection: "row",
										flexWrap: "wrap",
										gap: 6,
										marginTop: 8,
									}}
								>
									{room.occupants.map((occupant: any) => (
										<View
											key={occupant._id}
											style={{
												backgroundColor: "rgba(255,255,255,0.05)",
												paddingHorizontal: 10,
												paddingVertical: 4,
												borderRadius: 6,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<FontAwesome
												name="user"
												size={10}
												color="#9CA3AF"
												style={{ marginRight: 4 }}
											/>
											<Text
												style={{
													color: "#9CA3AF",
													fontSize: 12,
												}}
											>
												{occupant.name}
											</Text>
										</View>
									))}
								</View>
							)}
						</LinearGradient>
					);
				})
			)}
		</View>
	);
}
