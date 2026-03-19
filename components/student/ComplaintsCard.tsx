import { fetchComplaints } from "@/src/api/complaint.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface Complaint {
	_id: string;
	category: string;
	description: string;
	status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
	createdAt: string;
}

interface ComplaintsCardProps {
	onCreatePress: () => void;
	refreshKey?: number;
}

export default function ComplaintsCard({
	onCreatePress,
	refreshKey,
}: ComplaintsCardProps) {
	const { token } = useAuth();
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadComplaints();
	}, [refreshKey]);

	const loadComplaints = async () => {
		try {
			setLoading(true);
			const data = await fetchComplaints(token!);
			setComplaints(data.slice(0, 3));
		} catch (error) {
			console.error("Failed to load complaints", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusConfig = (status: string) => {
		switch (status) {
			case "OPEN":
				return {
					color: "#EF4444",
					bg: "rgba(239,68,68,0.12)",
					border: "rgba(239,68,68,0.25)",
					icon: "exclamation-circle",
					label: "Open",
				};
			case "IN_PROGRESS":
				return {
					color: "#FFCC00",
					bg: "rgba(255,204,0,0.12)",
					border: "rgba(255,204,0,0.25)",
					icon: "clock-o",
					label: "In Progress",
				};
			case "RESOLVED":
				return {
					color: "#4ADE80",
					bg: "rgba(74,222,128,0.12)",
					border: "rgba(74,222,128,0.25)",
					icon: "check-circle",
					label: "Resolved",
				};
			default:
				return {
					color: "#9CA3AF",
					bg: "rgba(156,163,175,0.12)",
					border: "rgba(156,163,175,0.25)",
					icon: "circle",
					label: status,
				};
		}
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
			{/* Header */}
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
							borderRadius: 12,
							backgroundColor: "rgba(239,68,68,0.12)",
							borderWidth: 1,
							borderColor: "rgba(239,68,68,0.2)",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<FontAwesome name="bullhorn" size={18} color="#EF4444" />
					</View>
					<View>
						<Text style={{ color: "white", fontSize: 17, fontWeight: "700" }}>
							My Complaints
						</Text>
						<Text style={{ color: "#6B7280", fontSize: 12, marginTop: 1 }}>
							{complaints.length} recent
						</Text>
					</View>
				</View>
			</View>

			<View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />

			{/* Body */}
			<View style={{ padding: 16 }}>
				{loading ? (
					<ActivityIndicator color="#FFCC00" style={{ paddingVertical: 24 }} />
				) : complaints.length === 0 ? (
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
							<FontAwesome name="check" size={20} color="#4ADE80" />
						</View>
						<Text style={{ color: "#9CA3AF", fontSize: 14, fontWeight: "500" }}>
							No complaints filed
						</Text>
						<Text style={{ color: "#4B5563", fontSize: 12, marginTop: 3 }}>
							Tap + to report an issue
						</Text>
					</View>
				) : (
					<View style={{ gap: 10 }}>
						{complaints.map((complaint) => {
							const config = getStatusConfig(complaint.status);
							return (
								<View
									key={complaint._id}
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
									{/* Icon */}
									<View
										style={{
											width: 40,
											height: 40,
											borderRadius: 10,
											backgroundColor: config.bg,
											borderWidth: 1,
											borderColor: config.border,
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
										}}
									>
										<FontAwesome
											name={config.icon as any}
											size={15}
											color={config.color}
										/>
									</View>

									{/* Text */}
									<View style={{ flex: 1 }}>
										<Text
											style={{
												color: "white",
												fontSize: 14,
												fontWeight: "600",
												marginBottom: 3,
											}}
											numberOfLines={1}
										>
											{complaint.category}
										</Text>
										<Text
											style={{ color: "#6B7280", fontSize: 12 }}
											numberOfLines={1}
										>
											{complaint.description}
										</Text>
									</View>

									{/* Status badge */}
									<View
										style={{
											backgroundColor: config.bg,
											borderWidth: 1,
											borderColor: config.border,
											paddingHorizontal: 9,
											paddingVertical: 4,
											borderRadius: 20,
											flexShrink: 0,
										}}
									>
										<Text
											style={{
												color: config.color,
												fontSize: 10,
												fontWeight: "700",
											}}
										>
											{config.label}
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				)}
			</View>
		</LinearGradient>
	);
}
