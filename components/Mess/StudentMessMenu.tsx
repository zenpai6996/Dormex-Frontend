import { fetchMessMenu } from "@/src/api/mess.api";
import { useAuth } from "@/src/context/AuthContext";
import { MessMenuItem } from "@/src/types/mess.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";

const DAYS_ORDER = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

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
		return (
			<LinearGradient
				colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
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
						colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
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
								borderRadius: 32,
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
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={{ marginBottom: 24 }}
							contentContainerStyle={{ gap: 8 }}
						>
							{DAYS_ORDER.map((day) => {
								const hasMenu = menuItems.some((item) => item.day === day);
								return (
									<Pressable
										key={day}
										onPress={() => setSelectedDay(day)}
										style={({ pressed }) => ({
											paddingHorizontal: 16,
											paddingVertical: 8,
											borderRadius: 20,
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
						</ScrollView>

						{selectedMenu ? (
							<LinearGradient
								colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
								style={{
									borderRadius: 24,
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.1)",
									overflow: "hidden",
								}}
							>
								{/* Header */}
								<LinearGradient
									colors={["rgba(255,204,0,0.18)", "rgba(255,204,0,0.06)"]}
									style={{
										padding: 18,
										borderBottomWidth: 1,
										borderBottomColor: "rgba(255,255,255,0.08)",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "center",
										gap: 8,
									}}
								>
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
								</LinearGradient>

								{/* Meal Table */}
								{[
									{
										label: "Breakfast",
										value: selectedMenu.breakfast,
										accent: "#FFCC00",
										isLast: false,
									},
									{
										label: "Lunch",
										value: selectedMenu.lunch,
										accent: "#FFB347",
										isLast: false,
									},
									{
										label: "Dinner",
										value: selectedMenu.dinner,
										accent: "#A78BFA",
										isLast: true,
									},
								].map((meal) => (
									<View
										key={meal.label}
										style={{
											flexDirection: "row",
											borderBottomWidth: meal.isLast ? 0 : 1,
											borderBottomColor: "rgba(255,255,255,0.07)",
											minHeight: 56,
										}}
									>
										{/* Left label column — fixed width */}
										<View
											style={{
												width: 100,
												backgroundColor: `${meal.accent}0D`,
												borderRightWidth: 1,
												borderRightColor: "rgba(255,255,255,0.07)",
												alignItems: "center",
												justifyContent: "center",
												gap: 4,
												paddingVertical: 14,
											}}
										>
											<Text
												style={{
													color: meal.accent,
													fontSize: 13,
													fontWeight: "900",
													letterSpacing: 1,
													textTransform: "uppercase",
												}}
											>
												{meal.label}
											</Text>
										</View>

										{/* Right items column — flex, wraps badges */}
										<View
											style={{
												flex: 1,
												flexDirection: "row",
												flexWrap: "wrap",
												alignContent: "center",
												gap: 6,
												padding: 12,
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
															paddingHorizontal: 10,
															paddingVertical: 4,
															borderRadius: 20,
															backgroundColor: "rgba(255,255,255,0.07)",
															borderWidth: 1,
															borderColor: "rgba(255,255,255,0.11)",
															maxWidth: "100%",
														}}
													>
														<Text
															numberOfLines={2}
															style={{
																color: "rgba(255,255,255,0.85)",
																fontSize: 12,
																fontWeight: "500",
																flexShrink: 1,
															}}
														>
															{item}
														</Text>
													</View>
												))}
										</View>
									</View>
								))}
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
