import { deleteBlock, regenerateInviteCode } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";

interface Block {
	_id: string;
	name: string;
	maxCapacity: number;
	inviteCode: string;
	inviteCodeExpiresAt: string;
	createdAt: string;
}

interface BlockListProps {
	blocks: Block[];
	onRefresh: () => void;
}

export default function BlockList({ blocks, onRefresh }: BlockListProps) {
	const { token } = useAuth();
	const router = useRouter();
	const [loadingId, setLoadingId] = useState<string | null>(null);

	const handlePressBlock = (blockId: string) => {
		router.push(`/block/${blockId}`);
	};

	const handleCopyCode = async (code: string) => {
		await Clipboard.setStringAsync(code);
		ToastService.show({
			contentContainerStyle: {
				borderStartColor: "#4ADE80",
				borderStartWidth: 5,
				borderEndColor: "#4ADE80",
				borderEndWidth: 5,
				backgroundColor: "#0A0F1E",
			},
			message: `Invite code copied: ${code}`,
			duration: 2000,
			position: "bottom",
		});
	};

	const handleRegenerate = (blockId: string, blockName: string) => {
		Alert.alert({
			title: "Regenerate Code",
			description: `Are you sure you want to generate a new invite code for Block ${blockName}? The old code will no longer work.`,
			buttons: [
				{
					text: "Cancel",
					textStyle: { color: "#00ff1a" },
					onPress: () => {},
				},
				{
					text: "Regenerate",
					textStyle: { color: "#FFCC00" },
					onPress: async () => {
						setLoadingId(blockId);
						try {
							await regenerateInviteCode(token!, blockId);
							ToastService.show({
								contentContainerStyle: {
									borderStartColor: "#4ADE80",
									borderStartWidth: 5,
									borderEndColor: "#4ADE80",
									borderEndWidth: 5,
									backgroundColor: "#0A0F1E",
								},
								message: "Invite code regenerated successfully",
								duration: 3000,
								position: "bottom",
							});
							onRefresh();
						} catch (error) {
							ToastService.showError({
								message: "Failed to regenerate code",
								duration: 3000,
								position: "bottom",
							});
						} finally {
							setLoadingId(null);
						}
					},
				},
			],
			showCancelButton: true,
		});
	};

	const handleDelete = (blockId: string, blockName: string) => {
		Alert.alert({
			title: "Delete Block",
			description: `Are you sure you want to delete Block ${blockName}? This will also delete all rooms and remove students from this block. This action cannot be undone.`,
			buttons: [
				{
					text: "Cancel",
					textStyle: { color: "#00ff1a" },
					onPress: () => {},
				},
				{
					text: "Delete",
					textStyle: { color: "#EF4444" },
					onPress: async () => {
						setLoadingId(blockId);
						try {
							await deleteBlock(token!, blockId);
							ToastService.show({
								contentContainerStyle: {
									borderStartColor: "#4ADE80",
									borderStartWidth: 5,
									borderEndColor: "#4ADE80",
									borderEndWidth: 5,
									backgroundColor: "#0A0F1E",
								},
								message: "Block deleted successfully",
								duration: 3000,
								position: "bottom",
							});
							onRefresh();
						} catch (error) {
							ToastService.showError({
								message: "Failed to delete block",
								duration: 3000,
								position: "bottom",
							});
						} finally {
							setLoadingId(null);
						}
					},
				},
			],
			showCancelButton: true,
		});
	};

	const isExpiringSoon = (expiresAt: string) => {
		const expiry = new Date(expiresAt).getTime();
		const now = new Date().getTime();
		const daysLeft = (expiry - now) / (1000 * 60 * 60 * 24);
		return daysLeft <= 2 && daysLeft > 0;
	};

	const isExpired = (expiresAt: string) => {
		return new Date(expiresAt).getTime() < new Date().getTime();
	};

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingRight: 16 }}
		>
			{blocks.map((block) => (
				<Pressable
					key={block._id}
					onPress={() => handlePressBlock(block._id)}
					style={({ pressed }) => ({
						transform: [{ scale: pressed ? 0.98 : 1 }],
						opacity: pressed ? 0.9 : 1,
					})}
				>
					<LinearGradient
						colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
						style={{
							width: 350,
							borderRadius: 16,
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.1)",
							padding: 16,
							marginRight: 12,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "flex-start",
								marginBottom: 16,
							}}
						>
							<View
								style={{
									width: 48,
									height: 48,
									borderRadius: 12,
									backgroundColor: "rgba(255,204,0,0.1)",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text
									style={{
										color: "#FFCC00",
										fontSize: 20,
										fontWeight: "bold",
									}}
								>
									{block.name.charAt(0)}
								</Text>
							</View>
							<View style={{ flexDirection: "row", gap: 8 }}>
								{loadingId === block._id ? (
									<ActivityIndicator size="small" color="#FFCC00" />
								) : (
									<>
										<Pressable
											onPress={(e) => {
												e.stopPropagation();
												handleDelete(block._id, block.name);
											}}
											style={({ pressed }) => ({
												padding: 8,
												opacity: pressed ? 0.7 : 1,
											})}
										>
											<FontAwesome name="trash-o" size={20} color="#EF4444" />
										</Pressable>
										<FontAwesome
											name="chevron-right"
											size={20}
											color="#9CA3AF"
											style={{ marginTop: 8 }}
										/>
									</>
								)}
							</View>
						</View>

						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontWeight: "600",
								marginBottom: 4,
							}}
						>
							Block {block.name}
						</Text>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 14,
								marginBottom: 16,
							}}
						>
							Capacity: {block.maxCapacity} students
						</Text>

						<View
							style={{
								backgroundColor: "rgba(0,0,0,0.3)",
								borderRadius: 12,
								padding: 12,
								marginBottom: 12,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 8,
								}}
							>
								<Text
									style={{
										color: "#6B7280",
										fontSize: 12,
									}}
								>
									INVITE CODE
								</Text>
								{isExpired(block.inviteCodeExpiresAt) ? (
									<View
										style={{
											backgroundColor: "rgba(239,68,68,0.2)",
											paddingHorizontal: 8,
											paddingVertical: 2,
											borderRadius: 8,
										}}
									>
										<Text
											style={{
												color: "#EF4444",
												fontSize: 10,
												fontWeight: "500",
											}}
										>
											Expired
										</Text>
									</View>
								) : isExpiringSoon(block.inviteCodeExpiresAt) ? (
									<View
										style={{
											backgroundColor: "rgba(255,204,0,0.2)",
											paddingHorizontal: 8,
											paddingVertical: 2,
											borderRadius: 8,
										}}
									>
										<Text
											style={{
												color: "#FFCC00",
												fontSize: 10,
												fontWeight: "500",
											}}
										>
											Expiring soon
										</Text>
									</View>
								) : null}
							</View>
							<Pressable
								onPress={(e) => {
									e.stopPropagation();
									handleCopyCode(block.inviteCode);
								}}
								style={({ pressed }) => ({
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: pressed
										? "rgba(255,255,255,0.1)"
										: "transparent",
									borderRadius: 8,
									padding: 8,
									marginHorizontal: -8,
								})}
							>
								<Text
									style={{
										color: "white",
										fontSize: 24,
										fontWeight: "bold",
										letterSpacing: 2,
										flex: 1,
										fontFamily: "monospace",
									}}
								>
									{block.inviteCode}
								</Text>
								<FontAwesome
									name="copy"
									size={18}
									color="#FFCC00"
									style={{ marginLeft: 12 }}
								/>
							</Pressable>
						</View>

						<Pressable
							onPress={(e) => {
								e.stopPropagation();
								handleRegenerate(block._id, block.name);
							}}
							disabled={loadingId === block._id}
							style={({ pressed }) => ({
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "rgba(255,204,0,0.1)",
								borderRadius: 8,
								padding: 10,
								opacity: pressed ? 0.8 : 1,
							})}
						>
							<FontAwesome
								name="refresh"
								size={14}
								color="#FFCC00"
								style={{ marginRight: 8 }}
							/>
							<Text
								style={{
									color: "#FFCC00",
									fontSize: 13,
									fontWeight: "500",
								}}
							>
								Regenerate Code
							</Text>
						</Pressable>
					</LinearGradient>
				</Pressable>
			))}
		</ScrollView>
	);
}
