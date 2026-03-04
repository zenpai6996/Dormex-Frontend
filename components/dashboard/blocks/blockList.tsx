import { deleteBlock, regenerateInviteCode } from "@/src/api/block.api";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ToastService } from "react-native-toastier";
import { Alert } from "rn-custom-alert-prompt";
import PasswordConfirmModal from "./PasswordConfirmModal";

const { width: screenWidth } = Dimensions.get("window");

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
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedBlock, setSelectedBlock] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const carouselRef = useRef(null);

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

	const handleDeletePress = (blockId: string, blockName: string) => {
		setSelectedBlock({ id: blockId, name: blockName });
		setDeleteModalVisible(true);
	};

	const handleConfirmDelete = async (password: string) => {
		if (!selectedBlock || !token) return;

		setIsDeleting(true);
		try {
			await deleteBlock(token, selectedBlock.id, password);
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
			setDeleteModalVisible(false);
			onRefresh();
		} catch (error: any) {
			ToastService.showError({
				message:
					error.message || "Failed to delete block. Check your password.",
				duration: 3000,
				position: "bottom",
			});
		} finally {
			setIsDeleting(false);
			setSelectedBlock(null);
		}
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

	const renderBlockItem = ({ item: block }: { item: Block }) => (
		<Pressable
			onPress={() => handlePressBlock(block._id)}
			style={({ pressed }) => ({
				transform: [{ scale: pressed ? 0.98 : 1 }],
				opacity: pressed ? 0.9 : 1,
				width: screenWidth - 60,
				marginHorizontal: 10,
			})}
		>
			<LinearGradient
				colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(255,255,255,0.1)",
					padding: 16,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: 5,
					}}
				>
					<Text
						style={{
							color: "#FFCC00",
							fontSize: 18,
							fontWeight: "600",
						}}
					>
						Block {block.name}
					</Text>
					<View style={{ flexDirection: "row", gap: 8 }}>
						{loadingId === block._id ? (
							<ActivityIndicator size="small" color="#FFCC00" />
						) : (
							<>
								<Pressable
									onPress={(e) => {
										e.stopPropagation();
										handleDeletePress(block._id, block.name);
									}}
									style={({ pressed }) => ({
										padding: 8,
										opacity: pressed ? 0.7 : 1,
									})}
								>
									<FontAwesome name="trash-o" size={20} color="#EF4444" />
								</Pressable>
							</>
						)}
					</View>
				</View>

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
	);

	return (
		<>
			<PasswordConfirmModal
				visible={deleteModalVisible}
				onClose={() => {
					setDeleteModalVisible(false);
					setSelectedBlock(null);
				}}
				onConfirm={handleConfirmDelete}
				blockName={selectedBlock?.name || ""}
				isLoading={isDeleting}
			/>

			{blocks.length === 0 ? (
				<LinearGradient
					colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
					style={{
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "rgba(255,255,255,0.1)",
						padding: 32,
						alignItems: "center",
						marginHorizontal: 16,
					}}
				>
					<View
						style={{
							width: 60,
							height: 60,
							borderRadius: 20,
							backgroundColor: "rgba(255,204,0,0.1)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 12,
						}}
					>
						<FontAwesome name="building" size={28} color="#FFCC00" />
					</View>
					<Text
						style={{
							color: "white",
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 4,
						}}
					>
						No Blocks Yet
					</Text>
					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 14,
							textAlign: "center",
						}}
					>
						Create your first block to get started
					</Text>
				</LinearGradient>
			) : (
				<View style={styles.carouselContainer}>
					<Carousel
						ref={carouselRef}
						data={blocks}
						renderItem={renderBlockItem}
						width={screenWidth - 20}
						height={360}
						loop={blocks.length > 1}
						autoPlay={false}
						onSnapToItem={(index) => setCurrentIndex(index)}
						style={{
							width: screenWidth,
						}}
						mode="parallax"
						modeConfig={{
							parallaxScrollingScale: 0.95,
							parallaxScrollingOffset: 40,
						}}
					/>

					{/* Pagination Dots
					{blocks.length > 1 && (
						<View style={styles.paginationContainer}>
							{blocks.map((_, index) => (
								<Pressable
									key={index}
									onPress={() => {
										carouselRef.current?.scrollTo({ index });
									}}
									style={[
										styles.paginationDot,
										{
											backgroundColor:
												index === currentIndex
													? "#FFCC00"
													: "rgba(255,255,255,0.3)",
											width: index === currentIndex ? 20 : 8,
										},
									]}
								/>
							))}
						</View>
					)} */}
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	carouselContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 0,
	},
	paginationContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		gap: 8,
	},
	paginationDot: {
		height: 8,
		borderRadius: 4,
		marginHorizontal: 2,
	},
});
