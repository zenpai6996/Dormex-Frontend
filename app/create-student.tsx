import { createStudentByAdmin } from "@/src/api/admin-student.api";
import { fetchBlocks } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Switch,
	Text,
	TextInput,
	View,
} from "react-native";
import { Alert } from "rn-custom-alert-prompt";

export default function CreateStudent() {
	const auth = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [blocks, setBlocks] = useState<any[]>([]);
	const [loadingBlocks, setLoadingBlocks] = useState(true);
	const [generatedPassword, setGeneratedPassword] = useState("");

	// Form fields
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [rollNo, setRollNo] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [branch, setBranch] = useState("IT");
	const [blockId, setBlockId] = useState("");
	const [password, setPassword] = useState("");
	const [generateRandomPassword, setGenerateRandomPassword] = useState(true);
	const [showDatePicker, setShowDatePicker] = useState(false);

	const branches = ["IT", "CS", "ECE", "EE", "ME", "CE", "OTHER"];

	useEffect(() => {
		loadBlocks();
	}, []);

	const loadBlocks = async () => {
		if (!auth.token) return;
		try {
			const blocksData = await fetchBlocks(auth.token);
			setBlocks(blocksData);
		} catch (error) {
			console.error("Failed to load blocks", error);
		} finally {
			setLoadingBlocks(false);
		}
	};

	const handleCreateStudent = async () => {
		// Validation
		if (!name || !email || !rollNo || !phoneNumber || !branch) {
			Alert.alert({
				title: "Error",
				description: "Please fill in all required fields",
				showCancelButton: false,
			});
			return;
		}

		if (!generateRandomPassword && !password) {
			Alert.alert({
				title: "Error",
				description:
					"Please enter a password or enable random password generation",
				showCancelButton: false,
			});
			return;
		}

		if (!generateRandomPassword && password.length < 8) {
			Alert.alert({
				title: "Error",
				description: "Password must be at least 8 characters",
				showCancelButton: false,
			});
			return;
		}

		try {
			setLoading(true);

			const studentData: any = {
				name,
				email,
				rollNo,
				phoneNumber,
				dateOfBirth: dateOfBirth.toISOString(),
				branch,
				generateRandomPassword,
			};

			if (blockId) {
				studentData.blockId = blockId;
			}

			if (!generateRandomPassword) {
				studentData.password = password;
			}

			const response = await createStudentByAdmin(auth.token!, studentData);

			const generatedPwd = response.password;
			const studentName = name;

			setName("");
			setEmail("");
			setRollNo("");
			setPhoneNumber("");
			setDateOfBirth(new Date());
			setBranch("IT");
			setBlockId("");
			setPassword("");
			setGenerateRandomPassword(true);
			setGeneratedPassword("");

			if (generatedPwd) {
				Alert.alert({
					title: "Student Created Successfully",
					description: `Student "${studentName}" has been created.\n\nGenerated Password: ${generatedPwd}\n\n Please save this password now as it won't be shown again.`,
					showCancelButton: false,
					buttons: [
						{
							text: "I've Saved It",
							onPress: () => {
								Alert.alert({
									title: "Ready for Next Student",
									description: "You can now add another student.",
									showCancelButton: false,
									buttons: [
										{
											text: "OK",
											onPress: () => {
												// Focus on name input for next entry
											},
										},
									],
								});
							},
						},
					],
				});
			} else {
				Alert.alert({
					title: "✅ Student Created Successfully",
					description: `Student "${studentName}" has been created. You can now add another student.`,
					showCancelButton: false,
					buttons: [
						{
							text: "Add Another",
							onPress: () => {
								// Optional: Focus on name input
							},
						},
					],
				});
			}
		} catch (error: any) {
			Alert.alert({
				title: "❌ Error",
				description: error.message || "Failed to create student",
				showCancelButton: false,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<LinearGradient colors={["#0A0F1E", "#0A0F1E"]} style={{ flex: 1 }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
					showsVerticalScrollIndicator={false}
				>
					{/* Header */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 30,
							marginTop: 20,
						}}
					>
						<Pressable
							onPress={() => router.back()}
							style={{
								width: 40,
								height: 40,
								borderRadius: 20,
								backgroundColor: "rgba(255,255,255,0.1)",
								alignItems: "center",
								justifyContent: "center",
								marginRight: 16,
							}}
						>
							<FontAwesome name="arrow-left" size={20} color="#FFCC00" />
						</Pressable>
						<Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
							Create Student
						</Text>
					</View>

					{/* Form */}
					<View style={{ gap: 16 }}>
						{/* Name Input */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Full Name *
							</Text>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									paddingHorizontal: 16,
								}}
							>
								<FontAwesome name="user" size={20} color="#9CA3AF" />
								<TextInput
									placeholder="Enter full name"
									placeholderTextColor="#6B7280"
									value={name}
									onChangeText={setName}
									style={{
										flex: 1,
										color: "#fff",
										paddingVertical: 14,
										paddingHorizontal: 12,
									}}
								/>
							</View>
						</View>

						{/* Email Input */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Email Address *
							</Text>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									paddingHorizontal: 16,
								}}
							>
								<FontAwesome name="envelope" size={20} color="#9CA3AF" />
								<TextInput
									placeholder="Enter email"
									placeholderTextColor="#6B7280"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									style={{
										flex: 1,
										color: "#fff",
										paddingVertical: 14,
										paddingHorizontal: 12,
									}}
								/>
							</View>
						</View>

						{/* Roll Number Input */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Roll Number *
							</Text>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									paddingHorizontal: 16,
								}}
							>
								<FontAwesome name="id-card" size={20} color="#9CA3AF" />
								<TextInput
									placeholder="e.g., 2306229"
									placeholderTextColor="#6B7280"
									value={rollNo}
									onChangeText={setRollNo}
									style={{
										flex: 1,
										color: "#fff",
										paddingVertical: 14,
										paddingHorizontal: 12,
									}}
								/>
							</View>
						</View>

						{/* Phone Number Input */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Phone Number *
							</Text>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									paddingHorizontal: 16,
								}}
							>
								<FontAwesome name="phone" size={20} color="#9CA3AF" />
								<TextInput
									placeholder="Enter phone number"
									placeholderTextColor="#6B7280"
									value={phoneNumber}
									onChangeText={setPhoneNumber}
									keyboardType="phone-pad"
									style={{
										flex: 1,
										color: "#fff",
										paddingVertical: 14,
										paddingHorizontal: 12,
									}}
								/>
							</View>
						</View>

						{/* Date of Birth */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Date of Birth *
							</Text>
							<Pressable
								onPress={() => setShowDatePicker(true)}
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									paddingHorizontal: 16,
									paddingVertical: 14,
								}}
							>
								<FontAwesome name="calendar" size={20} color="#9CA3AF" />
								<Text style={{ color: "#fff", marginLeft: 12, flex: 1 }}>
									{dateOfBirth.toLocaleDateString()}
								</Text>
							</Pressable>
							{showDatePicker && (
								<DateTimePicker
									value={dateOfBirth}
									mode="date"
									display="default"
									onChange={(event, selectedDate) => {
										setShowDatePicker(false);
										if (selectedDate) {
											setDateOfBirth(selectedDate);
										}
									}}
									maximumDate={new Date()}
								/>
							)}
						</View>

						{/* Branch Picker */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Branch *
							</Text>
							<View
								style={{
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									overflow: "hidden",
								}}
							>
								<Picker
									selectedValue={branch}
									onValueChange={setBranch}
									style={{ color: "#fff" }}
									dropdownIconColor="#FFCC00"
								>
									{branches.map((b) => (
										<Picker.Item key={b} label={b} value={b} color="#000" />
									))}
								</Picker>
							</View>
						</View>

						{/* Block Selection */}
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Assign Block
							</Text>
							{loadingBlocks ? (
								<ActivityIndicator color="#FFCC00" />
							) : (
								<View
									style={{
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 12,
										overflow: "hidden",
									}}
								>
									<Picker
										selectedValue={blockId}
										onValueChange={setBlockId}
										style={{ color: "#fff" }}
										dropdownIconColor="#FFCC00"
									>
										<Picker.Item
											label="Select a block "
											value=""
											color="#000"
										/>
										{blocks.map((block) => (
											<Picker.Item
												key={block._id}
												label={block.name}
												value={block._id}
												color="#000"
											/>
										))}
									</Picker>
								</View>
							)}
						</View>

						{/* Password Options */}
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginVertical: 10,
							}}
						>
							<Text style={{ color: "#fff", fontSize: 16 }}>
								Generate Random Password
							</Text>
							<Switch
								value={generateRandomPassword}
								onValueChange={setGenerateRandomPassword}
								trackColor={{ false: "#767577", true: "#FFCC00" }}
								thumbColor={generateRandomPassword ? "#fff" : "#f4f3f4"}
							/>
						</View>

						{!generateRandomPassword && (
							<View>
								<Text
									style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}
								>
									Password *
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "rgba(255,255,255,0.1)",
										borderRadius: 12,
										paddingHorizontal: 16,
									}}
								>
									<FontAwesome name="lock" size={20} color="#9CA3AF" />
									<TextInput
										placeholder="Enter password"
										placeholderTextColor="#6B7280"
										value={password}
										onChangeText={setPassword}
										secureTextEntry
										style={{
											flex: 1,
											color: "#fff",
											paddingVertical: 14,
											paddingHorizontal: 12,
										}}
									/>
								</View>
							</View>
						)}

						{/* Create Button */}
						<Pressable
							onPress={handleCreateStudent}
							disabled={loading}
							style={({ pressed }) => ({
								backgroundColor: pressed ? "#ffcc00ad" : "#ffcc00",
								paddingVertical: 16,
								borderRadius: 30,
								alignItems: "center",
								marginTop: 20,
								opacity: loading ? 0.7 : 1,
							})}
						>
							<Text style={{ color: "black", fontSize: 18, fontWeight: "600" }}>
								{loading ? "Creating..." : "Create Student"}
							</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}
