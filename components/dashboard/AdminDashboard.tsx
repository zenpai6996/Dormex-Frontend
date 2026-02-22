import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import BlocksEmptyState from "./cards/BlockEmptyState";
import BlockStatsCard from "./cards/BlockStatsCard";
import MenuEmptyState from "./cards/MenuEmptyState";
import StatsCard from "./cards/StatsCard";
import TodayMenu from "./cards/TodayMenu";
import ComplaintsSummary from "./ComplaintSummary";
import EmptyState from "./EmptyState";
import SectionHeader from "./SectionHeader";

export default function AdminDashboard({ data }) {
	const auth = useAuth();
	const router = useRouter();
	const handleLogout = async () => {
		await auth?.logout();
		router.replace("/(auth)");
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
	const hasBlocks = data.blocks?.blockStats?.length > 0;
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
					paddingBottom: 32,
					marginTop: 30,
				}}
				showsVerticalScrollIndicator={false}
			>
				{/* Welcome Header with Actions */}
				<View style={{ marginBottom: 24 }}>
					{/* Header Row with Title and Action Buttons */}
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

						{/* Action Buttons Container */}
						<View style={{ flexDirection: "row", gap: 12 }}>
							{/* Profile Icon Button */}
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

							{/* Logout/Power Button */}
							<Pressable
								onPress={handleLogout}
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
										size={22}
										color={pressed ? "#ffcc00" : "#ffcc00"}
										style={{ opacity: pressed ? 0.8 : 1 }}
									/>
								)}
							</Pressable>
						</View>
					</View>

					{/* Student Statistics Header */}
				</View>

				{/* Key Stats Grid */}
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

				{/* Rooms Stats */}
				<View style={{ marginBottom: 24 }}>
					<SectionHeader
						title="Room Statistics"
						subtitle={`${data.rooms.occupied} occupied · ${data.rooms.vacant} vacant`}
					/>
					<View style={{ flexDirection: "row", gap: 12 }}>
						<View style={{ flex: 1 }}>
							<StatsCard
								label="Occupied"
								value={data.rooms.occupied}
								icon="🔒"
							/>
						</View>
						<View style={{ flex: 1 }}>
							<StatsCard
								label="Vacant"
								value={data.rooms.vacant}
								icon="🔓"
								gradient
							/>
						</View>
					</View>
				</View>

				{/* Complaints Summary */}
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

				{/* Today's Menu - with empty state */}
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

				{/* Blocks Section - with empty state */}
				<View style={{ marginTop: 8 }}>
					<SectionHeader
						title="Blocks Overview"
						subtitle={
							hasBlocks ? `${data.blocks.total} total blocks` : undefined
						}
					/>

					{hasBlocks ? (
						data.blocks.blockStats.map((block) => (
							<BlockStatsCard
								key={block.blockId}
								blockName={block.blockName}
								totalStudents={block.totalStudents}
								totalRooms={block.totalRooms}
								occupiedRooms={block.occupiedRooms}
								vacantRooms={block.vacantRooms}
								totalCapacity={block.totalCapacity}
								occupiedSeats={block.occupiedSeats}
								availableSeats={block.availableSeats}
								inviteCodeExpiresAt={block.inviteCodeExpiresAt}
							/>
						))
					) : (
						<BlocksEmptyState />
					)}
				</View>

				{/* Footer note for empty states */}
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
