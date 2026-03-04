import { assignStudentToRoom } from "@/src/api/room.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";

interface Student {
	_id: string;
	name: string;
	email: string;
	status: string;
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
	unassignedStudents,
	rooms,
	onRefresh,
}: BlockStudentsProps) {
	const { token } = useAuth();
	const [assigningStudentId, setAssigningStudentId] = useState<string | null>(
		null,
	);

	const availableRooms = rooms.filter(
		(room) => room.occupants.length < room.capacity,
	);

	const handleAssign = (student: Student) => {
		if (availableRooms.length === 0) {
			ToastService.showError({
				message: "No available rooms. Create more rooms first.",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		const roomOptions = availableRooms.map((room) => ({
			text: `Room ${room.roomNumber} `,
			textStyle: { color: "#FFCC00" },
			onPress: async () => {
				setAssigningStudentId(student._id);
				try {
					await assignStudentToRoom(token!, {
						roomId: room._id,
						studentId: student._id,
					});
					ToastService.show({
						contentContainerStyle: {
							borderStartColor: "#4ADE80",
							borderStartWidth: 5,
							borderEndColor: "#4ADE80",
							borderEndWidth: 5,
							backgroundColor: "#0A0F1E",
						},
						message: `${student.name} assigned to Room ${room.roomNumber}`,
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
				}
			},
		}));

		Alert.alert({
			title: "Assign to Room",
			description: `Select a room for ${student.name}:`,
			buttons: [
				{
					text: "Cancel",
					textStyle: { color: "#9CA3AF" },
					onPress: () => {},
				},
				...roomOptions,
			],
			showCancelButton: true,
		});
	};

	return (
		<View>
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
								alignItems: "center",
							}}
						>
							<View
								style={{
									width: 48,
									height: 48,
									borderRadius: 24,
									backgroundColor: "rgba(255,204,0,0.1)",
									alignItems: "center",
									justifyContent: "center",
									marginRight: 12,
								}}
							>
								<Text
									style={{
										color: "#FFCC00",
										fontSize: 18,
										fontWeight: "bold",
									}}
								>
									{student.name.charAt(0).toUpperCase()}
								</Text>
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
									{student.name}
								</Text>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 13,
									}}
								>
									{student.email}
								</Text>
							</View>
							{assigningStudentId === student._id ? (
								<ActivityIndicator color="#FFCC00" />
							) : (
								<Pressable
									onPress={() => handleAssign(student)}
									style={({ pressed }) => ({
										backgroundColor: "rgba(255,204,0,0.1)",
										paddingHorizontal: 14,
										paddingVertical: 8,
										borderRadius: 8,
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
										Assign
									</Text>
								</Pressable>
							)}
						</View>
					</LinearGradient>
				))
			)}
		</View>
	);
}
