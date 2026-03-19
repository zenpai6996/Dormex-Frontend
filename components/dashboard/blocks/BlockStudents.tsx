import { removeStudentFromBlock } from "@/src/api/joinBlock.api";
import { assignStudentToRoom } from "@/src/api/room.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";

interface Student {
	_id: string;
	name: string;
	email: string;
	rollNo?: string;
	branch?: string;
	status: string;
	room?: { _id: string; roomNumber: string } | null;
}

interface Room {
	_id: string;
	roomNumber: string;
	capacity: number;
	occupants: any[];
}

interface BlockStudentsProps {
	blockId: string;
	unassignedStudents: Student[];
	rooms: Room[];
	onRefresh: () => void;
}

export default function BlockStudents({
	blockId,
	unassignedStudents,
	rooms,
	onRefresh,
}: BlockStudentsProps) {
	const { token } = useAuth();
	const [assigningStudentId, setAssigningStudentId] = useState<string | null>(
		null,
	);
	const [removingStudentId, setRemovingStudentId] = useState<string | null>(
		null,
	);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [modalVisible, setModalVisible] = useState(false);

	const availableRooms = rooms.filter(
		(room) => room.occupants.length < room.capacity,
	);

	const handleAssignPress = (student: Student) => {
		if (availableRooms.length === 0) {
			ToastService.showError({
				message: "No available rooms. Create more rooms first.",
				duration: 3000,
				position: "bottom",
			});
			return;
		}
		setSelectedStudent(student);
		setModalVisible(true);
	};

	const handleAssignToRoom = async (room: Room) => {
		if (!selectedStudent || !token) return;

		setAssigningStudentId(selectedStudent._id);
		setModalVisible(false);

		try {
			await assignStudentToRoom(token!, {
				roomId: room._id,
				studentId: selectedStudent._id,
			});
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: `${selectedStudent.name} assigned to Room ${room.roomNumber}`,
				duration: 3000,
				position: "bottom",
			});
			onRefresh();
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to assign student",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setAssigningStudentId(null);
			setSelectedStudent(null);
		}
	};

	const handleRemoveFromBlock = (student: Student) => {
		if (student.room) {
			ToastService.showError({
				message:
					"Student must be unassigned from room first before removing from block",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		Alert.alert({
			title: "Remove Student",
			description: `Remove ${student.name} from this block?`,
			buttons: [
				{ text: "Cancel", textStyle: { color: "#9CA3AF" }, onPress: () => {} },
				{
					text: "Remove",
					textStyle: { color: "#EF4444" },
					onPress: async () => {
						if (!token) return;
						setRemovingStudentId(student._id);
						try {
							await removeStudentFromBlock(token, student._id);
							ToastService.show({
								contentContainerStyle: {
									borderStartColor: "#4ADE80",
									borderStartWidth: 5,
									borderEndColor: "#4ADE80",
									borderEndWidth: 5,
									backgroundColor: "#0A0F1E",
								},
								message: `${student.name} removed from block`,
								duration: 3000,
								position: "bottom",
							});
							onRefresh();
						} catch (error: any) {
							ToastService.showError({
								message: error.message || "Failed to remove student from block",
								duration: 3000,
								position: "bottom",
							});
						} finally {
							setRemovingStudentId(null);
						}
					},
				},
			],
		});
	};

	return (
		<View>
			{/* Full-screen Assign Modal */}
			<Modal
				visible={modalVisible}
				transparent={false}
				animationType="slide"
				onRequestClose={() => setModalVisible(false)}
			>
				<SafeAreaView style={{ flex: 1, backgroundColor: "#0A0F1E" }}>
					{/* Modal Header */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 16,
							paddingVertical: 14,
							borderBottomWidth: 1,
							borderBottomColor: "rgba(255,255,255,0.08)",
						}}
					>
						<Pressable
							onPress={() => setModalVisible(false)}
							style={({ pressed }) => ({
								width: 40,
								height: 40,
								borderRadius: 20,
								backgroundColor: "rgba(255,255,255,0.08)",
								alignItems: "center",
								justifyContent: "center",
								marginRight: 14,
								opacity: pressed ? 0.7 : 1,
							})}
						>
							<FontAwesome name="arrow-left" size={16} color="#FFCC00" />
						</Pressable>
						<View style={{ flex: 1 }}>
							<Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
								Assign Room
							</Text>
						</View>
						<View
							style={{
								backgroundColor: "rgba(74,222,128,0.1)",
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 20,
								borderWidth: 1,
								borderColor: "rgba(74,222,128,0.3)",
							}}
						>
							<Text style={{ color: "#4ADE80", fontSize: 12 }}>
								{availableRooms.length} available
							</Text>
						</View>
					</View>

					{/* Student summary card */}
					{selectedStudent && (
						<View
							style={{
								marginHorizontal: 16,
								marginTop: 16,
								marginBottom: 8,
								backgroundColor: "rgba(255,204,0,0.06)",
								borderRadius: 14,
								borderWidth: 1,
								borderColor: "rgba(255,204,0,0.2)",
								padding: 14,
								flexDirection: "row",
								alignItems: "center",
								gap: 12,
							}}
						>
							<View
								style={{
									width: 42,
									height: 42,
									borderRadius: 21,
									backgroundColor: "rgba(255,204,0,0.12)",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<FontAwesome name="user" size={18} color="#FFCC00" />
							</View>
							<View style={{ flex: 1 }}>
								<Text
									style={{ color: "white", fontSize: 15, fontWeight: "600" }}
								>
									{selectedStudent.name}
								</Text>
								<View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
									{selectedStudent.rollNo && (
										<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
											{selectedStudent.rollNo}
										</Text>
									)}
									{selectedStudent.branch && (
										<View
											style={{
												backgroundColor: "rgba(255,204,0,0.1)",
												paddingHorizontal: 8,
												paddingVertical: 2,
												borderRadius: 10,
											}}
										>
											<Text style={{ color: "#FFCC00", fontSize: 11 }}>
												{selectedStudent.branch}
											</Text>
										</View>
									)}
								</View>
							</View>
						</View>
					)}

					<Text
						style={{
							color: "#6B7280",
							fontSize: 12,
							marginHorizontal: 16,
							marginTop: 12,
							marginBottom: 8,
							textTransform: "uppercase",
							letterSpacing: 0.8,
						}}
					>
						Available Rooms
					</Text>

					<ScrollView
						style={{ flex: 1 }}
						contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
						showsVerticalScrollIndicator={false}
					>
						{availableRooms.map((room) => {
							const availableSeats = room.capacity - room.occupants.length;
							return (
								<TouchableOpacity
									key={room._id}
									onPress={() => handleAssignToRoom(room)}
									activeOpacity={0.75}
								>
									<LinearGradient
										colors={[
											"rgba(255,255,255,0.06)",
											"rgba(255,255,255,0.03)",
										]}
										style={{
											borderRadius: 14,
											borderWidth: 1,
											borderColor: "rgba(255,255,255,0.1)",
											padding: 16,
											marginBottom: 12,
										}}
									>
										{/* Room header */}
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "space-between",
												marginBottom: room.occupants.length > 0 ? 12 : 0,
											}}
										>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													flex: 1,
												}}
											>
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
													<Text
														style={{
															color: "white",
															fontSize: 16,
															fontWeight: "600",
														}}
													>
														Room {room.roomNumber}
													</Text>
													<View
														style={{
															flexDirection: "row",
															alignItems: "center",
															gap: 8,
															marginTop: 3,
														}}
													>
														<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
															Capacity: {room.capacity}
														</Text>
														<View
															style={{
																backgroundColor: "rgba(74,222,128,0.1)",
																paddingHorizontal: 8,
																paddingVertical: 2,
																borderRadius: 10,
																borderWidth: 1,
																borderColor: "rgba(74,222,128,0.2)",
															}}
														>
															<Text style={{ color: "#4ADE80", fontSize: 11 }}>
																{availableSeats} seat
																{availableSeats !== 1 ? "s" : ""} free
															</Text>
														</View>
													</View>
												</View>
											</View>
											<FontAwesome
												name="chevron-right"
												size={14}
												color="#FFCC00"
											/>
										</View>

										{/* Occupants list */}
										{room.occupants.length > 0 && (
											<View
												style={{
													borderTopWidth: 1,
													borderTopColor: "rgba(255,255,255,0.07)",
													paddingTop: 10,
													gap: 6,
												}}
											>
												<Text
													style={{
														color: "#6B7280",
														fontSize: 11,
														marginBottom: 4,
													}}
												>
													Current occupants
												</Text>
												{room.occupants.map((occupant: any) => (
													<View
														key={occupant._id}
														style={{
															flexDirection: "row",
															alignItems: "center",
															justifyContent: "space-between",
															backgroundColor: "rgba(255,255,255,0.04)",
															paddingHorizontal: 10,
															paddingVertical: 7,
															borderRadius: 8,
														}}
													>
														<View
															style={{
																flexDirection: "row",
																alignItems: "center",
																gap: 8,
															}}
														>
															<FontAwesome
																name="user-o"
																size={11}
																color="#6B7280"
															/>
															<Text style={{ color: "#D1D5DB", fontSize: 13 }}>
																{occupant.name}
															</Text>
														</View>
														<View style={{ flexDirection: "row", gap: 5 }}>
															{occupant.branch && (
																<View
																	style={{
																		backgroundColor: "rgba(255,204,0,0.08)",
																		paddingHorizontal: 8,
																		paddingVertical: 2,
																		borderRadius: 8,
																	}}
																>
																	<Text
																		style={{ color: "#FFCC00", fontSize: 11 }}
																	>
																		{occupant.branch}
																	</Text>
																</View>
															)}
															{occupant.rollNo && (
																<View
																	style={{
																		backgroundColor: "rgba(255,204,0,0.08)",
																		paddingHorizontal: 8,
																		paddingVertical: 2,
																		borderRadius: 8,
																	}}
																>
																	<Text
																		style={{ color: "#FFCC00", fontSize: 11 }}
																	>
																		{occupant.rollNo}
																	</Text>
																</View>
															)}
														</View>
													</View>
												))}
											</View>
										)}
									</LinearGradient>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</SafeAreaView>
			</Modal>

			{/* Unassigned count banner */}
			<LinearGradient
				colors={["rgba(74,222,128,0.1)", "rgba(74,222,128,0.05)"]}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(74,222,128,0.2)",
					padding: 16,
					marginBottom: 16,
				}}
			>
				<View style={{ alignItems: "center" }}>
					<Text style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
						Unassigned Students
					</Text>
					<Text style={{ color: "#4ADE80", fontSize: 32, fontWeight: "bold" }}>
						{unassignedStudents.length}
					</Text>
					<Text style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>
						Waiting for room assignment
					</Text>
				</View>
			</LinearGradient>

			{unassignedStudents.length === 0 ? (
				<View />
			) : (
				unassignedStudents.map((student) => (
					<LinearGradient
						key={student._id}
						colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.05)"]}
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
								alignItems: "flex-start",
								justifyContent: "space-between",
							}}
						>
							<View style={{ flex: 1 }}>
								{/* Name */}
								<Text
									style={{
										color: "white",
										fontSize: 16,
										fontWeight: "600",
										marginBottom: 4,
									}}
								>
									{student.name}
								</Text>

								{/* Roll no + Branch row */}
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: 8,
										marginBottom: 12,
									}}
								>
									{student.rollNo && (
										<Text style={{ color: "#9CA3AF", fontSize: 13 }}>
											{student.rollNo}
										</Text>
									)}
									{student.branch && (
										<View
											style={{
												backgroundColor: "rgba(255,204,0,0.08)",
												paddingHorizontal: 8,
												paddingVertical: 2,
												borderRadius: 10,
												borderWidth: 1,
												borderColor: "rgba(255,204,0,0.2)",
											}}
										>
											<Text style={{ color: "#FFCC00", fontSize: 12 }}>
												{student.branch}
											</Text>
										</View>
									)}
								</View>

								{/* Action buttons */}
								<View style={{ flexDirection: "row", gap: 8 }}>
									{assigningStudentId === student._id ? (
										<ActivityIndicator color="#FFCC00" />
									) : (
										<Pressable
											onPress={() => handleAssignPress(student)}
											style={({ pressed }) => ({
												backgroundColor: "rgba(255,204,0,0.1)",
												paddingHorizontal: 16,
												paddingVertical: 8,
												borderRadius: 20,
												borderWidth: 1,
												borderColor: "rgba(255,204,0,0.3)",
												opacity: pressed ? 0.8 : 1,
											})}
										>
											<Text
												style={{
													color: "#FFCC00",
													fontSize: 13,
													fontWeight: "600",
												}}
											>
												Assign Room
											</Text>
										</Pressable>
									)}
									{removingStudentId === student._id ? (
										<ActivityIndicator color="#EF4444" />
									) : (
										<Pressable
											onPress={() => handleRemoveFromBlock(student)}
											style={({ pressed }) => ({
												backgroundColor: "rgba(239,68,68,0.1)",
												paddingHorizontal: 16,
												paddingVertical: 8,
												borderRadius: 20,
												borderWidth: 1,
												borderColor: "rgba(239,68,68,0.3)",
												opacity: pressed ? 0.8 : 1,
											})}
										>
											<Text
												style={{
													color: "#EF4444",
													fontSize: 13,
													fontWeight: "600",
												}}
											>
												Remove
											</Text>
										</Pressable>
									)}
								</View>
							</View>
						</View>
					</LinearGradient>
				))
			)}
		</View>
	);
}
