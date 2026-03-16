import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";
import ComplaintsCard from "../student/ComplaintsCard";
import JoinBlockCard from "../student/JoinBlockCard";
import MenuCard from "../student/MenuCard";
import RoommateCard from "../student/RoommateCard";
import StudentHeader from "../student/StudentHeader";
import WaitingForRoomCard from "../student/WaitingForRoomCard";

interface StudentDashboardProps {
	data: any;
	onRefresh: () => void;
}

export default function StudentDashboard({
	data,
	onRefresh,
}: StudentDashboardProps) {
	const auth = useAuth();
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleRefresh = async () => {
		setRefreshing(true);
		await onRefresh();
		setRefreshKey((prev) => prev + 1);
		setRefreshing(false);
	};

	const handleJoinSuccess = () => {
		onRefresh();
	};

	const handleCreateComplaint = () => {
		router.push("/create-complaint");
	};
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

	if (!data) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</LinearGradient>
		);
	}

	const { student, todayMenu } = data;
	const hasBlock = !!student.block;
	const hasRoom = !!student.room;

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
						onRefresh={handleRefresh}
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
								Student Dashboard
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
				<StudentHeader
					name={student.name}
					email={student.email}
					status={student.status}
					blockName={student.block?.name}
					roomNumber={student.room?.roomNumber}
				/>

				{!hasBlock ? (
					<JoinBlockCard onSuccess={handleJoinSuccess} />
				) : !hasRoom ? (
					<WaitingForRoomCard blockName={student.block.name} />
				) : (
					<>
						<RoommateCard
							roomNumber={student.room.roomNumber}
							roommates={student.room.occupants || []}
							currentUserId={student.id}
						/>

						{todayMenu ? (
							<Pressable onPress={() => router.push("/(tabs)/two")}>
								<MenuCard
									day={todayMenu.day}
									breakfast={todayMenu.breakfast}
									lunch={todayMenu.lunch}
									dinner={todayMenu.dinner}
								/>
							</Pressable>
						) : (
							<Pressable onPress={() => router.push("/(tabs)/two")}>
								<MenuCard
									day={new Date().toLocaleDateString("en-US", {
										weekday: "long",
									})}
									breakfast=""
									lunch=""
									dinner=""
								/>
							</Pressable>
						)}

						<Pressable onPress={() => router.push("/(tabs)/three")}>
							<ComplaintsCard
								onCreatePress={handleCreateComplaint}
								refreshKey={refreshKey}
							/>
						</Pressable>
					</>
				)}
			</ScrollView>
		</LinearGradient>
	);
}
