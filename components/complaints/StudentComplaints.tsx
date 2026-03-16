import { deleteComplaint, fetchComplaints } from "@/src/api/complaint.api";
import { fetchProfile } from "@/src/api/profile.api";
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
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";

export default function StudentComplaints() {
	const { token } = useAuth();
	const router = useRouter();
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [filter, setFilter] = useState<ComplaintStatus | "ALL">("ALL");
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [hasBlock, setHasBlock] = useState(false);
	const [checkingBlock, setCheckingBlock] = useState(true);

	useEffect(() => {
		checkBlockStatus();
	}, []);

	const checkBlockStatus = async () => {
		try {
			const profile = await fetchProfile(token!);
			setHasBlock(!!profile.block);
		} catch (error) {
			console.error("Failed to check block status", error);
		} finally {
			setCheckingBlock(false);
		}
	};

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

	const handleDeletePress = (complaint: Complaint) => {
		// Only allow deletion of OPEN complaints
		if (complaint.status !== "OPEN") {
			ToastService.showError({
				message: "Cannot delete a complaint that is in progress or resolved",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		// 	Alert.alert(
		// 		"Delete Complaint",
		// 		"Are you sure you want to delete this complaint? This action cannot be undone.",
		// 		[
		// 			{
		// 				text: "Cancel",
		// 				style: "cancel",
		// 			},
		// 			{
		// 				text: "Delete",
		// 				onPress: () => handleDelete(complaint._id),
		// 				style: "destructive",
		// 			},
		// 		],
		// 		{ cancelable: true },
		// 	);
		Alert.alert({
			title: "Delete Complaint",
			description: `Are you sure you want to delete this complaint? This action cannot be undone.`,
			buttons: [
				{
					text: "Cancel",
					textStyle: { color: "#00ff1a" },
					onPress: () => {},
				},
				{
					text: "Delete",
					textStyle: { color: "#ff1500" },
					onPress: () => handleDelete(complaint._id),
				},
			],
			showCancelButton: true,
		});
	};

	const handleDelete = async (complaintId: string) => {
		if (!token) return;

		setDeletingId(complaintId);
		try {
			await deleteComplaint(token, complaintId);
			await loadComplaints();
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Complaint deleted successfully",
				duration: 3000,
				position: "bottom",
			});
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to delete complaint",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setDeletingId(null);
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

	if (loading || checkingBlock) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
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
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 24,
					}}
				>
					<View>
						<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
							My Complaints
						</Text>
						<Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4 }}>
							Track your reported issues
						</Text>
					</View>

					{hasBlock && (
						<Pressable
							onPress={() => router.push("/create-complaint")}
							style={({ pressed }) => ({
								backgroundColor: "rgba(239,68,68,0.1)",
								width: 48,
								height: 48,
								borderRadius: 25,
								alignItems: "center",
								justifyContent: "center",
								borderWidth: 1,
								borderColor: "rgba(239,68,68,0.3)",
								transform: [{ scale: pressed ? 0.95 : 1 }],
							})}
						>
							<FontAwesome name="plus" size={22} color="#EF4444" />
						</Pressable>
					)}
				</View>
				{!hasBlock && (
					<LinearGradient
						colors={["rgba(255,204,0,0.05)", "rgba(255,204,0,0.02)"]}
						style={{
							borderRadius: 16,
							borderWidth: 1,
							borderColor: "rgba(255,204,0,0.2)",
							padding: 24,
							alignItems: "center",
							marginBottom: 20,
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
							<FontAwesome name="info-circle" size={30} color="#FFCC00" />
						</View>
						<Text
							style={{
								color: "white",
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 4,
								textAlign: "center",
							}}
						>
							Join a Block First
						</Text>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								textAlign: "center",
							}}
						>
							You need to join a block before you can file complaints
						</Text>
					</LinearGradient>
				)}
				{/* Stats Cards with Filter */}
				<View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
					<Pressable onPress={() => setFilter("ALL")} style={{ flex: 1 }}>
						<LinearGradient
							colors={
								filter === "ALL"
									? ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.05)"]
									: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
							}
							style={{
								borderRadius: 25,
								borderWidth: 1,
								borderColor:
									filter === "ALL"
										? "rgba(255,255,255,0.2)"
										: "rgba(255,255,255,0.1)",
								padding: 10,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 11 }}>Total</Text>
							<Text
								style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
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
								borderRadius: 25,
								borderWidth: 1,
								borderColor:
									filter === "OPEN"
										? "rgba(239,68,68,0.3)"
										: "rgba(255,255,255,0.1)",
								padding: 10,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 11 }}>Open</Text>
							<Text
								style={{ color: "#EF4444", fontSize: 20, fontWeight: "bold" }}
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
								borderRadius: 25,
								borderWidth: 1,
								borderColor:
									filter === "IN_PROGRESS"
										? "rgba(245,158,11,0.3)"
										: "rgba(255,255,255,0.1)",
								padding: 10,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 11 }}>Solving</Text>
							<Text
								style={{ color: "#F59E0B", fontSize: 20, fontWeight: "bold" }}
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
								borderRadius: 25,
								borderWidth: 1,
								borderColor:
									filter === "RESOLVED"
										? "rgba(74,222,128,0.3)"
										: "rgba(255,255,255,0.1)",
								padding: 10,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 11 }}>Closed</Text>
							<Text
								style={{ color: "#4ADE80", fontSize: 20, fontWeight: "bold" }}
							>
								{getStatusCount("RESOLVED")}
							</Text>
						</LinearGradient>
					</Pressable>
				</View>

				{filteredComplaints.length === 0 ? (
					<LinearGradient
						colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
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
								backgroundColor:
									filter === "ALL"
										? "rgba(239,68,68,0.1)"
										: filter === "OPEN"
											? "rgba(239,68,68,0.1)"
											: filter === "IN_PROGRESS"
												? "rgba(245,158,11,0.1)"
												: "rgba(74,222,128,0.1)",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 12,
							}}
						>
							<FontAwesome
								name={
									filter === "ALL"
										? "bullhorn"
										: filter === "OPEN"
											? "exclamation-circle"
											: filter === "IN_PROGRESS"
												? "clock-o"
												: "check-circle"
								}
								size={28}
								color={
									filter === "ALL"
										? "#EF4444"
										: filter === "OPEN"
											? "#EF4444"
											: filter === "IN_PROGRESS"
												? "#F59E0B"
												: "#4ADE80"
								}
							/>
						</View>
						<Text
							style={{
								color: "white",
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 4,
							}}
						>
							{filter === "ALL"
								? "No Complaints Yet"
								: filter === "OPEN"
									? "No Open Complaints"
									: filter === "IN_PROGRESS"
										? "No In-Progress Complaints"
										: "No Resolved Complaints"}
						</Text>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								textAlign: "center",
								marginBottom: filter === "ALL" ? 20 : 0,
							}}
						>
							{filter === "ALL"
								? "Have an issue? File a complaint and we'll help you resolve it."
								: `You don't have any ${filter === "IN_PROGRESS" ? "in-progress" : filter.toLowerCase()} complaints`}
						</Text>
						{filter === "ALL" && (
							<Pressable
								onPress={() => router.push("/create-complaint")}
								style={({ pressed }) => ({
									backgroundColor: "#EF4444",
									paddingHorizontal: 18,
									paddingVertical: 14,
									borderRadius: 25,
									flexDirection: "row",
									alignItems: "center",
									gap: 8,
									opacity: pressed ? 0.9 : 1,
								})}
							>
								<FontAwesome name="plus" size={16} color="white" />
							</Pressable>
						)}
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
									alignItems: "center",
									marginBottom: 12,
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
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<Text
											style={{
												color: "white",
												fontSize: 16,
												fontWeight: "600",
												flex: 1,
											}}
											numberOfLines={1}
										>
											{complaint.category}
										</Text>
										<View
											style={{
												backgroundColor: `${COMPLAINT_STATUS_COLORS[complaint.status]}20`,
												paddingHorizontal: 8,
												paddingVertical: 4,
												borderRadius: 6,
												flexDirection: "row",
												alignItems: "center",
												gap: 4,
												marginRight: 8,
											}}
										>
											<FontAwesome
												name={COMPLAINT_STATUS_ICONS[complaint.status]}
												size={10}
												color={COMPLAINT_STATUS_COLORS[complaint.status]}
											/>
											<Text
												style={{
													color: COMPLAINT_STATUS_COLORS[complaint.status],
													fontSize: 10,
													fontWeight: "600",
												}}
											>
												{COMPLAINT_STATUS_LABELS[complaint.status]}
											</Text>
										</View>

										{/* Delete Button - Only show for OPEN complaints */}
										{complaint.status === "OPEN" &&
											(deletingId === complaint._id ? (
												<ActivityIndicator size="small" color="#EF4444" />
											) : (
												<Pressable
													onPress={() => handleDeletePress(complaint)}
													style={({ pressed }) => ({
														padding: 7,
														paddingHorizontal: 9,
														borderColor: "#EF4444",
														borderWidth: 1,
														borderRadius: 15,
														backgroundColor: "#ef444400",
														opacity: pressed ? 0.7 : 1,
													})}
												>
													<FontAwesome name="trash" size={14} color="#EF4444" />
												</Pressable>
											))}
									</View>
									<Text
										style={{
											color: "#9CA3AF",
											fontSize: 10,
											marginTop: 2,
										}}
									>
										{new Date(complaint.createdAt).toLocaleDateString(
											undefined,
											{
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</Text>
								</View>
							</View>

							<View
								style={{
									backgroundColor: "rgba(0,0,0,0.3)",
									borderRadius: 12,
									padding: 12,
									marginLeft: 56,
								}}
							>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 11,
										marginBottom: 4,
									}}
								>
									Description
								</Text>
								<Text
									style={{
										color: "white",
										fontSize: 13,
										lineHeight: 18,
									}}
								>
									{complaint.description}
								</Text>
							</View>

							{/* Warning for non-deletable complaints */}
							{complaint.status !== "OPEN" && (
								<View
									style={{
										marginTop: 8,
										marginLeft: 56,
										flexDirection: "row",
										alignItems: "center",
										gap: 4,
									}}
								>
									<FontAwesome name="info-circle" size={10} color="#6B7280" />
									<Text style={{ color: "#6B7280", fontSize: 9 }}>
										Cannot delete {complaint.status.toLowerCase()} complaints
									</Text>
								</View>
							)}
						</LinearGradient>
					))
				)}
			</ScrollView>
		</LinearGradient>
	);
}
