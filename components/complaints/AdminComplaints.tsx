import {
	fetchComplaints,
	updateComplaintStatus,
} from "@/src/api/complaint.api";
import { useAuth } from "@/src/context/AuthContext";
import {
	Complaint,
	COMPLAINT_STATUS_COLORS,
	COMPLAINT_STATUS_ICONS,
	COMPLAINT_STATUS_LABELS,
	ComplaintStatus,
} from "@/src/types/complaint.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import ComplaintsSkeleton from "../skeletons/ComplaintsSkeleton";

interface StatusUpdateModalProps {
	visible: boolean;
	onClose: () => void;
	onUpdate: (status: ComplaintStatus) => Promise<void>;
	currentStatus: ComplaintStatus;
	complaintId: string;
}

function StatusUpdateModal({
	visible,
	onClose,
	onUpdate,
	currentStatus,
}: StatusUpdateModalProps) {
	const [updating, setUpdating] = useState(false);

	const handleUpdate = async (status: ComplaintStatus) => {
		setUpdating(true);
		try {
			await onUpdate(status);
			onClose();
		} catch (error) {
			console.error("Failed to update status", error);
		} finally {
			setUpdating(false);
		}
	};

	const statusOptions: ComplaintStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable
				style={{
					flex: 1,
					backgroundColor: "rgba(0,0,0,0.7)",
					justifyContent: "center",
					alignItems: "center",
					padding: 16,
				}}
				onPress={onClose}
			>
				<Pressable
					onPress={(e) => e.stopPropagation()}
					style={{ width: "100%", maxWidth: 400 }}
				>
					<LinearGradient
						colors={["#1A1F32", "#1A1F32"]}
						style={{
							borderRadius: 24,
							borderWidth: 1,
							borderColor: "rgba(0,0,0,0.7)",
							padding: 20,
						}}
					>
						<View style={{ alignItems: "center", marginBottom: 16 }}>
							<View
								style={{
									width: 60,
									height: 60,
									borderRadius: 30,
									backgroundColor: "rgba(255,204,0,0.1)",
									alignItems: "center",
									justifyContent: "center",
									borderWidth: 1,
									borderColor: "rgba(255,204,0,0.3)",
								}}
							>
								<FontAwesome name="pencil" size={28} color="#FFCC00" />
							</View>
						</View>

						<Text
							style={{
								color: "white",
								fontSize: 20,
								fontWeight: "bold",
								textAlign: "center",
								marginBottom: 15,
							}}
						>
							Update Status
						</Text>

						{/* <Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								textAlign: "center",
								marginBottom: 20,
							}}
						>
							Current:{" "}
							<Text style={{ color: COMPLAINT_STATUS_COLORS[currentStatus] }}>
								{COMPLAINT_STATUS_LABELS[currentStatus]}
							</Text>
						</Text> */}

						<View style={{ gap: 12, marginBottom: 20 }}>
							{statusOptions.map((status) => (
								<Pressable
									key={status}
									onPress={() => handleUpdate(status)}
									disabled={status === currentStatus || updating}
									style={({ pressed }) => ({
										backgroundColor: `${COMPLAINT_STATUS_COLORS[status]}10`,
										padding: 16,
										borderRadius: 20,
										borderWidth: 2,
										borderColor:
											status === currentStatus
												? COMPLAINT_STATUS_COLORS[status]
												: "transparent",
										opacity: status === currentStatus ? 0.5 : pressed ? 0.8 : 1,
										flexDirection: "row",
										alignItems: "center",
										gap: 12,
									})}
								>
									<FontAwesome
										name={COMPLAINT_STATUS_ICONS[status]}
										size={18}
										color={COMPLAINT_STATUS_COLORS[status]}
									/>
									<Text
										style={{
											color: "white",
											fontSize: 16,
											fontWeight: "500",
											flex: 1,
										}}
									>
										{COMPLAINT_STATUS_LABELS[status]}
									</Text>
									{status === currentStatus && (
										<FontAwesome
											name="check"
											size={16}
											color={COMPLAINT_STATUS_COLORS[status]}
										/>
									)}
								</Pressable>
							))}
						</View>

						<Pressable
							onPress={onClose}
							style={({ pressed }) => ({
								backgroundColor: "rgba(28, 25, 25, 0.33)",
								padding: 14,
								borderRadius: 20,
								alignItems: "center",
								borderWidth: 1,
								borderColor: "rgba(221, 191, 109, 0.74)",
								opacity: pressed ? 0.8 : 1,
							})}
						>
							<Text
								style={{ color: "#dee2e9", fontSize: 16, fontWeight: "600" }}
							>
								Cancel
							</Text>
						</Pressable>
					</LinearGradient>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

export default function AdminComplaints() {
	const { token } = useAuth();
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
		null,
	);
	const [modalVisible, setModalVisible] = useState(false);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [filter, setFilter] = useState<ComplaintStatus | "ALL">("ALL");

	const loadComplaints = async () => {
		if (!token) return;
		try {
			const data = await fetchComplaints(token);
			setComplaints(data);
		} catch (error) {
			console.error("Failed to load complaints", error);
			ToastService.showError({
				message: "Failed to load complaints",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadComplaints();
		setRefreshing(false);
	};

	const handleUpdateStatus = async (status: ComplaintStatus) => {
		if (!selectedComplaint || !token) return;

		setUpdatingId(selectedComplaint._id);
		try {
			await updateComplaintStatus(token, selectedComplaint._id, { status });
			await loadComplaints();
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: `Status updated to ${COMPLAINT_STATUS_LABELS[status]}`,
				duration: 3000,
				position: "bottom",
			});
		} catch (error) {
			ToastService.showError({
				message: "Failed to update status",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setUpdatingId(null);
			setSelectedComplaint(null);
		}
	};

	useEffect(() => {
		loadComplaints();
	}, [token]);

	const filteredComplaints =
		filter === "ALL"
			? complaints
			: complaints.filter((c) => c.status === filter);

	const getStatusCount = (status: ComplaintStatus | "ALL") => {
		if (status === "ALL") return complaints.length;
		return complaints.filter((c) => c.status === status).length;
	};

	if (loading) {
		return <ComplaintsSkeleton />;
	}

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<StatusUpdateModal
				visible={modalVisible}
				onClose={() => {
					setModalVisible(false);
					setSelectedComplaint(null);
				}}
				onUpdate={handleUpdateStatus}
				currentStatus={selectedComplaint?.status || "OPEN"}
				complaintId={selectedComplaint?._id || ""}
			/>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					padding: 16,
					paddingTop: 60,
					paddingBottom: 100,
				}}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#FFCC00"
						colors={["#FFCC00"]}
					/>
				}
			>
				<View style={{ marginBottom: 24 }}>
					<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
						Complaints
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4 }}>
						View and manage student complaints
					</Text>
				</View>

				{/* Stats Cards */}
				<View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
					<Pressable onPress={() => setFilter("ALL")} style={{ flex: 1 }}>
						<LinearGradient
							colors={
								filter === "ALL"
									? ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.05)"]
									: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
							}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor:
									filter === "ALL"
										? "rgba(255,255,255,0.2)"
										: "rgba(255,255,255,0.1)",
								padding: 12,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Total</Text>
							<Text
								style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
							>
								{getStatusCount("ALL")}
							</Text>
						</LinearGradient>
					</Pressable>

					<Pressable onPress={() => setFilter("OPEN")} style={{ flex: 1 }}>
						<LinearGradient
							colors={
								filter === "OPEN"
									? ["rgba(239,68,68,0.15)", "rgba(239,68,68,0.05)"]
									: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
							}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor:
									filter === "OPEN"
										? "rgba(239,68,68,0.3)"
										: "rgba(255,255,255,0.1)",
								padding: 12,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Open</Text>
							<Text
								style={{ color: "#EF4444", fontSize: 24, fontWeight: "bold" }}
							>
								{getStatusCount("OPEN")}
							</Text>
						</LinearGradient>
					</Pressable>

					<Pressable
						onPress={() => setFilter("IN_PROGRESS")}
						style={{ flex: 1 }}
					>
						<LinearGradient
							colors={
								filter === "IN_PROGRESS"
									? ["rgba(245,158,11,0.15)", "rgba(245,158,11,0.05)"]
									: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
							}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor:
									filter === "IN_PROGRESS"
										? "rgba(245,158,11,0.3)"
										: "rgba(255,255,255,0.1)",
								padding: 12,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Solving</Text>
							<Text
								style={{ color: "#F59E0B", fontSize: 24, fontWeight: "bold" }}
							>
								{getStatusCount("IN_PROGRESS")}
							</Text>
						</LinearGradient>
					</Pressable>

					<Pressable onPress={() => setFilter("RESOLVED")} style={{ flex: 1 }}>
						<LinearGradient
							colors={
								filter === "RESOLVED"
									? ["rgba(74,222,128,0.15)", "rgba(74,222,128,0.05)"]
									: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
							}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor:
									filter === "RESOLVED"
										? "rgba(74,222,128,0.3)"
										: "rgba(255,255,255,0.1)",
								padding: 12,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Closed</Text>
							<Text
								style={{ color: "#4ADE80", fontSize: 24, fontWeight: "bold" }}
							>
								{getStatusCount("RESOLVED")}
							</Text>
						</LinearGradient>
					</Pressable>
				</View>

				{filteredComplaints.length === 0 ? (
					<LinearGradient
						colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
						style={{
							borderRadius: 16,
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.1)",
							padding: 32,
							alignItems: "center",
							marginTop: 20,
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
							<FontAwesome name="check-circle" size={28} color="#FFCC00" />
						</View>
						<Text
							style={{
								color: "white",
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 4,
							}}
						>
							No Complaints
						</Text>
						{/* <Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								textAlign: "center",
							}}
						>
							{filter === "ALL"
								? "No complaints have been filed yet"
								: `No ${filter.toLowerCase().replace("_", " ")} complaints`}
						</Text> */}
					</LinearGradient>
				) : (
					filteredComplaints.map((complaint) => (
						<LinearGradient
							key={complaint._id}
							colors={
								complaint.status === "OPEN"
									? ["rgba(239, 68, 68, 0.4)", "rgba(239,68,68,0.05)"]
									: complaint.status === "IN_PROGRESS"
										? ["rgba(245,158,11,0.4)", "rgba(245,158,11,0.05)"]
										: complaint.status === "RESOLVED"
											? ["rgba(74,222,128,0.4)", "rgba(74,222,128,0.05)"]
											: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
							}
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
									alignItems: "flex-start",
									marginBottom: 12,
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
											borderRadius: 20,
											backgroundColor: `${COMPLAINT_STATUS_COLORS[complaint.status]}20`,
											alignItems: "center",
											justifyContent: "center",
											marginRight: 12,
											marginBottom: 15,
											borderWidth: 1,
											borderColor: `${COMPLAINT_STATUS_COLORS[complaint.status]}30`,
										}}
									>
										<FontAwesome
											name={COMPLAINT_STATUS_ICONS[complaint.status]}
											size={20}
											color={COMPLAINT_STATUS_COLORS[complaint.status]}
										/>
									</View>
									<View style={{ flex: 1 }}>
										<Text
											style={{
												color: "white",
												fontSize: 14,
												fontWeight: "600",
												marginBottom: 2,
											}}
										>
											{complaint.category}
										</Text>
										<Text
											style={{
												color: "#9CA3AF",
												fontSize: 12,
											}}
										>
											From: {complaint.student.name}
										</Text>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											{complaint.student?.block?.name && (
												<View
													style={{
														backgroundColor: "rgba(255, 204, 0, 0)",
														paddingHorizontal: 0,
														paddingVertical: 2,
														borderRadius: 4,
														flexDirection: "row",
														alignItems: "center",
														gap: 4,
													}}
												>
													<Text
														style={{
															color: "#9CA3AF",
															fontSize: 11,
															fontWeight: "600",
														}}
													>
														Block {complaint.student?.block?.name}
													</Text>
												</View>
											)}
											{complaint.student?.room?.roomNumber && (
												<View
													style={{
														backgroundColor: "rgba(255, 204, 0, 0)",
														paddingHorizontal: 0,
														paddingVertical: 2,
														borderRadius: 4,
														flexDirection: "row",
														alignItems: "center",
														gap: 4,
													}}
												>
													<Text
														style={{
															color: "#9CA3AF",
															fontSize: 11,
															fontWeight: "600",
														}}
													>
														Room : {complaint.student?.room?.roomNumber}
													</Text>
												</View>
											)}
											{complaint.student?.rollNo && (
												<View
													style={{
														backgroundColor: "rgba(255, 204, 0, 0)",
														paddingHorizontal: 0,
														paddingVertical: 2,
														borderRadius: 4,
														flexDirection: "row",
														alignItems: "center",
														gap: 4,
													}}
												>
													<Text
														style={{
															color: "#9CA3AF",
															fontSize: 11,
															fontWeight: "600",
														}}
													>
														Roll : {complaint.student?.rollNo}
													</Text>
												</View>
											)}
										</View>
									</View>
								</View>

								{updatingId === complaint._id ? (
									<ActivityIndicator size="small" color="#FFCC00" />
								) : (
									<Pressable
										onPress={() => {
											setSelectedComplaint(complaint);
											setModalVisible(true);
										}}
										style={({ pressed }) => ({
											backgroundColor: "rgba(255,204,0,0.1)",
											paddingHorizontal: 10,
											paddingVertical: 10,
											borderRadius: 20,
											borderWidth: 1,
											borderColor: "rgba(255,204,0,0.3)",
											opacity: pressed ? 0.8 : 1,
										})}
									>
										{/* <Text
											style={{
												color: "#FFCC00",
												fontSize: 12,
												fontWeight: "600",
											}}
										>
											Update
										</Text> */}
										<FontAwesome
											name="pencil"
											size={15}
											color={"#FFCC00"}
											style={{ marginLeft: 2 }}
										/>
									</Pressable>
								)}
							</View>

							<View
								style={{
									backgroundColor: "rgba(0,0,0,0.3)",
									borderRadius: 12,
									padding: 12,
									marginBottom: 12,
								}}
							>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 14,
										marginBottom: 4,
									}}
								>
									Description
								</Text>
								<Text
									style={{
										color: "white",
										fontSize: 12,
										lineHeight: 20,
										fontWeight: 600,
									}}
								>
									{complaint.description}
								</Text>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "flex-end",
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: 8,
									}}
								>
									{/* <View
										style={{
											backgroundColor: `${COMPLAINT_STATUS_COLORS[complaint.status]}20`,
											paddingHorizontal: 10,
											paddingVertical: 4,
											borderRadius: 8,
											flexDirection: "row",
											alignItems: "center",
											gap: 6,
										}}
									>
										<FontAwesome
											name={COMPLAINT_STATUS_ICONS[complaint.status]}
											size={12}
											color={COMPLAINT_STATUS_COLORS[complaint.status]}
										/>
										<Text
											style={{
												color: COMPLAINT_STATUS_COLORS[complaint.status],
												fontSize: 12,
												fontWeight: "600",
											}}
										>
											{COMPLAINT_STATUS_LABELS[complaint.status]}
										</Text>
									</View> */}

									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 4,
										}}
									>
										<FontAwesome name="calendar" size={12} color="#f8f7f5" />
										<Text
											style={{
												color: "#f8f7f5",
												fontSize: 11,
												fontWeight: 600,
											}}
										>
											{new Date(complaint.createdAt).toLocaleDateString()}
										</Text>
									</View>
								</View>
							</View>
						</LinearGradient>
					))
				)}
			</ScrollView>
		</LinearGradient>
	);
}
