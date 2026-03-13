import { fetchBlocks } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";
import BlockList from "./blocks/blockList";
import BlocksEmptyState from "./cards/BlockEmptyState";
import MenuEmptyState from "./cards/MenuEmptyState";
import StatsCard from "./cards/StatsCard";
import TodayMenu from "./cards/TodayMenu";
import ComplaintsSummary from "./ComplaintSummary";
import EmptyState from "./EmptyState";
import SectionHeader from "./SectionHeader";

interface AdminDashboardProps {
	data: any;
	onRefresh?: () => Promise<void>; // Add this prop
}

export default function AdminDashboard({
	data,
	onRefresh,
}: AdminDashboardProps) {
	const auth = useAuth();
	const router = useRouter();
	const [blocks, setBlocks] = useState([]);
	const [loadingBlocks, setLoadingBlocks] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [dashboardData, setDashboardData] = useState(data);

	// Update local state when prop changes
	useEffect(() => {
		setDashboardData(data);
	}, [data]);

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

	const onRefreshHandler = async () => {
		setRefreshing(true);
		await Promise.all([
			loadBlocks(),
			onRefresh ? onRefresh() : Promise.resolve(),
		]);
		setRefreshing(false);
	};

	// Refresh data when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			if (onRefresh) {
				onRefresh();
			}
		}, [onRefresh]),
	);

	useEffect(() => {
		loadBlocks();
	}, [auth.token]);

	// const handleLogoutPress = () => {
	// 	Alert.alert({
	// 		title: "Logout",
	// 		description: "Are you sure you want to logout?",
	// 		buttons: [
	// 			{
	// 				text: "Cancel",
	// 				textStyle: {
	// 					color: "#00ff1a",
	// 				},
	// 				onPress: () => {},
	// 			},
	// 			{
	// 				text: "Yes",
	// 				textStyle: {
	// 					color: "#EF4444",
	// 				},
	// 				onPress: handleLogout,
	// 			},
	// 		],
	// 		showCancelButton: true,
	// 	});
	// };

	// const handleLogout = async () => {
	// 	try {
	// 		await auth?.logout();
	// 		ToastService.showError({
	// 			contentContainerStyle: {
	// 				borderStartColor: "#FFCC00",
	// 				borderStartWidth: 5,
	// 				borderEndColor: "#FFCC00",
	// 				borderEndWidth: 5,
	// 				backgroundColor: "#0A0F1E",
	// 			},
	// 			message: "Logged Out Successfully",
	// 			duration: 3000,
	// 			position: "bottom",
	// 		});
	// 		router.replace("/(auth)");
	// 	} catch (error) {
	// 		Alert.alert({
	// 			title: "Error",
	// 			description: "Failed to logout. Please try again.",
	// 			showCancelButton: false,
	// 		});
	// 	}
	// };

	if (dashboardData?.students?.total === 0) {
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
		(dashboardData?.rooms?.occupied / dashboardData?.rooms?.total) * 100,
	);
	const studentOccupancyRate = Math.round(
		(dashboardData?.students?.active / dashboardData?.students?.total) * 100,
	);
	const hasBlocks = blocks.length > 0;
	const hasMenu = dashboardData?.todayMenu !== null;

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
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
						onRefresh={onRefreshHandler}
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

							{/* <Pressable
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
							</Pressable> */}
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
							value={dashboardData?.students?.total}
							icon="👥"
							gradient
						/>
					</View>
					<View style={{ width: "48%" }}>
						<StatsCard
							label="Active "
							value={dashboardData?.students?.active}
							icon="✅"
							trend={{ value: studentOccupancyRate, label: "rate" }}
							gradient
						/>
					</View>
				</View>

				{hasMenu ? (
					<>
						<TodayMenu
							day={dashboardData?.todayMenu?.day}
							breakfast={dashboardData?.todayMenu?.breakfast}
							lunch={dashboardData?.todayMenu?.lunch}
							dinner={dashboardData?.todayMenu?.dinner}
						/>
					</>
				) : (
					<View>
						<Pressable onPress={() => router.push("/(tabs)/two")}>
							<SectionHeader title="Mess Menu" />
							<MenuEmptyState />
						</Pressable>
					</View>
				)}

				{dashboardData?.complaints?.total > 0 ? (
					<Pressable onPress={() => router.push("/(tabs)/three")}>
						<SectionHeader title="Complaints" />
						<ComplaintsSummary
							total={dashboardData?.complaints?.total}
							open={dashboardData?.complaints?.open}
							inProgress={dashboardData?.complaints?.inProgress}
							resolved={dashboardData?.complaints?.resolved}
						/>
					</Pressable>
				) : (
					<View style={{ marginBottom: 16 }}>
						<SectionHeader title="Complaints" />
						<LinearGradient
							colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
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
