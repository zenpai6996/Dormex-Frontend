import { fetchMessMenu } from "@/src/api/mess.api";
import { useAuth } from "@/src/context/AuthContext";
import { MessMenuItem } from "@/src/types/mess.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	Dimensions,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";
import MessMenuSkeleton from "../skeletons/MessMenuSkeleton";

const { width: screenWidth } = Dimensions.get("window");

const DAYS_ORDER = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const dayButtonWidth = (screenWidth - 32) / DAYS_ORDER.length;
export default function StudentMessMenu() {
	const { token } = useAuth();
	const [menuItems, setMenuItems] = useState<MessMenuItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedDay, setSelectedDay] = useState<string>(DAYS_ORDER[0]);

	const loadMenu = async () => {
		if (!token) return;
		try {
			const data = await fetchMessMenu(token);
			const sortedData = data.sort(
				(a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day),
			);
			setMenuItems(sortedData);
		} catch (error) {
			console.error("Failed to load mess menu", error);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadMenu();
		setRefreshing(false);
	};

	useEffect(() => {
		loadMenu();
	}, [token]);

	const selectedMenu = menuItems.find((item) => item.day === selectedDay);

	if (loading) {
		return <MessMenuSkeleton />;
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
				<View style={{ marginBottom: 24 }}>
					<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
						Mess Menu
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4 }}>
						Weekly meal schedule
					</Text>
				</View>

				{menuItems.length === 0 ? (
					<LinearGradient
						colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
						style={{
							borderRadius: 16,
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.1)",
							padding: 32,
							alignItems: "center",
						}}
					>
						<View
							style={{
								width: 64,
								height: 64,
								borderRadius: 20,
								backgroundColor: "rgba(255,204,0,0.1)",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 16,
							}}
						>
							<FontAwesome name="cutlery" size={32} color="#FFCC00" />
						</View>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontWeight: "600",
								marginBottom: 8,
							}}
						>
							No Menu Available
						</Text>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								textAlign: "center",
							}}
						>
							The mess menu hasn't been set up yet. Please check back later.
						</Text>
					</LinearGradient>
				) : (
					<>
						<View style={{ marginBottom: 24 }}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									gap: 4,
								}}
							>
								{DAYS_ORDER.map((day) => {
									const hasMenu = menuItems.some((item) => item.day === day);
									return (
										<Pressable
											key={day}
											onPress={() => setSelectedDay(day)}
											style={({ pressed }) => ({
												width: dayButtonWidth - 4,
												paddingVertical: 10,
												borderRadius: 15,
												backgroundColor:
													selectedDay === day
														? "#FFCC00"
														: hasMenu
															? "rgba(255,255,255,0.1)"
															: "rgba(255,255,255,0.05)",
												borderWidth: 1,
												borderColor:
													selectedDay === day
														? "#FFCC00"
														: hasMenu
															? "rgba(255,204,0,0.3)"
															: "rgba(255,255,255,0.1)",
												opacity: hasMenu ? 1 : 0.5,
												transform: [{ scale: pressed ? 0.95 : 1 }],
												alignItems: "center",
											})}
										>
											<Text
												style={{
													color: selectedDay === day ? "#0A0F1E" : "white",
													fontWeight: "600",
													fontSize: 14,
												}}
											>
												{day.slice(0, 3)}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>

						{selectedMenu ? (
							<LinearGradient
								colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
								style={{
									borderRadius: 14,
									borderWidth: 1,
									borderColor: "#ffcc0045",
									overflow: "hidden",
								}}
							>
								{/* Header */}
								<LinearGradient
									colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
									style={{
										padding: 18,
										borderBottomWidth: 1,
										borderBottomColor: "#ffcc0045",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										paddingHorizontal: 20,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 8,
										}}
									>
										<FontAwesome name="calendar" size={16} color="#FFCC00" />
										<Text
											style={{
												color: "#FFCC00",
												fontSize: 18,
												fontWeight: "800",
												letterSpacing: 1.5,
												textTransform: "uppercase",
											}}
										>
											{selectedMenu.day}
										</Text>
									</View>
									{/* <View
										style={{
											backgroundColor: "rgba(255,204,0,0.1)",
											paddingHorizontal: 10,
											paddingVertical: 4,
											borderRadius: 12,
										}}
									>
										<Text
											style={{
												color: "#FFCC00",
												fontSize: 11,
												fontWeight: "600",
											}}
										>
											Today's Special
										</Text>
									</View> */}
								</LinearGradient>

								{/* Meal Table */}
								{[
									{
										label: "Breakfast",
										value: selectedMenu.breakfast,
										accent: "#FFCC00",
										icon: "coffee",
										time: "6:00 AM - 10:00 AM",
									},
									{
										label: "Lunch",
										value: selectedMenu.lunch,
										accent: "#FFCC00",
										icon: "sun-o",
										time: "1:00 PM - 3:00 PM",
									},
									{
										label: "Dinner",
										value: selectedMenu.dinner,
										accent: "#FFCC00",
										icon: "moon-o",
										time: "8:00 PM - 10:00 PM",
									},
								].map((meal, index) => (
									<View
										key={meal.label}
										style={{
											borderBottomWidth: index === 2 ? 0 : 1,
											borderBottomColor: "#ffcc0045",
										}}
									>
										{/* Left label column — fixed width */}
										<View
											style={{
												width: "100%",
												backgroundColor: "rgba(255,255,255,0.01)",
												padding: 16,
											}}
										>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													gap: 10,
													marginBottom: 12,
												}}
											>
												<View
													style={{
														width: 36,
														height: 36,
														borderRadius: 20,
														backgroundColor: `${meal.accent}15`,
														alignItems: "center",
														justifyContent: "center",
														borderWidth: 1,
														borderColor: `${meal.accent}30`,
													}}
												>
													<FontAwesome
														name={meal.icon as any}
														size={16}
														color={meal.accent}
													/>
												</View>
												<View>
													<Text
														style={{
															color: meal.accent,
															fontSize: 13,
															fontWeight: "800",
															letterSpacing: 1,
															textTransform: "uppercase",
														}}
													>
														{meal.label}
													</Text>
													<View
														style={{
															flexDirection: "row",
															alignItems: "center",
															gap: 4,
															marginTop: 2,
														}}
													>
														<FontAwesome
															name="clock-o"
															size={10}
															color="#6B7280"
														/>
														<Text style={{ color: "#6B7280", fontSize: 10 }}>
															{meal.time}
														</Text>
													</View>
												</View>
											</View>
											<View
												style={{
													marginTop: 2,
													paddingTop: 12,
													borderTopWidth: 1,
													borderTopColor: "rgba(240, 193, 22, 0.34)",
													flexDirection: "row",
													alignItems: "center",
													gap: 8,
												}}
											></View>

											{/* Menu Items with better spacing */}
											<View
												style={{
													flexDirection: "row",
													flexWrap: "wrap",
													gap: 8,
												}}
											>
												{meal.value
													.split(",")
													.map((item) => item.trim())
													.filter(Boolean)
													.map((item, i) => (
														<View
															key={i}
															style={{
																paddingHorizontal: 12,
																paddingVertical: 6,
																borderRadius: 20,
																backgroundColor: "rgba(255,255,255,0.05)",
																borderWidth: 1,
																borderColor: "rgba(255,255,255,0.1)",
																flexDirection: "row",
																alignItems: "center",
																gap: 6,
															}}
														>
															<FontAwesome
																name="circle"
																size={4}
																color={meal.accent}
															/>
															<Text
																style={{
																	color: "rgba(255,255,255,0.9)",
																	fontSize: 11,
																	fontWeight: "500",
																}}
															>
																{item}
															</Text>
														</View>
													))}
											</View>
										</View>
									</View>
								))}

								{/* Footer with additional info */}
								<LinearGradient
									colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
									style={{
										padding: 14,
										borderTopWidth: 1,
										borderTopColor: "rgba(240, 193, 22, 0.34)",
										flexDirection: "row",
										justifyContent: "space-around",
									}}
								>
									<View style={{ alignItems: "center" }}>
										<FontAwesome name="leaf" size={14} color="#4ADE80" />
										<Text
											style={{ color: "#9CA3AF", fontSize: 10, marginTop: 2 }}
										>
											Fresh
										</Text>
									</View>
									<View style={{ alignItems: "center" }}>
										<FontAwesome name="heart" size={14} color="#FF6B6B" />
										<Text
											style={{ color: "#9CA3AF", fontSize: 10, marginTop: 2 }}
										>
											Healthy
										</Text>
									</View>
									<View style={{ alignItems: "center" }}>
										<FontAwesome name="star" size={14} color="#FFCC00" />
										<Text
											style={{ color: "#9CA3AF", fontSize: 10, marginTop: 2 }}
										>
											Tasty
										</Text>
									</View>
									<View style={{ alignItems: "center" }}>
										<FontAwesome name="clock-o" size={14} color="#FFB347" />
										<Text
											style={{ color: "#9CA3AF", fontSize: 10, marginTop: 2 }}
										>
											On Time
										</Text>
									</View>
								</LinearGradient>
							</LinearGradient>
						) : (
							<LinearGradient
								colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
								style={{
									borderRadius: 16,
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.1)",
									padding: 24,
									alignItems: "center",
									minHeight: 300, // Add minimum height for empty state
									justifyContent: "center",
								}}
							>
								<View
									style={{
										width: 48,
										height: 48,
										borderRadius: 24,
										backgroundColor: "rgba(255,204,0,0.1)",
										alignItems: "center",
										justifyContent: "center",
										marginBottom: 12,
									}}
								>
									<FontAwesome name="info-circle" size={24} color="#FFCC00" />
								</View>
								<Text
									style={{
										color: "white",
										fontSize: 16,
										fontWeight: "600",
										marginBottom: 4,
									}}
								>
									No Menu for {selectedDay}
								</Text>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 14,
										textAlign: "center",
									}}
								>
									Menu for this day hasn't been set yet.
								</Text>
							</LinearGradient>
						)}
					</>
				)}
			</ScrollView>
		</LinearGradient>
	);
}
