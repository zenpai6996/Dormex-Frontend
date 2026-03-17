import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, Pressable, Text, View } from "react-native";

const GITHUB_REPO_URL = "https://github.com/zenpai6996/Dormex-Frontend";

export default function AboutSection() {
	const handleOpenGitHub = () => {
		Linking.openURL(GITHUB_REPO_URL).catch((err) =>
			console.error("Failed to open URL:", err),
		);
	};

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
			style={{
				borderRadius: 16,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 20,
				marginTop: 24,
			}}
		>
			<Text
				style={{
					color: "#FFCC00",
					fontSize: 16,
					fontWeight: "600",
					marginBottom: 12,
					textAlign: "center",
				}}
			>
				DORMEX
			</Text>

			<Text
				style={{
					color: "#9CA3AF",
					fontSize: 13,
					textAlign: "center",
					lineHeight: 18,
					marginBottom: 16,
				}}
			>
				A comprehensive solution for managing hostel operations, student
				assignments, complaints, and mess menu.
			</Text>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					gap: 24,
				}}
			>
				<Pressable
					onPress={handleOpenGitHub}
					style={({ pressed }) => ({
						alignItems: "center",
						opacity: pressed ? 0.7 : 1,
						transform: [{ scale: pressed ? 0.95 : 1 }],
					})}
				>
					<View
						style={{
							width: 48,
							height: 48,
							borderRadius: 12,
							backgroundColor: "rgba(255,255,255,0.05)",
							alignItems: "center",
							justifyContent: "center",
							borderWidth: 1,
							borderColor: "rgba(255,204,0,0.2)",
							marginBottom: 6,
						}}
					>
						<FontAwesome name="github" size={24} color="#FFCC00" />
					</View>
				</Pressable>
			</View>
		</LinearGradient>
	);
}
