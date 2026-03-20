import {
	deleteStudentByAdmin,
	getAllStudents,
} from "@/src/api/admin-student.api";
import { fetchBlocks } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";

interface Block {
	_id: string;
	name: string;
}

interface Student {
	_id: string;
	name: string;
	email?: string;
	rollNo?: string;
	phoneNumber?: string;
	branch?: string;
	dateOfBirth?: string;
	block?: { _id: string; name: string } | null;
	room?: { _id: string; roomNumber: string } | null;
}

const branches = ["", "IT", "CS", "ECE", "EE", "ME", "CE", "OTHER"];

const StudentsScreen = () => {
	const { token } = useAuth();
	const router = useRouter();
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [loadingStudents, setLoadingStudents] = useState(true);
	const [loadingBlocks, setLoadingBlocks] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedBlock, setSelectedBlock] = useState("");
	const [selectedBranch, setSelectedBranch] = useState("");
	const [unassignedOnly, setUnassignedOnly] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [studentModalVisible, setStudentModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [deletePassword, setDeletePassword] = useState("");
	const [deleteLoading, setDeleteLoading] = useState(false);

	const normalizedSearch = search.trim();

	const loadBlocks = useCallback(async () => {
		if (!token) return;
		setLoadingBlocks(true);
		try {
			const data = await fetchBlocks(token);
			setBlocks(data);
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to load blocks",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setLoadingBlocks(false);
		}
	}, [token]);

	const loadStudents = useCallback(
		async (showLoader = true) => {
			if (!token) return;
			if (showLoader) {
				setLoadingStudents(true);
			}
			try {
				const result = await getAllStudents(token, {
					block: selectedBlock || undefined,
					branch: selectedBranch || undefined,
					search: normalizedSearch || undefined,
				});
				const list = Array.isArray(result) ? result : result?.students || [];
				setStudents(list);
			} catch (error: any) {
				ToastService.showError({
					message: error.message || "Failed to load students",
					duration: 3000,
					position: "bottom",
				});
			} finally {
				if (showLoader) {
					setLoadingStudents(false);
				}
			}
		},
		[token, selectedBlock, selectedBranch, normalizedSearch],
	);

	useEffect(() => {
		if (!token) return;
		const handle = setTimeout(() => {
			loadStudents(true);
		}, 300);
		return () => clearTimeout(handle);
	}, [token, selectedBlock, selectedBranch, normalizedSearch, loadStudents]);

	useFocusEffect(
		useCallback(() => {
			loadBlocks();
			loadStudents(true);
		}, [loadBlocks, loadStudents]),
	);

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([loadBlocks(), loadStudents(false)]);
		setRefreshing(false);
	};

	const filteredStudents = useMemo(() => {
		if (!unassignedOnly) return students;
		return students.filter((student) => !student.room);
	}, [students, unassignedOnly]);

	const formatDate = (value?: string) => {
		if (!value) return "Not set";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString();
	};

	const handleStudentPress = (student: Student) => {
		setSelectedStudent(student);
		setStudentModalVisible(true);
	};

	const canDeleteSelected =
		selectedStudent && !selectedStudent.block && !selectedStudent.room;

	const handleConfirmDelete = async () => {
		if (!token || !selectedStudent) return;
		if (!deletePassword.trim()) {
			ToastService.showError({
				message: "Please enter your password",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setDeleteLoading(true);
		try {
			await deleteStudentByAdmin(
				token,
				selectedStudent._id,
				deletePassword.trim(),
			);
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Student deleted successfully",
				duration: 3000,
				position: "bottom",
			});
			setStudents((prev) =>
				prev.filter((student) => student._id !== selectedStudent._id),
			);
			setDeleteModalVisible(false);
			setStudentModalVisible(false);
			setDeletePassword("");
			setSelectedStudent(null);
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to delete student",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setDeleteLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					padding: 16,
					paddingBottom: 120,
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
				<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
					<Pressable
						onPress={() => router.back()}
						style={({ pressed }) => ({
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: "rgba(255,255,255,0.08)",
							alignItems: "center",
							justifyContent: "center",
							opacity: pressed ? 0.7 : 1,
						})}
					>
						<FontAwesome name="arrow-left" size={16} color="#FFCC00" />
					</Pressable>
					<View>
						<Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
							Student Management
						</Text>
					</View>
				</View>

				<View style={{ marginTop: 16 }}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "rgba(255,255,255,0.06)",
							borderRadius: 12,
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.1)",
							paddingHorizontal: 10,
							paddingVertical: 6,
						}}
					>
						<FontAwesome name="search" size={14} color="#6B7280" />
						<TextInput
							value={search}
							onChangeText={setSearch}
							placeholder="Search students"
							placeholderTextColor="#4B5563"
							style={{
								flex: 1,
								color: "white",
								paddingHorizontal: 8,
								paddingVertical: 6,
								fontSize: 13,
							}}
						/>

						{/* Unassigned toggle */}
						<Pressable
							onPress={() => setUnassignedOnly((prev) => !prev)}
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 6,
								backgroundColor: unassignedOnly
									? "rgba(255,204,0,0.12)"
									: "rgba(255,255,255,0.06)",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: unassignedOnly
									? "rgba(255,204,0,0.35)"
									: "rgba(255,255,255,0.1)",
								paddingHorizontal: 10,
								paddingVertical: 10,
							}}
						>
							<Text
								style={{
									color: unassignedOnly ? "#FFCC00" : "#6B7280",
									fontSize: 11,
									fontWeight: "600",
								}}
							>
								Unassigned
							</Text>
						</Pressable>
						{search.length > 0 && (
							<Pressable
								onPress={() => setSearch("")}
								style={({ pressed }) => ({
									padding: 5,
									marginLeft: 5,
									opacity: pressed ? 0.7 : 1,
								})}
							>
								<FontAwesome name="times" size={20} color="#FFCC00" />
							</Pressable>
						)}
					</View>

					{/* Filter bar */}
					<View
						style={{
							marginTop: 10,
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
						}}
					>
						{/* Block picker */}
						<View
							style={{
								flex: 1,
								backgroundColor: "rgba(255,255,255,0.06)",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								overflow: "hidden",
							}}
						>
							{loadingBlocks ? (
								<View style={{ paddingVertical: 12, alignItems: "center" }}>
									<ActivityIndicator color="#FFCC00" size="small" />
								</View>
							) : (
								<Picker
									selectedValue={selectedBlock}
									onValueChange={setSelectedBlock}
									style={{ color: "#fff", height: 54 }}
									dropdownIconColor="#FFCC00"
								>
									<Picker.Item label="All Blocks" value="" color="#000" />
									{blocks.map((block) => (
										<Picker.Item
											key={block._id}
											label={block.name}
											value={block._id}
											color="#000"
										/>
									))}
								</Picker>
							)}
						</View>

						{/* Branch picker */}
						<View
							style={{
								flex: 1,
								backgroundColor: "rgba(255,255,255,0.06)",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								overflow: "hidden",
							}}
						>
							<Picker
								selectedValue={selectedBranch}
								onValueChange={setSelectedBranch}
								style={{ color: "#fff", height: 54 }}
								dropdownIconColor="#FFCC00"
							>
								{branches.map((branch) => (
									<Picker.Item
										key={branch || "all"}
										label={branch ? branch : "All Branches"}
										value={branch}
										color="#000"
									/>
								))}
							</Picker>
						</View>
					</View>
				</View>

				<View style={{ marginTop: 16 }}>
					{loadingStudents ? (
						<ActivityIndicator color="#FFCC00" style={{ marginTop: 20 }} />
					) : filteredStudents.length === 0 ? (
						<LinearGradient
							colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)"]}
							style={{
								borderRadius: 16,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								padding: 24,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 16,
									fontWeight: "600",
									marginBottom: 4,
								}}
							>
								No students found
							</Text>
							<Text style={{ color: "#9CA3AF", fontSize: 13 }}>
								Try adjusting your filters
							</Text>
						</LinearGradient>
					) : (
						<View style={{ gap: 10 }}>
							{filteredStudents.map((student) => (
								<Pressable
									key={student._id}
									onPress={() => handleStudentPress(student)}
									style={({ pressed }) => ({
										backgroundColor: "rgba(255,255,255,0.06)",
										borderRadius: 14,
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.1)",
										padding: 14,
										opacity: pressed ? 0.8 : 1,
									})}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 10,
										}}
									>
										<View
											style={{
												width: 40,
												height: 40,
												borderRadius: 20,
												backgroundColor: "rgba(255,204,0,0.12)",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<FontAwesome name="user" size={16} color="#FFCC00" />
										</View>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													color: "white",
													fontSize: 15,
													fontWeight: "600",
												}}
											>
												{student.name}
											</Text>
											{/* <View
												style={{
													flexDirection: "row",
													gap: 10,
													marginTop: 4,
												}}
											>
												{student.rollNo && (
													<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
														{student.rollNo}
													</Text>
												)}
												{student.branch && (
													<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
														{student.branch}
													</Text>
												)}
											</View> */}
										</View>
										<View
											style={{
												alignItems: "flex-end",
												flexDirection: "row",
												gap: 10,
											}}
										>
											<Text
												style={{ color: "#6B7280", fontSize: 11, marginTop: 2 }}
											>
												{student.room?.roomNumber
													? `Room ${student.room.roomNumber}`
													: "No Room"}
											</Text>
											<Text style={{ color: "#D1D5DB", fontSize: 12 }}>
												{student.block?.name ? student.block?.name : "No block"}
											</Text>
										</View>
									</View>
								</Pressable>
							))}
						</View>
					)}
				</View>
			</ScrollView>

			<Modal
				visible={studentModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setStudentModalVisible(false)}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.6)",
						justifyContent: "center",
						alignItems: "center",
						padding: 24,
					}}
					onPress={() => setStudentModalVisible(false)}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={{ width: "100%", maxWidth: 380 }}
					>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderRadius: 20,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								overflow: "hidden",
							}}
						>
							<LinearGradient
								colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)"]}
								style={{
									padding: 15,
									borderBottomWidth: 1,
									borderBottomColor: "rgba(255,255,255,0.07)",
									flexDirection: "row",
									alignItems: "center",
									gap: 14,
								}}
							>
								<View
									style={{
										width: 48,
										height: 48,
										borderRadius: 24,
										backgroundColor: "rgba(255,204,0,0.15)",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FontAwesome name="user" size={22} color="#FFCC00" />
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{ color: "white", fontSize: 17, fontWeight: "700" }}
									>
										{selectedStudent?.name}
									</Text>
								</View>
								<Pressable
									onPress={() => setStudentModalVisible(false)}
									style={({ pressed }) => ({
										opacity: pressed ? 0.6 : 1,
										padding: 4,
									})}
								>
									<FontAwesome name="times" size={25} color="#FFCC00" />
								</Pressable>
							</LinearGradient>

							<View style={{ padding: 20, gap: 12 }}>
								{[
									{
										label: "Roll No",
										value: selectedStudent?.rollNo || "Not set",
										icon: "id-card",
									},
									{
										label: "Email",
										value: selectedStudent?.email || "Not set",
										icon: "envelope-o",
									},
									{
										label: "Phone",
										value: selectedStudent?.phoneNumber || "Not set",
										icon: "phone",
									},
									{
										label: "Branch",
										value: selectedStudent?.branch || "Not set",
										icon: "graduation-cap",
									},
									{
										label: "Block",
										value: selectedStudent?.block?.name || "No block",
										icon: "building",
									},

									{
										label: "Room",
										value: selectedStudent?.room?.roomNumber || "Unassigned",
										icon: "bed",
									},
									{
										label: "Date of Birth",
										value: formatDate(selectedStudent?.dateOfBirth),
										icon: "calendar",
									},
								].map((item) => (
									<View
										key={item.label}
										style={{
											flexDirection: "row",
											alignItems: "center",
											backgroundColor: "rgba(255,255,255,0.04)",
											borderRadius: 10,
											paddingHorizontal: 14,
											paddingVertical: 11,
											gap: 12,
										}}
									>
										<FontAwesome
											name={item.icon as any}
											size={14}
											color="#6B7280"
											style={{ width: 16, marginBottom: 20 }}
										/>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													color: "#6B7280",
													fontSize: 11,
													marginBottom: 2,
												}}
											>
												{item.label}
											</Text>
											<Text style={{ color: "#E5E7EB", fontSize: 14 }}>
												{item.label === "Room" && item.value
													? `Room ${item.value}`
													: item.value}
											</Text>
										</View>
									</View>
								))}
							</View>

							<View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
								<Pressable
									onPress={() => setDeleteModalVisible(true)}
									disabled={!canDeleteSelected}
									style={({ pressed }) => ({
										backgroundColor: canDeleteSelected
											? "rgba(239,68,68,0.1)"
											: "rgba(107,114,128,0.1)",
										borderWidth: 1,
										borderColor: canDeleteSelected
											? "rgba(239,68,68,0.3)"
											: "rgba(107,114,128,0.2)",
										borderRadius: 12,
										padding: 13,
										alignItems: "center",
										opacity: pressed ? 0.8 : 1,
									})}
								>
									<Text
										style={{
											color: canDeleteSelected ? "#EF4444" : "#6B7280",
											fontSize: 14,
											fontWeight: "600",
										}}
									>
										Delete student account
									</Text>
								</Pressable>
								{!canDeleteSelected && (
									<Text
										style={{
											color: "#6B7280",
											fontSize: 11,
											marginTop: 8,
											textAlign: "center",
										}}
									>
										Student must be unassigned from block and room
									</Text>
								)}
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>

			<Modal
				visible={deleteModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setDeleteModalVisible(false)}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.65)",
						justifyContent: "center",
						alignItems: "center",
						padding: 24,
					}}
					onPress={() => setDeleteModalVisible(false)}
				>
					<Pressable
						onPress={(e) => e.stopPropagation()}
						style={{ width: "100%", maxWidth: 360 }}
					>
						<LinearGradient
							colors={["#0A0F1E", "#0A0F1E"]}
							style={{
								borderRadius: 18,
								borderWidth: 1,
								borderColor: "rgba(255,255,255,0.1)",
								overflow: "hidden",
							}}
						>
							<View style={{ padding: 18, gap: 12 }}>
								<Text
									style={{
										color: "white",
										fontSize: 16,
										fontWeight: "700",
										textAlign: "center",
									}}
								>
									Confirm deletion
								</Text>
								<Text
									style={{
										color: "#9CA3AF",
										fontSize: 12,
										textAlign: "center",
									}}
								>
									Enter your admin password to delete this student .
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(255,255,255,0.08)",
										borderRadius: 12,
										borderWidth: 1,
										borderColor: "rgba(255,255,255,0.12)",
										paddingHorizontal: 12,
										paddingVertical: 8,
									}}
								>
									<FontAwesome name="lock" size={14} color="#9CA3AF" />
									<TextInput
										value={deletePassword}
										onChangeText={setDeletePassword}
										placeholder="Admin password"
										placeholderTextColor="#4B5563"
										secureTextEntry
										style={{
											flex: 1,
											color: "white",
											paddingHorizontal: 8,
											paddingVertical: 6,
											fontSize: 13,
										}}
									/>
								</View>
								<View style={{ flexDirection: "row", gap: 10 }}>
									<Pressable
										onPress={() => setDeleteModalVisible(false)}
										style={({ pressed }) => ({
											flex: 1,
											backgroundColor: "rgba(255,255,255,0.08)",
											borderRadius: 10,
											paddingVertical: 12,
											alignItems: "center",
											opacity: pressed ? 0.8 : 1,
										})}
									>
										<Text style={{ color: "#E5E7EB", fontSize: 13 }}>
											Cancel
										</Text>
									</Pressable>
									<Pressable
										onPress={handleConfirmDelete}
										disabled={deleteLoading}
										style={({ pressed }) => ({
											flex: 1,
											backgroundColor: "rgba(239,68,68,0.2)",
											borderRadius: 10,
											paddingVertical: 12,
											alignItems: "center",
											opacity: deleteLoading || pressed ? 0.8 : 1,
										})}
									>
										{deleteLoading ? (
											<ActivityIndicator color="#EF4444" />
										) : (
											<Text style={{ color: "#EF4444", fontSize: 13 }}>
												Delete
											</Text>
										)}
									</Pressable>
								</View>
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>
		</LinearGradient>
	);
};

export default StudentsScreen;
