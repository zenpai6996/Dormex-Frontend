import {
	createRoom,
	deleteRoom,
	removeStudentFromRoom,
} from "@/src/api/room.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	ActivityIndicator,
	LayoutAnimation,
	Modal,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";

interface Occupant {
	_id: string;
	name: string;
	email?: string;
	rollNo?: string;
	phoneNumber?: string;
	branch?: string;
}

interface Room {
	_id: string;
	roomNumber: string;
	capacity: number;
	occupants: Occupant[];
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
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"list" | "grid">("list");
	const [roomSearch, setRoomSearch] = useState("");
	const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>(
		{},
	);
	const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(
		null,
	);
	const [studentModalVisible, setStudentModalVisible] = useState(false);

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

	const handleUnassignStudent = (
		studentId: string,
		studentName: string,
		roomId: string,
	) => {
		Alert.alert({
			title: `Remove Student ?`,
			description: `Remove ${studentName} from this room `,
			buttons: [
				{ text: "Cancel", textStyle: { color: "#9CA3AF" }, onPress: () => {} },
				{
					text: "Remove",
					textStyle: { color: "#EF4444" },
					onPress: async () => {
						setActionLoading(studentId);
						try {
							await removeStudentFromRoom(token!, studentId);
							ToastService.show({
								contentContainerStyle: {
									borderStartColor: "#4ADE80",
									borderStartWidth: 5,
									borderEndColor: "#4ADE80",
									borderEndWidth: 5,
									backgroundColor: "#0A0F1E",
								},
								message: "Student removed from room",
								duration: 3000,
								position: "bottom",
							});
							setStudentModalVisible(false);
							onRefresh();
						} catch (error: any) {
							ToastService.showError({
								message: error.message,
								duration: 3000,
								position: "bottom",
							});
						} finally {
							setActionLoading(null);
						}
					},
				},
			],
		});
	};

	const handleDeleteRoom = (
		roomId: string,
		roomNumber: string,
		hasOccupants: boolean,
	) => {
		if (hasOccupants) {
			ToastService.showError({
				message:
					"Cannot delete room with students. Please unassign all students first.",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		Alert.alert({
			title: `Delete Room ${roomNumber} ?`,
			description: `This action cannot be undone.`,
			buttons: [
				{ text: "Cancel", textStyle: { color: "#9CA3AF" }, onPress: () => {} },
				{
					text: "Delete",
					textStyle: { color: "#EF4444" },
					onPress: async () => {
						setActionLoading(roomId);
						try {
							await deleteRoom(token!, roomId);
							ToastService.show({
								contentContainerStyle: {
									borderStartColor: "#4ADE80",
									borderStartWidth: 5,
									borderEndColor: "#4ADE80",
									borderEndWidth: 5,
									backgroundColor: "#0A0F1E",
								},
								message: "Room deleted successfully",
								duration: 3000,
								position: "bottom",
							});
							onRefresh();
						} catch (error: any) {
							ToastService.showError({
								message: error.message,
								duration: 3000,
								position: "bottom",
							});
						} finally {
							setActionLoading(null);
						}
					},
				},
			],
		});
	};

	const handleOccupantPress = (occupant: Occupant) => {
		setSelectedOccupant(occupant);
		setStudentModalVisible(true);
	};

	const toggleRoomOccupants = (roomId: string) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setExpandedRooms((prev) => ({
			...prev,
			[roomId]: !prev[roomId],
		}));
	};

	const occupancyPercentage =
		stats.totalCapacity > 0
			? Math.round((stats.occupiedSeats / stats.totalCapacity) * 100)
			: 0;

	const normalizedSearch = roomSearch.trim().toLowerCase();
	const filteredRooms = normalizedSearch
		? rooms.filter((room) =>
				room.roomNumber.toLowerCase().includes(normalizedSearch),
			)
		: rooms;

	const renderRoomCard = (room: Room) => {
		const occupancy = Math.round((room.occupants.length / room.capacity) * 100);
		const hasOccupants = room.occupants.length > 0;
		const isFull = room.occupants.length === room.capacity;
		const isExpanded = expandedRooms[room._id] ?? false;

		if (viewMode === "grid") {
			return (
				<LinearGradient
					key={room._id}
					colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
					style={{
						borderRadius: 14,
						borderWidth: 1,
						borderColor: isFull
							? "rgba(239,68,68,0.3)"
							: "rgba(255,255,255,0.1)",
						padding: 14,
						width: "48%",
						marginBottom: 12,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "flex-start",
							marginBottom: 10,
						}}
					>
						<View
							style={{
								width: 38,
								height: 38,
								borderRadius: 10,
								backgroundColor: "rgba(255,204,0,0.1)",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<FontAwesome name="bed" size={16} color="#FFCC00" />
						</View>
						{actionLoading === room._id ? (
							<ActivityIndicator size="small" color="#EF4444" />
						) : (
							<Pressable
								onPress={() =>
									handleDeleteRoom(room._id, room.roomNumber, hasOccupants)
								}
								disabled={hasOccupants}
								style={({ pressed }) => ({
									padding: 6,
									borderRadius: 8,
									backgroundColor: hasOccupants
										? "rgba(107,114,128,0.1)"
										: "rgba(239,68,68,0.1)",
									opacity: pressed || hasOccupants ? 0.5 : 1,
								})}
							>
								<FontAwesome
									name="trash-o"
									size={14}
									color={hasOccupants ? "#6B7280" : "#EF4444"}
								/>
							</Pressable>
						)}
					</View>

					<Text
						style={{
							color: "white",
							fontSize: 15,
							fontWeight: "600",
							marginBottom: 2,
						}}
					>
						Room {room.roomNumber}
					</Text>
					<Text style={{ color: "#6B7280", fontSize: 11, marginBottom: 8 }}>
						{room.occupants.length}/{room.capacity} occupied
					</Text>

					{/* Mini occupancy bar */}
					{/* <View
						style={{
							height: 3,
							backgroundColor: "rgba(255,255,255,0.1)",
							borderRadius: 2,
							overflow: "hidden",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								width: `${occupancy}%`,
								height: "100%",
								backgroundColor: isFull ? "#EF4444" : "#4ADE80",
								borderRadius: 2,
							}}
						/>
					</View> */}

					{/* Occupant chips */}
					{room.occupants.map((occupant) => (
						<Pressable
							key={occupant._id}
							onPress={() => handleOccupantPress(occupant)}
							style={({ pressed }) => ({
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: pressed
									? "rgba(255,204,0,0.1)"
									: "rgba(255,255,255,0.05)",
								paddingHorizontal: 8,
								paddingVertical: 5,
								borderRadius: 6,
								marginBottom: 4,
							})}
						>
							<FontAwesome
								name="user-o"
								size={10}
								color="#9CA3AF"
								style={{ marginRight: 6 }}
							/>
							<Text
								style={{ color: "#D1D5DB", fontSize: 11, flex: 1 }}
								numberOfLines={1}
							>
								{occupant.name}
							</Text>
						</Pressable>
					))}
				</LinearGradient>
			);
		}

		// List view
		return (
			<LinearGradient
				key={room._id}
				colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(255,255,255,0.1)",
					padding: 16,
					marginBottom: 12,
				}}
			>
				{/* Room header row */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 10,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<View
							style={{
								width: 42,
								height: 42,
								borderRadius: 10,
								backgroundColor: "rgba(255,204,0,0.1)",
								alignItems: "center",
								justifyContent: "center",
								marginRight: 12,
							}}
						>
							<FontAwesome name="bed" size={18} color="#FFCC00" />
						</View>
						<View>
							<Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
								Room {room.roomNumber}
							</Text>
							<Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 1 }}>
								Capacity: {room.capacity} students
							</Text>
						</View>
					</View>

					<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
						<View
							style={{
								backgroundColor: isFull
									? "rgba(239,68,68,0.1)"
									: "rgba(74,222,128,0.1)",
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									color: isFull ? "#EF4444" : "#4ADE80",
									fontSize: 12,
									fontWeight: "600",
								}}
							>
								{isFull ? "Full" : "Available"}
							</Text>
						</View>
						{actionLoading === room._id ? (
							<ActivityIndicator size="small" color="#EF4444" />
						) : (
							<Pressable
								onPress={() =>
									handleDeleteRoom(room._id, room.roomNumber, hasOccupants)
								}
								disabled={hasOccupants}
								style={({ pressed }) => ({
									padding: 8,
									borderRadius: 8,
									backgroundColor: hasOccupants
										? "rgba(107,114,128,0.1)"
										: "rgba(239,68,68,0.1)",
									opacity: pressed || hasOccupants ? 0.5 : 1,
								})}
							>
								<FontAwesome
									name="trash-o"
									size={16}
									color={hasOccupants ? "#6B7280" : "#EF4444"}
								/>
							</Pressable>
						)}
					</View>
				</View>

				{/* Occupancy bar */}
				{/* <View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 10,
					}}
				>
					<Text style={{ color: "#6B7280", fontSize: 12, marginRight: 8 }}>
						{room.occupants.length}/{room.capacity}
					</Text>
					<View
						style={{
							flex: 1,
							height: 5,
							backgroundColor: "rgba(255,255,255,0.1)",
							borderRadius: 3,
							overflow: "hidden",
						}}
					>
						<View
							style={{
								width: `${occupancy}%`,
								height: "100%",
								backgroundColor: isFull ? "#EF4444" : "#FFCC00",
								borderRadius: 3,
							}}
						/>
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 12, marginLeft: 8 }}>
						{occupancy}%
					</Text>
				</View> */}

				{/* Occupants dropdown */}
				<View
					style={{
						paddingTop: 10,
						borderTopWidth: 1,
						borderTopColor: "rgba(255,255,255,0.06)",
						gap: 6,
					}}
				>
					<Pressable
						onPress={() => hasOccupants && toggleRoomOccupants(room._id)}
						disabled={!hasOccupants}
						style={({ pressed }) => ({
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							backgroundColor: "rgba(255,255,255,0.04)",
							paddingHorizontal: 12,
							paddingVertical: 9,
							borderRadius: 10,
							opacity: pressed || !hasOccupants ? 0.7 : 1,
						})}
					>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Text style={{ color: "#D1D5DB", fontSize: 12 }}>Occupants</Text>
							<Text style={{ color: "#6B7280", fontSize: 12 }}>
								{room.occupants.length}/{room.capacity}
							</Text>
						</View>
						<FontAwesome
							name={isExpanded ? "chevron-up" : "chevron-down"}
							size={12}
							color={hasOccupants ? "#9CA3AF" : "#4B5563"}
						/>
					</Pressable>

					{hasOccupants && isExpanded && (
						<View style={{ gap: 6 }}>
							{room.occupants.map((occupant) => (
								<View
									key={occupant._id}
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										backgroundColor: "rgba(255,255,255,0.04)",
										paddingHorizontal: 12,
										paddingVertical: 9,
										borderRadius: 10,
									}}
								>
									<Pressable
										onPress={() => handleOccupantPress(occupant)}
										style={({ pressed }) => ({
											flexDirection: "row",
											alignItems: "center",
											flex: 1,
											opacity: pressed ? 0.7 : 1,
										})}
									>
										<View>
											<Text
												style={{
													color: "white",
													fontSize: 13,
													fontWeight: "500",
												}}
											>
												{occupant.name}
											</Text>
											{occupant.rollNo && (
												<Text
													style={{
														color: "#6B7280",
														fontSize: 11,
														marginTop: 1,
													}}
												>
													{occupant.rollNo}
												</Text>
											)}
										</View>
										{occupant.branch && (
											<View
												style={{
													backgroundColor: "rgba(255, 204, 0, 0.07)",
													paddingHorizontal: 7,
													paddingVertical: 2,
													borderRadius: 9,
													marginLeft: 8,
													marginBottom: 15,
												}}
											>
												<Text style={{ color: "#FFCC00", fontSize: 11 }}>
													{occupant.branch}
												</Text>
											</View>
										)}
									</Pressable>
									{actionLoading === occupant._id ? (
										<ActivityIndicator size="small" color="#EF4444" />
									) : (
										<Pressable
											onPress={() =>
												handleUnassignStudent(
													occupant._id,
													occupant.name,
													room._id,
												)
											}
											style={({ pressed }) => ({
												padding: 7,
												borderRadius: 7,
												backgroundColor: "rgba(239,68,68,0.1)",
												opacity: pressed ? 0.7 : 1,
												marginLeft: 8,
											})}
										>
											<FontAwesome name="times" size={12} color="#EF4444" />
										</Pressable>
									)}
								</View>
							))}
						</View>
					)}
				</View>
			</LinearGradient>
		);
	};

	return (
		<View>
			{/* Student Info Modal */}
			<Modal
				visible={studentModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setStudentModalVisible(false)}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.6)",
						justifyContent: "center",
						alignItems: "center",
						padding: 24,
					}}
					onPress={() => setStudentModalVisible(false)}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={{ width: "100%", maxWidth: 360 }}
					>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderRadius: 20,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								overflow: "hidden",
							}}
						>
							{/* Modal header */}
							<LinearGradient
								colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)"]}
								style={{
									padding: 20,
									borderBottomWidth: 1,
									borderBottomColor: "rgba(255,255,255,0.07)",
									flexDirection: "row",
									alignItems: "center",
									gap: 14,
								}}
							>
								<View
									style={{
										width: 48,
										height: 48,
										borderRadius: 24,
										backgroundColor: "rgba(255,204,0,0.15)",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FontAwesome name="user" size={22} color="#FFCC00" />
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{ color: "white", fontSize: 17, fontWeight: "700" }}
									>
										{selectedOccupant?.name}
									</Text>
								</View>
								<Pressable
									onPress={() => setStudentModalVisible(false)}
									style={({ pressed }) => ({
										opacity: pressed ? 0.6 : 1,
										padding: 4,
									})}
								>
									<FontAwesome name="times" size={25} color="#FFCC00" />
								</Pressable>
							</LinearGradient>

							{/* Info grid */}
							<View style={{ padding: 20, gap: 12 }}>
								{[
									{
										label: "Roll No",
										value: selectedOccupant?.rollNo,
										icon: "id-card",
									},
									{
										label: "Phone",
										value: selectedOccupant?.phoneNumber,
										icon: "phone",
									},
									{
										label: "Branch",
										value: selectedOccupant?.branch,
										icon: "graduation-cap",
									},
									{
										label: "Email",
										value: selectedOccupant?.email,
										icon: "envelope-o",
									},
								].map((item) =>
									item.value ? (
										<View
											key={item.label}
											style={{
												flexDirection: "row",
												alignItems: "center",
												backgroundColor: "rgba(255,255,255,0.04)",
												borderRadius: 10,
												paddingHorizontal: 14,
												paddingVertical: 11,
												gap: 12,
											}}
										>
											<FontAwesome
												name={item.icon as any}
												size={14}
												color="#6B7280"
												style={{ width: 16, marginBottom: 20 }}
											/>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														color: "#6B7280",
														fontSize: 11,
														marginBottom: 2,
													}}
												>
													{item.label}
												</Text>
												<Text style={{ color: "#E5E7EB", fontSize: 14 }}>
													{item.value}
												</Text>
											</View>
										</View>
									) : null,
								)}
							</View>

							{/* Unassign button */}
							<View
								style={{
									paddingHorizontal: 20,
									paddingBottom: 20,
								}}
							>
								{actionLoading === selectedOccupant?._id ? (
									<View style={{ alignItems: "center", paddingVertical: 14 }}>
										<ActivityIndicator color="#EF4444" />
									</View>
								) : (
									<Pressable
										onPress={() => {
											if (selectedOccupant) {
												handleUnassignStudent(
													selectedOccupant._id,
													selectedOccupant.name,
													"",
												);
											}
										}}
										style={({ pressed }) => ({
											backgroundColor: "rgba(239,68,68,0.1)",
											borderWidth: 1,
											borderColor: "rgba(239,68,68,0.3)",
											borderRadius: 12,
											padding: 13,
											alignItems: "center",
											opacity: pressed ? 0.8 : 1,
										})}
									>
										<Text
											style={{
												color: "#EF4444",
												fontSize: 14,
												fontWeight: "600",
											}}
										>
											Unassign
										</Text>
									</Pressable>
								)}
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>

			{/* Action row: Add Room + Search + View Toggle */}
			<View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
				<View>
					<Pressable
						onPress={() => setShowCreateForm(!showCreateForm)}
						style={({ pressed }) => ({
							flex: 1,
							backgroundColor: showCreateForm
								? "rgba(239,68,68,0.1)"
								: "rgba(255,204,0,0.1)",
							borderRadius: 15,
							padding: 16,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							borderWidth: 1,
							borderColor: showCreateForm
								? "rgba(239,68,68,0.3)"
								: "rgba(255,204,0,0.3)",
							opacity: pressed ? 0.85 : 1,
						})}
					>
						<FontAwesome
							name={showCreateForm ? "times" : "plus"}
							size={14}
							color={showCreateForm ? "#EF4444" : "#FFCC00"}
							style={{ marginRight: 0 }}
						/>
						{/* <Text
						style={{
							color: showCreateForm ? "#EF4444" : "#FFCC00",
							fontSize: 14,
							fontWeight: "600",
						}}
					>
						{showCreateForm ? "Cancel" : "Add Room"}
					</Text> */}
					</Pressable>
				</View>
				<View
					style={{
						flex: 1.2,
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: "rgba(255,255,255,0.06)",
						borderRadius: 12,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						paddingHorizontal: 10,
						paddingVertical: 6,
					}}
				>
					<FontAwesome name="search" size={14} color="#6B7280" />
					<TextInput
						value={roomSearch}
						onChangeText={setRoomSearch}
						placeholder="Search rooms"
						placeholderTextColor="#4B5563"
						style={{
							flex: 1,
							color: "white",
							paddingHorizontal: 8,
							paddingVertical: 6,
							fontSize: 13,
						}}
					/>
					{roomSearch.length > 0 && (
						<Pressable
							onPress={() => setRoomSearch("")}
							style={({ pressed }) => ({
								padding: 4,
								opacity: pressed ? 0.7 : 1,
							})}
						>
							<FontAwesome name="times" size={12} color="#9CA3AF" />
						</Pressable>
					)}
				</View>

				{/* View toggle */}
				<View
					style={{
						flexDirection: "row",
						backgroundColor: "rgba(255,255,255,0.06)",
						borderRadius: 12,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 4,
					}}
				>
					<Pressable
						onPress={() => setViewMode("list")}
						style={{
							paddingHorizontal: 12,
							paddingVertical: 12,
							borderRadius: 8,
							backgroundColor:
								viewMode === "list" ? "rgba(255,204,0,0.15)" : "transparent",
						}}
					>
						<FontAwesome
							name="list"
							size={14}
							color={viewMode === "list" ? "#FFCC00" : "#6B7280"}
						/>
					</Pressable>
					<Pressable
						onPress={() => setViewMode("grid")}
						style={{
							paddingHorizontal: 12,
							paddingVertical: 12,
							borderRadius: 8,
							backgroundColor:
								viewMode === "grid" ? "rgba(255,204,0,0.15)" : "transparent",
						}}
					>
						<FontAwesome
							name="th"
							size={14}
							color={viewMode === "grid" ? "#FFCC00" : "#6B7280"}
						/>
					</Pressable>
				</View>
			</View>

			{/* Stats bar */}
			{/* <LinearGradient
				colors={["rgba(255,204,0,0.05)", "rgba(255,204,0,0.05)"]}
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
						style={{ width: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
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
						style={{ width: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
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
			</LinearGradient> */}

			{/* Create form */}
			{showCreateForm && (
				<LinearGradient
					colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.06)"]}
					style={{
						borderRadius: 14,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 16,
						marginBottom: 16,
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 15,
							fontWeight: "600",
							marginBottom: 14,
						}}
					>
						New Room
					</Text>
					<View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
						<TextInput
							value={roomNumber}
							onChangeText={setRoomNumber}
							placeholder="Room No."
							placeholderTextColor="#4B5563"
							style={{
								flex: 1,
								backgroundColor: "rgba(255,255,255,0.06)",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								color: "white",
								paddingHorizontal: 14,
								paddingVertical: 12,
								fontSize: 14,
							}}
						/>
						<TextInput
							value={capacity}
							onChangeText={setCapacity}
							placeholder="Capacity"
							placeholderTextColor="#4B5563"
							keyboardType="numeric"
							style={{
								flex: 1,
								backgroundColor: "rgba(255,255,255,0.06)",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								color: "white",
								paddingHorizontal: 14,
								paddingVertical: 12,
								fontSize: 14,
							}}
						/>
					</View>
					<Pressable
						onPress={handleCreateRoom}
						disabled={loading}
						style={({ pressed }) => ({
							backgroundColor: "#FFCC00",
							borderRadius: 10,
							padding: 13,
							alignItems: "center",
							opacity: loading ? 0.7 : pressed ? 0.9 : 1,
						})}
					>
						{loading ? (
							<ActivityIndicator color="#0A0F1E" />
						) : (
							<Text
								style={{ color: "#0A0F1E", fontSize: 15, fontWeight: "bold" }}
							>
								Create Room
							</Text>
						)}
					</Pressable>
				</LinearGradient>
			)}

			{/* Rooms */}
			{rooms.length === 0 ? (
				<LinearGradient
					colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)"]}
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
					<Text style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}>
						Add rooms to start assigning students
					</Text>
				</LinearGradient>
			) : filteredRooms.length === 0 ? (
				<LinearGradient
					colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)"]}
					style={{
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 28,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 4,
						}}
					>
						No matching rooms
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>
						Try a different room number
					</Text>
				</LinearGradient>
			) : viewMode === "grid" ? (
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						justifyContent: "space-between",
					}}
				>
					{filteredRooms.map(renderRoomCard)}
				</View>
			) : (
				filteredRooms.map(renderRoomCard)
			)}
		</View>
	);
}
