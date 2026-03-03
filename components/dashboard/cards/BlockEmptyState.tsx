import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function BlocksEmptyState() {
	const router = useRouter();

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
			style={{
				borderRadius: 16,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 24,
				alignItems: "center",
				marginBottom: 16,
			}}
		>
			<View
				style={{
					width: 70,
					height: 70,
					borderRadius: 20,
					backgroundColor: "rgba(255,204,0,0.1)",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
				}}
			>
				<FontAwesome name="building" size={32} color="#FFCC00" />
			</View>

			<Text
				style={{
					color: "white",
					fontSize: 18,
					fontWeight: "600",
					marginBottom: 8,
				}}
			>
				No Blocks Added Yet
			</Text>

			<Text
				style={{
					color: "#9CA3AF",
					fontSize: 14,
					textAlign: "center",
					marginBottom: 20,
				}}
			>
				Create your first block to start managing hostel accommodations.
			</Text>

			<Pressable
				onPress={() => router.push("/create")}
				style={({ pressed }) => ({
					backgroundColor: "#FFCC00",
					borderRadius: 12,
					paddingVertical: 12,
					paddingHorizontal: 24,
					flexDirection: "row",
					alignItems: "center",
					transform: [{ scale: pressed ? 0.98 : 1 }],
					opacity: pressed ? 0.9 : 1,
				})}
			>
				<Text
					style={{
						color: "#0A0F1E",
						fontSize: 16,
						fontWeight: "bold",
					}}
				>
					Create Block
				</Text>
			</Pressable>

			<View
				style={{
					flexDirection: "row",
					gap: 12,
					marginTop: 24,
					paddingTop: 24,
					borderTopWidth: 1,
					borderTopColor: "rgba(255,255,255,0.1)",
					width: "100%",
				}}
			>
				<View style={{ flex: 1, alignItems: "center" }}>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 12,
							backgroundColor: "rgba(255,255,255,0.05)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
						}}
					>
						<FontAwesome name="building-o" size={18} color="#9CA3AF" />
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 10 }}>Create Block</Text>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 12,
							backgroundColor: "rgba(255,255,255,0.05)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
						}}
					>
						<FontAwesome name="bed" size={18} color="#9CA3AF" />
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 10 }}>Add Rooms</Text>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 12,
							backgroundColor: "rgba(255,255,255,0.05)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
						}}
					>
						<FontAwesome name="users" size={18} color="#9CA3AF" />
					</View>
					<Text style={{ color: "#9CA3AF", fontSize: 10 }}>
						Assign Students
					</Text>
				</View>
			</View>
		</LinearGradient>
	);
}
