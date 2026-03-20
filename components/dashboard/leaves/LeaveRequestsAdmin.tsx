import {
	LEAVE_STATUS_COLORS,
	LEAVE_STATUS_LABELS,
	LeaveApplication,
	LeaveStatus,
} from "@/src/types/leave.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface LeaveRequestsAdminProps {
	leaves: LeaveApplication[];
	loading: boolean;
	filter: LeaveStatus | "ALL";
	onFilterChange: (value: LeaveStatus | "ALL") => void;
	onApprove: (leaveId: string) => void;
	onReject: (leaveId: string) => void;
	updatingId?: string | null;
}

const filters: Array<LeaveStatus | "ALL"> = [
	"ALL",
	"PENDING",
	"APPROVED",
	"REJECTED",
];

export default function LeaveRequestsAdmin({
	leaves,
	loading,
	filter,
	onFilterChange,
	onApprove,
	onReject,
	updatingId,
}: LeaveRequestsAdminProps) {
	const formatDate = (value: string) => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString();
	};

	const filteredLeaves =
		filter === "ALL"
			? leaves
			: leaves.filter((leave) => leave.status === filter);

	return (
		<View style={{ marginTop: 8 }}>
			<View
				style={{
					flexDirection: "row",
					backgroundColor: "rgba(255,255,255,0.05)",
					borderRadius: 12,
					padding: 4,
					marginBottom: 16,
				}}
			>
				{filters.map((item) => (
					<Pressable
						key={item}
						onPress={() => onFilterChange(item)}
						style={{
							flex: 1,
							backgroundColor:
								filter === item ? "rgba(255,204,0,0.2)" : "transparent",
							borderRadius: 8,
							paddingVertical: 10,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: filter === item ? "#FFCC00" : "#9CA3AF",
								fontWeight: filter === item ? "600" : "400",
							}}
						>
							{item === "ALL" ? "All" : LEAVE_STATUS_LABELS[item]}
						</Text>
					</Pressable>
				))}
			</View>

			{loading ? (
				<ActivityIndicator color="#FFCC00" style={{ marginTop: 20 }} />
			) : filteredLeaves.length === 0 ? (
				<LinearGradient
					colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)"]}
					style={{
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 24,
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
						No leave applications
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 13 }}>
						No requests match the current filter
					</Text>
				</LinearGradient>
			) : (
				<View style={{ gap: 12 }}>
					{filteredLeaves.map((leave) => (
						<View
							key={leave._id}
							style={{
								backgroundColor: "rgba(255,255,255,0.06)",
								borderRadius: 16,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								padding: 16,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 8,
								}}
							>
								<View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
									<View
										style={{
											width: 38,
											height: 38,
											borderRadius: 20,
											backgroundColor: `${LEAVE_STATUS_COLORS[leave.status]}22`,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<FontAwesome name="user" size={16} color="#FFCC00" />
									</View>
									<View style={{ flex: 1 }}>
										<Text
											style={{
												color: "white",
												fontSize: 15,
												fontWeight: "700",
											}}
										>
											{leave.student?.name || "Student"}
										</Text>
										<Text style={{ color: "#6B7280", fontSize: 12 }}>
											{leave.student?.rollNo || "No roll number"}
										</Text>
									</View>
								</View>

								<View
									style={{
										backgroundColor: `${LEAVE_STATUS_COLORS[leave.status]}22`,
										borderWidth: 1,
										borderColor: `${LEAVE_STATUS_COLORS[leave.status]}55`,
										paddingHorizontal: 10,
										paddingVertical: 4,
										borderRadius: 999,
									}}
								>
									<Text
										style={{
											color: LEAVE_STATUS_COLORS[leave.status],
											fontSize: 11,
											fontWeight: "700",
										}}
									>
										{LEAVE_STATUS_LABELS[leave.status]}
									</Text>
								</View>
							</View>

							<View style={{ gap: 6 }}>
								<Text style={{ color: "#D1D5DB", fontSize: 13 }}>
									{formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
								</Text>
								<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
									Reason : {leave.reason}
								</Text>
								<Text style={{ color: "#6B7280", fontSize: 12 }}>
									{leave.student?.block?.name ||
										leave.block?.name ||
										"No block"}{" "}
									· Room{" "}
									{leave.student?.room?.roomNumber ||
										leave.room?.roomNumber ||
										"-"}
								</Text>
							</View>

							{leave.status === "PENDING" ? (
								<View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
									<Pressable
										onPress={() => onReject(leave._id)}
										disabled={updatingId === leave._id}
										style={({ pressed }) => ({
											flex: 1,
											backgroundColor: "rgba(239,68,68,0.15)",
											borderWidth: 1,
											borderColor: "rgba(239,68,68,0.4)",
											borderRadius: 12,
											paddingVertical: 10,
											alignItems: "center",
											opacity: pressed || updatingId === leave._id ? 0.8 : 1,
										})}
									>
										<Text style={{ color: "#EF4444", fontWeight: "600" }}>
											Reject
										</Text>
									</Pressable>
									<Pressable
										onPress={() => onApprove(leave._id)}
										disabled={updatingId === leave._id}
										style={({ pressed }) => ({
											flex: 1,
											backgroundColor: "rgba(74,222,128,0.15)",
											borderWidth: 1,
											borderColor: "rgba(74,222,128,0.4)",
											borderRadius: 12,
											paddingVertical: 10,
											alignItems: "center",
											opacity: pressed || updatingId === leave._id ? 0.8 : 1,
										})}
									>
										<Text style={{ color: "#4ADE80", fontWeight: "600" }}>
											Approve
										</Text>
									</Pressable>
								</View>
							) : (
								<View style={{ marginTop: 12 }}>
									<Text style={{ color: "#6B7280", fontSize: 12 }}>
										Updated status: {LEAVE_STATUS_LABELS[leave.status]}
									</Text>
								</View>
							)}
						</View>
					))}
				</View>
			)}
		</View>
	);
}
