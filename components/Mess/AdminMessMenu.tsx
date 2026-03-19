import {
	createMessMenu,
	fetchMessMenu,
	updateMessMenu,
} from "@/src/api/mess.api";
import { useAuth } from "@/src/context/AuthContext";
import {
	DayOfWeek,
	MessMenuFormData,
	MessMenuItem,
} from "@/src/types/mess.types";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import MessMenuSkeleton from "../skeletons/MessMenuSkeleton";

const DAYS_OF_WEEK: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

interface EditMenuModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (data: MessMenuFormData) => Promise<void>;
	initialData?: MessMenuItem;
	selectedDay?: string;
}

function EditMenuModal({
	visible,
	onClose,
	onSave,
	initialData,
	selectedDay,
}: EditMenuModalProps) {
	const [formData, setFormData] = useState<MessMenuFormData>({
		day: initialData?.day || selectedDay || DAYS_OF_WEEK[0],
		breakfast: initialData?.breakfast || "",
		lunch: initialData?.lunch || "",
		dinner: initialData?.dinner || "",
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (visible) {
			setFormData({
				day: initialData?.day || selectedDay || DAYS_OF_WEEK[0],
				breakfast: initialData?.breakfast || "",
				lunch: initialData?.lunch || "",
				dinner: initialData?.dinner || "",
			});
		}
	}, [visible, initialData, selectedDay]);

	const handleSave = async () => {
		if (!formData.breakfast || !formData.lunch || !formData.dinner) {
			ToastService.showError({
				message: "Please fill in all meals",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setSaving(true);
		try {
			await onSave(formData);
			onClose();
		} catch (error) {
			console.error("Failed to save menu", error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.5)",
						justifyContent: "flex-end",
					}}
					onPress={onClose}
				>
					<Pressable onPress={(e) => e.stopPropagation()}>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderTopLeftRadius: 24,
								borderTopRightRadius: 24,
								padding: 20,
								minHeight: 500,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 20,
								}}
							>
								<Text
									style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
								>
									{initialData ? "Edit Menu" : "Create Menu"}
								</Text>
								<Pressable onPress={onClose} style={{ padding: 4 }}>
									<FontAwesome name="close" size={24} color="#9CA3AF" />
								</Pressable>
							</View>

							<ScrollView showsVerticalScrollIndicator={false}>
								{!initialData && (
									<View style={{ marginBottom: 16 }}>
										<Text style={{ color: "#9CA3AF", marginBottom: 8 }}>
											Day
										</Text>
										<ScrollView
											horizontal
											showsHorizontalScrollIndicator={false}
											contentContainerStyle={{ gap: 8 }}
										>
											{DAYS_OF_WEEK.map((day) => (
												<Pressable
													key={day}
													onPress={() => setFormData({ ...formData, day })}
													style={{
														paddingHorizontal: 16,
														paddingVertical: 8,
														borderRadius: 20,
														backgroundColor:
															formData.day === day
																? "#FFCC00"
																: "rgba(255,255,255,0.1)",
														borderWidth: 1,
														borderColor:
															formData.day === day
																? "#FFCC00"
																: "rgba(255,255,255,0.1)",
													}}
												>
													<Text
														style={{
															color: formData.day === day ? "#0A0F1E" : "white",
															fontWeight: "600",
														}}
													>
														{day.slice(0, 3)}
													</Text>
												</Pressable>
											))}
										</ScrollView>
									</View>
								)}

								<View style={{ marginBottom: 16 }}>
									<Text style={{ color: "#9CA3AF", marginBottom: 8 }}>
										Breakfast
									</Text>
									<TextInput
										style={{
											backgroundColor: "rgba(255,255,255,0.05)",
											borderRadius: 12,
											padding: 16,
											color: "white",
											fontSize: 16,
											borderWidth: 1,
											borderColor: "rgba(255,255,255,0.1)",
										}}
										placeholder="e.g., Poha, Bread, Tea"
										placeholderTextColor="#4B5563"
										value={formData.breakfast}
										onChangeText={(text) =>
											setFormData({ ...formData, breakfast: text })
										}
										multiline
									/>
								</View>

								<View style={{ marginBottom: 16 }}>
									<Text style={{ color: "#9CA3AF", marginBottom: 8 }}>
										Lunch
									</Text>
									<TextInput
										style={{
											backgroundColor: "rgba(255,255,255,0.05)",
											borderRadius: 12,
											padding: 16,
											color: "white",
											fontSize: 16,
											borderWidth: 1,
											borderColor: "rgba(255,255,255,0.1)",
										}}
										placeholder="e.g., Rice, Dal, Roti, Sabzi"
										placeholderTextColor="#4B5563"
										value={formData.lunch}
										onChangeText={(text) =>
											setFormData({ ...formData, lunch: text })
										}
										multiline
									/>
								</View>

								<View style={{ marginBottom: 24 }}>
									<Text style={{ color: "#9CA3AF", marginBottom: 8 }}>
										Dinner
									</Text>
									<TextInput
										style={{
											backgroundColor: "rgba(255,255,255,0.05)",
											borderRadius: 12,
											padding: 16,
											color: "white",
											fontSize: 16,
											borderWidth: 1,
											borderColor: "rgba(255,255,255,0.1)",
										}}
										placeholder="e.g., Roti, Sabzi, Rice, Dal"
										placeholderTextColor="#4B5563"
										value={formData.dinner}
										onChangeText={(text) =>
											setFormData({ ...formData, dinner: text })
										}
										multiline
									/>
								</View>

								<Pressable
									onPress={handleSave}
									disabled={saving}
									style={({ pressed }) => ({
										backgroundColor: "#FFCC00",
										padding: 16,
										borderRadius: 12,
										alignItems: "center",
										opacity: pressed || saving ? 0.8 : 1,
										transform: [{ scale: pressed ? 0.98 : 1 }],
										marginBottom: 20,
									})}
								>
									<Text
										style={{
											color: "#0A0F1E",
											fontSize: 16,
											fontWeight: "bold",
										}}
									>
										{saving
											? "Saving..."
											: initialData
												? "Update Menu"
												: "Create Menu"}
									</Text>
								</Pressable>
							</ScrollView>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</KeyboardAvoidingView>
		</Modal>
	);
}

export default function AdminMessMenu() {
	const { token } = useAuth();
	const [menuItems, setMenuItems] = useState<MessMenuItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingItem, setEditingItem] = useState<MessMenuItem | undefined>();
	const [selectedDayForNew, setSelectedDayForNew] = useState<string>("");

	const loadMenu = async () => {
		if (!token) return;
		try {
			const data = await fetchMessMenu(token);
			const sortedData = data.sort(
				(a, b) =>
					DAYS_OF_WEEK.indexOf(a.day as DayOfWeek) -
					DAYS_OF_WEEK.indexOf(b.day as DayOfWeek),
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

	const handleCreateMenu = async (data: MessMenuFormData) => {
		if (!token) return;
		try {
			await createMessMenu(token, data);
			await loadMenu();
			ToastService.show({
				message: "Menu created successfully",
				duration: 3000,
				position: "bottom",
			});
		} catch (error) {
			ToastService.showError({
				message: "Failed to create menu",
				duration: 3000,
				position: "bottom",
			});
		}
	};

	const handleUpdateMenu = async (data: MessMenuFormData) => {
		if (!token || !editingItem) return;
		try {
			await updateMessMenu(token, editingItem._id, data);
			await loadMenu();
			ToastService.show({
				message: "Menu updated successfully",
				duration: 3000,
				position: "bottom",
			});
		} catch (error) {
			ToastService.showError({
				message: "Failed to update menu",
				duration: 3000,
				position: "bottom",
			});
		}
	};

	useEffect(() => {
		loadMenu();
	}, [token]);

	if (loading) {
		return <MessMenuSkeleton />;
	}

	const hasAllDays = DAYS_OF_WEEK.every((day) =>
		menuItems.some((item) => item.day === day),
	);

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
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 24,
					}}
				>
					<View>
						<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
							Mess Menu
						</Text>
						<Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4 }}>
							Manage weekly meal schedule
						</Text>
					</View>

					{!hasAllDays && (
						<Pressable
							onPress={() => {
								setEditingItem(undefined);
								setSelectedDayForNew(
									DAYS_OF_WEEK.find(
										(day) => !menuItems.some((item) => item.day === day),
									) || DAYS_OF_WEEK[0],
								);
								setModalVisible(true);
							}}
							style={({ pressed }) => ({
								backgroundColor: "#FFCC00",
								width: 44,
								height: 44,
								borderRadius: 22,
								alignItems: "center",
								justifyContent: "center",
								transform: [{ scale: pressed ? 0.95 : 1 }],
							})}
						>
							<FontAwesome name="plus" size={24} color="#0A0F1E" />
						</Pressable>
					)}
				</View>

				{menuItems.length === 0 ? (
					<LinearGradient
						colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)"]}
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
							No Menu Items
						</Text>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								textAlign: "center",
								marginBottom: 16,
							}}
						>
							Get started by creating your first mess menu item.
						</Text>
						<Pressable
							onPress={() => {
								setEditingItem(undefined);
								setSelectedDayForNew(DAYS_OF_WEEK[0]);
								setModalVisible(true);
							}}
							style={({ pressed }) => ({
								backgroundColor: "#FFCC00",
								paddingHorizontal: 24,
								paddingVertical: 12,
								borderRadius: 12,
								opacity: pressed ? 0.8 : 1,
								transform: [{ scale: pressed ? 0.98 : 1 }],
							})}
						>
							<Text style={{ color: "#0A0F1E", fontWeight: "bold" }}>
								Create Menu
							</Text>
						</Pressable>
					</LinearGradient>
				) : (
					DAYS_OF_WEEK.map((day) => {
						const menuItem = menuItems.find((item) => item.day === day);

						return (
							<LinearGradient
								key={day}
								colors={[
									menuItem
										? "rgba(255,255,255,0.08)"
										: "rgba(255,255,255,0.08)",
									"rgba(255,255,255,0.08)",
								]}
								style={{
									borderRadius: 16,
									borderWidth: 1,
									borderColor: menuItem
										? "rgba(255,255,255,0.1)"
										: "rgba(255,255,255,0.1)",
									marginBottom: 12,
									overflow: "hidden",
								}}
							>
								<Pressable
									onPress={() => {
										if (menuItem) {
											setEditingItem(menuItem);
											setModalVisible(true);
										} else {
											setEditingItem(undefined);
											setSelectedDayForNew(day);
											setModalVisible(true);
										}
									}}
								>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											padding: 16,
										}}
									>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													color: menuItem ? "#FFCC00" : "#9CA3AF",
													fontSize: 18,
													fontWeight: "bold",
													marginBottom: 10,
												}}
											>
												{day}
											</Text>

											<View
												style={{
													height: 1,
													backgroundColor: "rgba(255,255,255,0.1)",
													marginBottom: 10,
												}}
											/>

											{menuItem ? (
												<>
													<Text style={{ color: "#9CA3AF", fontSize: 14 }}>
														Breakfast :
													</Text>
													<Text
														style={{
															color: "white",
															fontSize: 12,
															marginBottom: 10,
														}}
														numberOfLines={1}
													>
														{menuItem.breakfast}
													</Text>
													<View
														style={{
															height: 1,
															backgroundColor: "rgba(255,255,255,0.1)",
															marginBottom: 10,
														}}
													/>
													<Text style={{ color: "#9CA3AF", fontSize: 14 }}>
														Lunch :
													</Text>
													<Text
														style={{
															color: "white",
															fontSize: 12,
															marginBottom: 10,
														}}
														numberOfLines={1}
													>
														{menuItem.lunch}
													</Text>
													<View
														style={{
															height: 1,
															backgroundColor: "rgba(255,255,255,0.1)",
															marginBottom: 10,
														}}
													/>
													<Text style={{ color: "#9CA3AF", fontSize: 14 }}>
														Dinner :
													</Text>
													<Text
														style={{ color: "white", fontSize: 12 }}
														numberOfLines={1}
													>
														{menuItem.dinner}
													</Text>
												</>
											) : (
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
													}}
												>
													<FontAwesome
														name="plus-circle"
														size={16}
														color="#4B5563"
														style={{ marginRight: 8 }}
													/>
													<Text style={{ color: "#4B5563", fontSize: 14 }}>
														Add menu for {day}
													</Text>
												</View>
											)}
										</View>

										<FontAwesome
											name="chevron-right"
											size={30}
											style={{ marginBottom: 10 }}
											color={menuItem ? "#FFCC00" : "#4B5563"}
										/>
									</View>
								</Pressable>
							</LinearGradient>
						);
					})
				)}

				<EditMenuModal
					visible={modalVisible}
					onClose={() => {
						setModalVisible(false);
						setEditingItem(undefined);
					}}
					onSave={editingItem ? handleUpdateMenu : handleCreateMenu}
					initialData={editingItem}
					selectedDay={selectedDayForNew}
				/>
			</ScrollView>
		</LinearGradient>
	);
}
