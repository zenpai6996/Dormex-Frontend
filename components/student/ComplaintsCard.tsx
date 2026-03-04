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

	const getStatusColor = (status: string) => {
		switch (status) {
			case "OPEN":
				return "#EF4444";
			case "IN_PROGRESS":
				return "#F59E0B";
			case "RESOLVED":
				return "#4ADE80";
			default:
				return "#9CA3AF";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "OPEN":
				return "exclamation-circle";
			case "IN_PROGRESS":
				return "clock-o";
			case "RESOLVED":
				return "check-circle";
			default:
				return "circle";
		}
	};

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 20,
				marginBottom: 16,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 16,
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
							borderRadius: 12,
							backgroundColor: "rgba(239,68,68,0.1)",
							alignItems: "center",
							justifyContent: "center",
							marginRight: 12,
						}}
					>
						<FontAwesome name="bullhorn" size={20} color="#EF4444" />
					</View>
					<View>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontWeight: "bold",
							}}
						>
							My Complaints
						</Text>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 13,
							}}
						>
							{complaints.length} active
						</Text>
					</View>
				</View>
				{/* <Pressable
					onPress={onCreatePress}
					style={({ pressed }) => ({
						backgroundColor: "rgba(239,68,68,0.1)",
						width: 40,
						height: 40,
						borderRadius: 10,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderColor: "rgba(239,68,68,0.3)",
						opacity: pressed ? 0.8 : 1,
					})}
				>
					<FontAwesome name="plus" size={18} color="#EF4444" />
				</Pressable> */}
			</View>

			<View
				style={{
					height: 1,
					backgroundColor: "rgba(255,255,255,0.1)",
					marginBottom: 16,
				}}
			/>

			{loading ? (
				<ActivityIndicator color="#FFCC00" style={{ paddingVertical: 20 }} />
			) : complaints.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						paddingVertical: 20,
					}}
				>
					<Text
						style={{
							color: "#6B7280",
							fontSize: 14,
							marginBottom: 4,
						}}
					>
						No complaints filed
					</Text>
					<Text
						style={{
							color: "#4B5563",
							fontSize: 12,
						}}
					>
						Tap + to report an issue
					</Text>
				</View>
			) : (
				complaints.map((complaint, index) => (
					<View
						key={complaint._id}
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingVertical: 12,
							borderBottomWidth: index < complaints.length - 1 ? 1 : 0,
							borderBottomColor: "rgba(255,255,255,0.05)",
						}}
					>
						<View
							style={{
								width: 36,
								height: 36,
								borderRadius: 10,
								backgroundColor: `${getStatusColor(complaint.status)}20`,
								alignItems: "center",
								justifyContent: "center",
								marginRight: 12,
							}}
						>
							<FontAwesome
								name={getStatusIcon(complaint.status) as any}
								size={14}
								color={getStatusColor(complaint.status)}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<Text
								style={{
									color: "white",
									fontSize: 14,
									fontWeight: "500",
									marginBottom: 2,
								}}
								numberOfLines={1}
							>
								{complaint.category}
							</Text>
							<Text
								style={{
									color: "#6B7280",
									fontSize: 12,
								}}
								numberOfLines={1}
							>
								{complaint.description}
							</Text>
						</View>
						<View
							style={{
								backgroundColor: `${getStatusColor(complaint.status)}20`,
								paddingHorizontal: 8,
								paddingVertical: 3,
								borderRadius: 6,
							}}
						>
							<Text
								style={{
									color: getStatusColor(complaint.status),
									fontSize: 10,
									fontWeight: "600",
								}}
							>
								{complaint.status.replace("_", " ")}
							</Text>
						</View>
					</View>
				))
			)}
		</LinearGradient>
	);
}
