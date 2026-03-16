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
			description: `Remove ${student.name} from this block? They will no longer have access to this block and can join another block later.`,
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
			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.5)",
						justifyContent: "center",
						alignItems: "center",
						padding: 10,
					}}
					onPress={() => setModalVisible(false)}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={{ width: "100%", maxWidth: 400 }}
					>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderRadius: 24,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								maxHeight: "80%",
							}}
						>
							<View
								style={{
									padding: 20,
									borderBottomWidth: 1,
									borderBottomColor: "rgba(255,255,255,0.1)",
								}}
							>
								<Text
									style={{
										color: "white",
										fontSize: 20,
										fontWeight: "bold",
										marginBottom: 4,
									}}
								>
									Assign to Room
								</Text>
								<Text style={{ color: "#9CA3AF", fontSize: 14 }}>
									Select a room for {selectedStudent?.name}
								</Text>
							</View>

							<ScrollView
								style={{ maxHeight: 400 }}
								contentContainerStyle={{ padding: 20 }}
								showsVerticalScrollIndicator={false}
							>
								{availableRooms.map((room) => {
									const availableSeats = room.capacity - room.occupants.length;
									return (
										<TouchableOpacity
											key={room._id}
											onPress={() => handleAssignToRoom(room)}
											activeOpacity={0.7}
										>
											<LinearGradient
												colors={[
													"rgba(255,204,0,0.05)",
													"rgba(255,204,0,0.05)",
												]}
												style={{
													borderRadius: 16,
													borderWidth: 1,
													borderColor: "rgba(255,204,0,0.3)",
													padding: 16,
													marginBottom: 12,
												}}
											>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
														justifyContent: "space-between",
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
																width: 44,
																height: 44,
																borderRadius: 12,
																backgroundColor: "rgba(255,204,0,0.15)",
																alignItems: "center",
																justifyContent: "center",
																marginRight: 12,
																borderWidth: 1,
																borderColor: "rgba(255,204,0,0.3)",
															}}
														>
															<FontAwesome
																name="bed"
																size={20}
																color="#FFCC00"
															/>
														</View>
														<View style={{ flex: 1 }}>
															<Text
																style={{
																	color: "white",
																	fontSize: 16,
																	fontWeight: "600",
																	marginBottom: 2,
																}}
															>
																Room {room.roomNumber}
															</Text>
															<View
																style={{
																	flexDirection: "row",
																	alignItems: "center",
																}}
															>
																<View
																	style={{
																		backgroundColor: "rgba(74,222,128,0.1)",
																		paddingHorizontal: 8,
																		paddingVertical: 2,
																		borderRadius: 12,
																		marginRight: 8,
																	}}
																>
																	<Text
																		style={{ color: "#4ADE80", fontSize: 11 }}
																	>
																		{availableSeats} seat
																		{availableSeats !== 1 ? "s" : ""} left
																	</Text>
																</View>
																<Text
																	style={{ color: "#9CA3AF", fontSize: 11 }}
																>
																	Capacity: {room.capacity}
																</Text>
															</View>
														</View>
													</View>
													<FontAwesome
														name="chevron-right"
														size={16}
														color="#FFCC00"
													/>
												</View>
											</LinearGradient>
										</TouchableOpacity>
									);
								})}
							</ScrollView>

							<View
								style={{
									padding: 16,
									borderTopWidth: 1,
									borderTopColor: "rgba(255,255,255,0.1)",
								}}
							>
								<Pressable
									onPress={() => setModalVisible(false)}
									style={({ pressed }) => ({
										backgroundColor: "rgba(255,255,255,0.05)",
										padding: 14,
										borderRadius: 12,
										alignItems: "center",
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.1)",
										opacity: pressed ? 0.8 : 1,
									})}
								>
									<Text
										style={{
											color: "#9CA3AF",
											fontSize: 16,
											fontWeight: "600",
										}}
									>
										Cancel
									</Text>
								</Pressable>
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>

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
					<Text
						style={{
							color: "#6B7280",
							fontSize: 12,
							marginTop: 4,
						}}
					>
						Waiting for room assignment
					</Text>
				</View>
			</LinearGradient>

			{unassignedStudents.length === 0 ? (
				<LinearGradient
					colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
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
							borderRadius: 30,
							backgroundColor: "rgba(74,222,128,0.1)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 12,
						}}
					>
						<FontAwesome name="check" size={28} color="#4ADE80" />
					</View>
					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 4,
						}}
					>
						All Caught Up!
					</Text>
					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 14,
							textAlign: "center",
						}}
					>
						All students in this block have been assigned to rooms
					</Text>
				</LinearGradient>
			) : (
				unassignedStudents.map((student) => (
					<LinearGradient
						key={student._id}
						colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
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
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<View style={{ flex: 1 }}>
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
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 13,
										marginBottom: 8,
									}}
								>
									{student.email}
								</Text>
								<View
									style={{
										flexDirection: "row",
										gap: 8,
										justifyContent: "flex-end",
									}}
								>
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
												alignSelf: "flex-start",
											})}
										>
											<Text
												style={{
													color: "#FFCC00",
													fontSize: 13,
													fontWeight: "600",
												}}
											>
												Assign
											</Text>
										</Pressable>
									)}
									<View>
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
						</View>
					</LinearGradient>
				))
			)}
		</View>
	);
}
