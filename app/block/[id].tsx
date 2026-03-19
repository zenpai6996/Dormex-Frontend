import BlockRooms from "@/components/dashboard/blocks/BlockRooms";
import BlockStudents from "@/components/dashboard/blocks/BlockStudents";
import { fetchBlockById } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
type Tab = "rooms" | "students";

export default function BlockManagementScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { token } = useAuth();
	const [activeTab, setActiveTab] = useState<Tab>("rooms");
	const [blockData, setBlockData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const loadBlockData = async () => {
		try {
			const data = await fetchBlockById(token!, id as string);
			setBlockData(data);
		} catch (error) {
			console.error("Failed to load block", error);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadBlockData();
		setRefreshing(false);
	};

	useEffect(() => {
		loadBlockData();
	}, [id]);

	if (loading) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</LinearGradient>
		);
	}

	if (!blockData) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<Text style={{ color: "white" }}>Block not found</Text>
			</LinearGradient>
		);
	}

	const { block, stats } = blockData;

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingTop: 60 }}
				showsVerticalScrollIndicator={false}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 24,
					}}
				>
					<Pressable
						onPress={() => router.back()}
						style={({ pressed }) => ({
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: "rgba(255,255,255,0.1)",
							alignItems: "center",
							justifyContent: "center",
							marginRight: 16,
							transform: [{ scale: pressed ? 0.95 : 1 }],
						})}
					>
						<FontAwesome name="arrow-left" size={20} color="#FFCC00" />
					</Pressable>
					<View>
						<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
							Block {block.name}
						</Text>
						<Text style={{ color: "#9CA3AF", fontSize: 14 }}>
							{stats.totalRooms} rooms
						</Text>
					</View>
				</View>

				<View
					style={{
						flexDirection: "row",
						backgroundColor: "rgba(255,255,255,0.05)",
						borderRadius: 12,
						padding: 4,
						marginBottom: 24,
					}}
				>
					<Pressable
						onPress={() => setActiveTab("rooms")}
						style={{
							flex: 1,
							backgroundColor:
								activeTab === "rooms" ? "rgba(255,204,0,0.2)" : "transparent",
							borderRadius: 8,
							paddingVertical: 10,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: activeTab === "rooms" ? "#FFCC00" : "#9CA3AF",
								fontWeight: activeTab === "rooms" ? "600" : "400",
							}}
						>
							Rooms
						</Text>
					</Pressable>
					<Pressable
						onPress={() => setActiveTab("students")}
						style={{
							flex: 1,
							backgroundColor:
								activeTab === "students"
									? "rgba(255,204,0,0.2)"
									: "transparent",
							borderRadius: 8,
							paddingVertical: 10,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: activeTab === "students" ? "#FFCC00" : "#9CA3AF",
								fontWeight: activeTab === "students" ? "600" : "400",
							}}
						>
							Students{" "}
							{stats.unassignedStudents == 0 ? (
								<></>
							) : (
								-stats.unassignedStudents
							)}
						</Text>
					</Pressable>
				</View>

				{activeTab === "rooms" ? (
					<BlockRooms
						blockId={id as string}
						rooms={blockData.rooms}
						stats={stats}
						onRefresh={onRefresh}
					/>
				) : (
					<BlockStudents
						blockId={id as string}
						unassignedStudents={blockData.unassignedStudents}
						rooms={blockData.rooms}
						onRefresh={onRefresh}
					/>
				)}
			</ScrollView>
		</LinearGradient>
	);
}
