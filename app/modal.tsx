import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { AuthContext } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";

export default function ModalScreen() {
	const auth = useContext(AuthContext);
	const router = useRouter();
	const handleLogout = async () => {
		await auth?.logout();
		router.replace("/(auth)");
	};
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Modal</Text>
			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
			<Pressable
				onPress={handleLogout}
				style={({ pressed }) => [
					styles.logoutButton,
					pressed && styles.logoutPressed,
				]}
			>
				<Text style={styles.logoutText}>Logout</Text>
			</Pressable>
			<EditScreenInfo path="app/modal.tsx" />

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	logoutButton: {
		backgroundColor: "#EF4444",
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 10,
	},
	logoutPressed: {
		backgroundColor: "#DC2626",
	},
	logoutText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
