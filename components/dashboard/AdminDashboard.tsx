import { fetchBlocks } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
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
import BlockList from "./blocks/blockList";
import BlocksEmptyState from "./cards/BlockEmptyState";
import MenuEmptyState from "./cards/MenuEmptyState";
import StatsCard from "./cards/StatsCard";
import TodayMenu from "./cards/TodayMenu";
import ComplaintsSummary from "./ComplaintSummary";
import EmptyState from "./EmptyState";
import SectionHeader from "./SectionHeader";

export default function AdminDashboard({ data }) {
	const auth = useAuth();
	const router = useRouter();
	const [blocks, setBlocks] = useState([]);
	const [loadingBlocks, setLoadingBlocks] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const loadBlocks = async () => {
		if (!auth.token) return;
		setLoadingBlocks(true);
		try {
			const blocksData = await fetchBlocks(auth.token);
			setBlocks(blocksData);
		} catch (error) {
			console.error("Failed to load blocks", error);
		} finally {
			setLoadingBlocks(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadBlocks();
		setRefreshing(false);
	};

	useEffect(() => {
		loadBlocks();
	}, [auth.token]);

	const handleLogoutPress = () => {
		Alert.alert({
			title: "Logout",
			description: "Are you sure you want to logout?",
			buttons: [
				{
					text: "Cancel",
					textStyle: {
						color: "#00ff1a",
					},
					onPress: () => {},
				},
				{
					text: "Yes",
					textStyle: {
						color: "#EF4444",
					},
					onPress: handleLogout,
				},
			],
			showCancelButton: true,
		});
	};

	const handleLogout = async () => {
		try {
			await auth?.logout();
			ToastService.showError({
				contentContainerStyle: {
					borderStartColor: "#FFCC00",
					borderStartWidth: 5,
					borderEndColor: "#FFCC00",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Logged Out Successfully",
				duration: 3000,
				position: "bottom",
			});
			router.replace("/(auth)");
		} catch (error) {
			Alert.alert({
				title: "Error",
				description: "Failed to logout. Please try again.",
				showCancelButton: false,
			});
		}
	};

	if (data.students.total === 0) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
				style={{ flex: 1 }}
			>
				<EmptyState message="No students yet. The dashboard will populate once students join." />
			</LinearGradient>
		);
	}

	const occupancyRate = Math.round(
		(data.rooms.occupied / data.rooms.total) * 100,
	);
	const studentOccupancyRate = Math.round(
		(data.students.active / data.students.total) * 100,
	);
	const hasBlocks = blocks.length > 0;
	const hasMenu = data.todayMenu !== null;

	return (
		<LinearGradient
			colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
			style={{ flex: 1 }}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					padding: 16,
					paddingBottom: 122,
					marginTop: 30,
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
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 8,
						}}
					>
						<View>
							<Text
								style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
							>
								Admin Dashboard
							</Text>
						</View>

						<View style={{ flexDirection: "row", gap: 12 }}>
							<Pressable
								onPress={() => router.push("/modal")}
								style={({ pressed }) => ({
									backgroundColor: "rgba(255,255,255,0.1)",
									width: 44,
									height: 44,
									borderRadius: 22,
									alignItems: "center",
									justifyContent: "center",
									borderWidth: 1,
									borderColor: pressed ? "#ffcc00" : "rgba(255,204,0,0.3)",
									transform: [{ scale: pressed ? 0.95 : 1 }],
								})}
							>
								{({ pressed }) => (
									<FontAwesome
										name="user-circle"
										size={24}
										color={pressed ? "#ffcc00" : "#ffcc00"}
										style={{ opacity: pressed ? 0.8 : 1 }}
									/>
								)}
							</Pressable>

							<Pressable
								onPress={handleLogoutPress}
								style={({ pressed }) => ({
									backgroundColor: "rgba(255,255,255,0.1)",
									width: 44,
									height: 44,
									borderRadius: 22,
									alignItems: "center",
									justifyContent: "center",
									borderWidth: 1,
									borderColor: pressed ? "#ffcc00" : "rgba(255,204,0,0.3)",
									transform: [{ scale: pressed ? 0.95 : 1 }],
								})}
							>
								{({ pressed }) => (
									<FontAwesome
										name="sign-out"
										size={24}
										color={pressed ? "#ffcc00" : "#ffcc00"}
										style={{ opacity: pressed ? 0.8 : 1, marginLeft: 5 }}
									/>
								)}
							</Pressable>
						</View>
					</View>
				</View>

				<SectionHeader title="Student Statistics" />

				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 12,
						marginBottom: 16,
					}}
				>
					<View style={{ width: "48%" }}>
						<StatsCard
							label="Total "
							value={data.students.total}
							icon="👥"
							gradient
						/>
					</View>
					<View style={{ width: "48%" }}>
						<StatsCard
							label="Active "
							value={data.students.active}
							icon="✅"
							trend={{ value: studentOccupancyRate, label: "rate" }}
						/>
					</View>
					<View style={{ width: "48%" }}>
						<StatsCard label="Total Rooms" value={data.rooms.total} icon="🏠" />
					</View>
					<View style={{ width: "48%" }}>
						<StatsCard
							label="Occupancy "
							value={`${occupancyRate}%`}
							icon="📊"
							gradient
						/>
					</View>
				</View>

				<View style={{ marginBottom: 24 }}>
					<SectionHeader title="Room Statistics" />
					<View style={{ flexDirection: "row", gap: 12 }}>
						<View style={{ flex: 1 }}>
							<StatsCard
								label="Occupied"
								value={data.rooms.occupied}
								icon="🔒"
								gradient
							/>
						</View>
						<View style={{ flex: 1 }}>
							<StatsCard
								label="Vacant"
								value={data.rooms.vacant}
								icon="🔐"
								gradient
							/>
						</View>
					</View>
				</View>

				{data.complaints.total > 0 ? (
					<ComplaintsSummary
						total={data.complaints.total}
						open={data.complaints.open}
						inProgress={data.complaints.inProgress}
						resolved={data.complaints.resolved}
					/>
				) : (
					<View style={{ marginBottom: 16 }}>
						<SectionHeader title="Complaints" />
						<LinearGradient
							colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								padding: 24,
								alignItems: "center",
							}}
						>
							<View
								style={{
									width: 50,
									height: 50,
									borderRadius: 25,
									backgroundColor: "rgba(255,204,0,0.1)",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 12,
								}}
							>
								<FontAwesome name="check-circle" size={24} color="#4ADE80" />
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
							<Text
								style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center" }}
							>
								All clear! No complaints have been filed yet.
							</Text>
						</LinearGradient>
					</View>
				)}

				{hasMenu ? (
					<TodayMenu
						day={data.todayMenu.day}
						breakfast={data.todayMenu.breakfast}
						lunch={data.todayMenu.lunch}
						dinner={data.todayMenu.dinner}
					/>
				) : (
					<View>
						<SectionHeader title="Today's Menu" />
						<MenuEmptyState />
					</View>
				)}

				<View style={{ marginTop: 8 }}>
					<SectionHeader
						title="Blocks Overview"
						subtitle={hasBlocks ? `${blocks.length} total blocks` : undefined}
						action={
							hasBlocks
								? {
										label: "Create Block",
										onPress: () => router.push("/create"),
										icon: "plus",
									}
								: undefined
						}
					/>

					{loadingBlocks ? (
						<ActivityIndicator color="#FFCC00" style={{ marginVertical: 20 }} />
					) : hasBlocks ? (
						<BlockList blocks={blocks} onRefresh={loadBlocks} />
					) : (
						<BlocksEmptyState />
					)}
				</View>

				{(!hasBlocks || !hasMenu) && (
					<Text
						style={{
							color: "#6B7280",
							fontSize: 12,
							textAlign: "center",
							marginTop: 24,
							fontStyle: "italic",
						}}
					>
						{!hasBlocks && !hasMenu
							? "Blocks and menu"
							: !hasBlocks
								? "Blocks"
								: "Menu"}{" "}
						will appear here once configured in the system.
					</Text>
				)}
			</ScrollView>
		</LinearGradient>
	);
}
