import { fetchLeaves } from "@/src/api/leave.api";
import { useAuth } from "@/src/context/AuthContext";
import {
	LEAVE_STATUS_COLORS,
	LEAVE_STATUS_ICONS,
	LEAVE_STATUS_LABELS,
	LeaveApplication,
} from "@/src/types/leave.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LeaveCardProps {
	refreshKey?: number;
}

export default function LeaveCard({ refreshKey }: LeaveCardProps) {
	const { token } = useAuth();
	const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadLeaves();
	}, [refreshKey]);

	const loadLeaves = async () => {
		if (!token) return;
		try {
			setLoading(true);
			const data = await fetchLeaves(token);
			setLeaves(data.slice(0, 3));
		} catch (error) {
			console.error("Failed to load leaves", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (value: string) => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString();
	};

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				overflow: "hidden",
				marginBottom: 16,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 20,
					paddingTop: 20,
					paddingBottom: 16,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
					<View
						style={{
							width: 44,
							height: 44,
							borderRadius: 20,
							backgroundColor: "rgba(255,204,0,0.12)",
							borderWidth: 1,
							borderColor: "rgba(255,204,0,0.2)",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<FontAwesome name="calendar" size={18} color="#FFCC00" />
					</View>
					<View>
						<Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>
							My Leaves
						</Text>
						<Text style={{ color: "#6B7280", fontSize: 12, marginTop: 1 }}>
							{leaves.length} recent
						</Text>
					</View>
				</View>
			</View>

			<View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />

			<View style={{ padding: 16 }}>
				{loading ? (
					<ActivityIndicator color="#FFCC00" style={{ paddingVertical: 24 }} />
				) : leaves.length === 0 ? (
					<View style={{ alignItems: "center", paddingVertical: 28 }}>
						<View
							style={{
								width: 48,
								height: 48,
								borderRadius: 24,
								backgroundColor: "rgba(255,255,255,0.06)",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 10,
							}}
						>
							<FontAwesome name="calendar-check-o" size={20} color="#4ADE80" />
						</View>
						<Text style={{ color: "#9CA3AF", fontSize: 14, fontWeight: "500" }}>
							No leave applications yet
						</Text>
						<Text style={{ color: "#4B5563", fontSize: 12, marginTop: 3 }}>
							Tap to apply for leave
						</Text>
					</View>
				) : (
					<View style={{ gap: 10 }}>
						{leaves.map((leave) => (
							<View
								key={leave._id}
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "rgba(255,255,255,0.04)",
									borderRadius: 14,
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.07)",
									padding: 12,
									gap: 12,
								}}
							>
								<View
									style={{
										width: 40,
										height: 40,
										borderRadius: 20,
										backgroundColor: `${LEAVE_STATUS_COLORS[leave.status]}22`,
										borderWidth: 1,
										borderColor: `${LEAVE_STATUS_COLORS[leave.status]}55`,
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}
								>
									<FontAwesome
										name={LEAVE_STATUS_ICONS[leave.status] as any}
										size={15}
										color={LEAVE_STATUS_COLORS[leave.status]}
									/>
								</View>

								<View style={{ flex: 1 }}>
									<Text
										style={{
											color: "white",
											fontSize: 12,
											fontWeight: "600",
											marginBottom: 3,
										}}
										numberOfLines={1}
									>
										{formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
									</Text>
									<Text
										style={{ color: "#6B7280", fontSize: 12 }}
										numberOfLines={1}
									>
										{leave.reason}
									</Text>
								</View>

								<View
									style={{
										backgroundColor: `${LEAVE_STATUS_COLORS[leave.status]}22`,
										borderWidth: 1,
										borderColor: `${LEAVE_STATUS_COLORS[leave.status]}55`,
										paddingHorizontal: 9,
										paddingVertical: 4,
										borderRadius: 20,
										flexShrink: 0,
									}}
								>
									<Text
										style={{
											color: LEAVE_STATUS_COLORS[leave.status],
											fontSize: 10,
											fontWeight: "700",
										}}
									>
										{LEAVE_STATUS_LABELS[leave.status]}
									</Text>
								</View>
							</View>
						))}
					</View>
				)}
			</View>
		</LinearGradient>
	);
}
