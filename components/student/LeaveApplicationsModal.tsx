import { createLeave, deleteLeave, fetchLeaves } from "@/src/api/leave.api";
import { fetchProfile } from "@/src/api/profile.api";
import { useAuth } from "@/src/context/AuthContext";
import {
	LEAVE_STATUS_COLORS,
	LEAVE_STATUS_ICONS,
	LEAVE_STATUS_LABELS,
	LeaveApplication,
} from "@/src/types/leave.types";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";

export default function LeaveApplicationsModal() {
	const router = useRouter();
	const { token } = useAuth();
	const minDate = new Date();
	minDate.setHours(0, 0, 0, 0);
	minDate.setDate(minDate.getDate() + 1);
	const [fromDate, setFromDate] = useState(minDate);
	const [toDate, setToDate] = useState(minDate);
	const [showFromPicker, setShowFromPicker] = useState(false);
	const [showToPicker, setShowToPicker] = useState(false);
	const [reason, setReason] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [loadingLeaves, setLoadingLeaves] = useState(true);
	const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
	const [checkingEligibility, setCheckingEligibility] = useState(true);
	const [hasBlock, setHasBlock] = useState(false);
	const [hasRoom, setHasRoom] = useState(false);
	const [blockName, setBlockName] = useState("");
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		checkEligibility();
		loadLeaves();
	}, [token]);

	const checkEligibility = async () => {
		try {
			const profile = await fetchProfile(token!);
			setHasBlock(!!profile.block);
			setHasRoom(!!profile.room);
			setBlockName(profile.block?.name || "");
		} catch (error) {
			console.error("Failed to load profile", error);
		} finally {
			setCheckingEligibility(false);
		}
	};

	const loadLeaves = async () => {
		if (!token) return;
		setLoadingLeaves(true);
		try {
			const data = await fetchLeaves(token);
			setLeaves(data);
		} catch (error) {
			console.error("Failed to load leaves", error);
		} finally {
			setLoadingLeaves(false);
		}
	};

	const formatDate = (value: string) => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString();
	};

	const handleSubmit = async () => {
		if (fromDate < minDate) {
			ToastService.showError({
				message: "From date must be at least tomorrow",
				duration: 3000,
				position: "bottom",
			});
			return;
		}
		if (!reason.trim()) {
			ToastService.showError({
				message: "Please provide a reason for leave",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		if (toDate < fromDate) {
			ToastService.showError({
				message: "To date must be after from date",
				duration: 3000,
				position: "bottom",
			});
			return;
		}

		setSubmitting(true);
		try {
			await createLeave(token!, {
				fromDate: fromDate.toISOString(),
				toDate: toDate.toISOString(),
				reason: reason.trim(),
			});
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Leave request submitted",
				duration: 3000,
				position: "bottom",
			});
			setReason("");
			setFromDate(minDate);
			setToDate(minDate);
			await loadLeaves();
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to submit leave",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteLeave = async (leaveId: string) => {
		if (!token) return;
		setDeletingId(leaveId);
		try {
			await deleteLeave(token, leaveId);
			ToastService.show({
				contentContainerStyle: {
					borderStartColor: "#4ADE80",
					borderStartWidth: 5,
					borderEndColor: "#4ADE80",
					borderEndWidth: 5,
					backgroundColor: "#0A0F1E",
				},
				message: "Leave deleted",
				duration: 3000,
				position: "bottom",
			});
			setLeaves((prev) => prev.filter((leave) => leave._id !== leaveId));
		} catch (error: any) {
			ToastService.showError({
				message: error.message || "Failed to delete leave",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setDeletingId(null);
		}
	};

	if (checkingEligibility) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1 }}
			>
				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<ActivityIndicator size="large" color="#FFCC00" />
					<Text style={{ color: "white", marginTop: 12 }}>
						Checking eligibility...
					</Text>
				</View>
			</LinearGradient>
		);
	}

	if (!hasBlock || !hasRoom) {
		return (
			<LinearGradient
				colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
				style={{ flex: 1 }}
			>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						padding: 24,
					}}
				>
					<View
						style={{
							width: 80,
							height: 80,
							borderRadius: 40,
							backgroundColor: "rgba(255,204,0,0.1)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 20,
							borderWidth: 1,
							borderColor: "rgba(255,204,0,0.3)",
						}}
					>
						<FontAwesome
							name="exclamation-triangle"
							size={40}
							color="#FFCC00"
						/>
					</View>

					<Text
						style={{
							color: "white",
							fontSize: 22,
							fontWeight: "bold",
							marginBottom: 12,
							textAlign: "center",
						}}
					>
						Cannot Apply for Leave
					</Text>

					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 16,
							textAlign: "center",
							marginBottom: 24,
						}}
					>
						You need to have a block and room assigned before applying.
					</Text>

					<Pressable
						onPress={() => router.back()}
						style={({ pressed }) => ({
							backgroundColor: "#FFCC00",
							paddingHorizontal: 32,
							paddingVertical: 16,
							borderRadius: 12,
							opacity: pressed ? 0.8 : 1,
						})}
					>
						<Text
							style={{
								color: "#0A0F1E",
								fontSize: 16,
								fontWeight: "bold",
							}}
						>
							Go Back
						</Text>
					</Pressable>
				</View>
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ padding: 20, paddingTop: 60 }}
					keyboardShouldPersistTaps="handled"
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 32,
						}}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
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
							<Text
								style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
							>
								Leave Applications
							</Text>
						</View>

						<View
							style={{
								backgroundColor: "rgba(255,204,0,0.1)",
								paddingHorizontal: 12,
								paddingVertical: 6,
								borderRadius: 8,
								borderWidth: 1,
								borderColor: "rgba(255,204,0,0.3)",
							}}
						>
							<Text style={{ color: "#FFCC00", fontSize: 12 }}>
								{blockName}
							</Text>
						</View>
					</View>

					<View style={{ gap: 16, marginBottom: 28 }}>
						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								From *
							</Text>
							<Pressable
								onPress={() => setShowFromPicker(true)}
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
									{fromDate.toLocaleDateString()}
								</Text>
							</Pressable>
							{showFromPicker && (
								<DateTimePicker
									value={fromDate}
									mode="date"
									display="default"
									minimumDate={minDate}
									onChange={(event, selectedDate) => {
										setShowFromPicker(false);
										if (selectedDate) {
											setFromDate(selectedDate);
											if (selectedDate > toDate) {
												setToDate(selectedDate);
											}
										}
									}}
								/>
							)}
						</View>

						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								To *
							</Text>
							<Pressable
								onPress={() => setShowToPicker(true)}
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
									{toDate.toLocaleDateString()}
								</Text>
							</Pressable>
							{showToPicker && (
								<DateTimePicker
									value={toDate}
									mode="date"
									display="default"
									minimumDate={fromDate > minDate ? fromDate : minDate}
									onChange={(event, selectedDate) => {
										setShowToPicker(false);
										if (selectedDate) {
											setToDate(selectedDate);
										}
									}}
								/>
							)}
						</View>

						<View>
							<Text style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8 }}>
								Reason *
							</Text>
							<View
								style={{
									backgroundColor: "rgba(255,255,255,0.1)",
									borderRadius: 12,
									paddingHorizontal: 14,
									paddingVertical: 1,
								}}
							>
								<TextInput
									value={reason}
									onChangeText={setReason}
									placeholder="Share your reason"
									placeholderTextColor="#4B5563"
									style={{ color: "white", minHeight: 80 }}
									multiline
								/>
							</View>
						</View>

						<Pressable
							onPress={handleSubmit}
							disabled={submitting}
							style={({ pressed }) => ({
								backgroundColor: "#FFCC00",
								paddingVertical: 16,
								borderRadius: 14,
								alignItems: "center",
								opacity: submitting || pressed ? 0.8 : 1,
							})}
						>
							{submitting ? (
								<ActivityIndicator color="#0A0F1E" />
							) : (
								<Text
									style={{
										color: "#0A0F1E",
										fontSize: 15,
										fontWeight: "700",
									}}
								>
									Submit Leave
								</Text>
							)}
						</Pressable>
					</View>

					<View style={{ marginBottom: 24 }}>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontWeight: "700",
								marginBottom: 12,
							}}
						>
							Your Leave History
						</Text>

						{loadingLeaves ? (
							<ActivityIndicator color="#FFCC00" style={{ marginTop: 12 }} />
						) : leaves.length === 0 ? (
							<View
								style={{
									backgroundColor: "rgba(255,255,255,0.05)",
									borderRadius: 16,
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.1)",
									padding: 20,
									alignItems: "center",
								}}
							>
								<Text style={{ color: "#9CA3AF" }}>
									No leave applications yet
								</Text>
							</View>
						) : (
							<View style={{ gap: 12 }}>
								{leaves.map((leave) => (
									<View
										key={leave._id}
										style={{
											backgroundColor: "rgba(255,255,255,0.05)",
											borderRadius: 16,
											borderWidth: 1,
											borderColor: `${LEAVE_STATUS_COLORS[leave.status]}30`,
											overflow: "hidden",
										}}
									>
										<View style={{ padding: 14, gap: 10 }}>
											{/* Icon + dates row */}
											<View
												style={{
													flexDirection: "row",
													alignItems: "flex-start",
													gap: 12,
												}}
											>
												<View
													style={{
														width: 38,
														height: 38,
														borderRadius: 10,
														backgroundColor: `${LEAVE_STATUS_COLORS[leave.status]}18`,
														borderWidth: 1,
														borderColor: `${LEAVE_STATUS_COLORS[leave.status]}30`,
														alignItems: "center",
														justifyContent: "center",
														marginTop: 2,
													}}
												>
													<FontAwesome
														name={LEAVE_STATUS_ICONS[leave.status] as any}
														size={14}
														color={LEAVE_STATUS_COLORS[leave.status]}
													/>
												</View>

												<View style={{ flex: 1, gap: 6 }}>
													{/* From → To in one row */}
													<View
														style={{
															flexDirection: "row",
															alignItems: "center",
															gap: 6,
														}}
													>
														<Text
															style={{
																color: "#9CA3AF",
																fontSize: 11,
															}}
														>
															From
														</Text>
														<Text
															style={{
																color: "white",
																fontSize: 13,
																fontWeight: "600",
															}}
														>
															{formatDate(leave.fromDate)}
														</Text>
														<Text style={{ color: "#4B5563", fontSize: 11 }}>
															→
														</Text>
														<Text
															style={{
																color: "#9CA3AF",
																fontSize: 11,
															}}
														>
															To
														</Text>
														<Text
															style={{
																color: "white",
																fontSize: 13,
																fontWeight: "600",
															}}
														>
															{formatDate(leave.toDate)}
														</Text>
													</View>

													{/* Reason */}
													<Text
														style={{
															color: "#6B7280",
															fontSize: 12,
															lineHeight: 17,
														}}
														numberOfLines={2}
													>
														Reason : {leave.reason}
													</Text>
												</View>
											</View>

											{/* Bottom row: status badge + delete button */}
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "space-between",
													paddingTop: 8,
													borderTopWidth: 1,
													borderTopColor: "rgba(255,255,255,0.05)",
												}}
											>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
														gap: 6,
														backgroundColor: `${LEAVE_STATUS_COLORS[leave.status]}18`,
														borderWidth: 1,
														borderColor: `${LEAVE_STATUS_COLORS[leave.status]}40`,
														paddingHorizontal: 10,
														paddingVertical: 4,
														borderRadius: 999,
													}}
												>
													<View
														style={{
															width: 6,
															height: 6,
															borderRadius: 3,
															backgroundColor:
																LEAVE_STATUS_COLORS[leave.status],
														}}
													/>
													<Text
														style={{
															color: LEAVE_STATUS_COLORS[leave.status],
															fontSize: 11,
															fontWeight: "700",
															letterSpacing: 0.4,
														}}
													>
														{LEAVE_STATUS_LABELS[leave.status]}
													</Text>
												</View>

												{leave.status === "REJECTED" && (
													<Pressable
														onPress={() => handleDeleteLeave(leave._id)}
														disabled={deletingId === leave._id}
														style={({ pressed }) => ({
															flexDirection: "row",
															alignItems: "center",
															gap: 6,
															backgroundColor: "rgba(239,68,68,0.1)",
															borderWidth: 1,
															borderColor: "rgba(239,68,68,0.3)",
															borderRadius: 10,
															paddingHorizontal: 12,
															paddingVertical: 6,
															opacity:
																pressed || deletingId === leave._id ? 0.6 : 1,
														})}
													>
														{deletingId === leave._id ? (
															<ActivityIndicator size="small" color="#EF4444" />
														) : (
															<FontAwesome
																name="trash"
																size={13}
																color="#EF4444"
															/>
														)}
													</Pressable>
												)}
											</View>
										</View>
									</View>
								))}
							</View>
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
}
