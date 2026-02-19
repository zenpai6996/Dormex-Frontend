import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";

export default function Register() {
	const auth = useContext(AuthContext);
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
			<Text style={{ color: "#fff", fontSize: 24, marginBottom: 20 }}>
				Register
			</Text>

			<TextInput
				placeholder="Name"
				value={name}
				onChangeText={setName}
				style={{
					borderWidth: 1,
					backgroundColor: "#fff",
					marginBottom: 10,
					padding: 10,
				}}
			/>

			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				style={{
					borderWidth: 1,
					backgroundColor: "#fff",
					marginBottom: 10,
					padding: 10,
				}}
			/>

			<TextInput
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				style={{
					borderWidth: 1,
					backgroundColor: "#fff",
					marginBottom: 20,
					padding: 10,
				}}
			/>

			<Button
				title="Register"
				onPress={async () => {
					await auth?.register(name, email, password);
					router.replace("/(auth)/login");
				}}
			/>
		</View>
	);
}
