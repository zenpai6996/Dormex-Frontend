import AdminMessMenu from "@/components/Mess/AdminMessMenu";
import StudentMessMenu from "@/components/Mess/StudentMessMenu";
import { useAuth } from "@/src/context/AuthContext";
import { View } from "react-native";

export default function TabTwoScreen() {
	const { role } = useAuth();

	return (
		<View style={{ flex: 1 }}>
			{role === "ADMIN" ? <AdminMessMenu /> : <StudentMessMenu />}
		</View>
	);
}
