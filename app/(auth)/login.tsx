import { AuthContext } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
	const auth = useContext(AuthContext);
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
			<Text style={{ color: "#fff", fontSize: 24, marginBottom: 20 }}>
				Login
			</Text>
			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				style={{
					borderWidth: 1,
					backgroundColor: "#fff",
					marginBottom: 20,
					padding: 10,
				}}
			/>
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				style={{
					borderWidth: 1,
					backgroundColor: "#fff",
					marginBottom: 20,
					padding: 10,
				}}
			/>
			{/* <Button
				title="Login"
				onPress={async () => {
					await auth?.login(email, password);
					router.replace("/(tabs)");
				}}
			/> */}
			<Pressable
				onPress={async () => {
					await auth?.login(email, password);
					router.replace("/(tabs)");
				}}
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? "#4338CA" : "#4F46E5",
						paddingVertical: 14,
						borderRadius: 10,
						alignItems: "center",
					},
				]}
			>
				<Text style={{ color: "#000", fontSize: 16 }}></Text>
			</Pressable>
			<Button title="Create Account" onPress={() => router.push("/register")} />
		</View>
	);
}
