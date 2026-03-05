import AdminComplaints from "@/components/complaints/AdminComplaints";
import StudentComplaints from "@/components/complaints/StudentComplaints";
import { View } from "@/components/Themed";
import { useAuth } from "@/src/context/AuthContext";

export default function TabThreeScreen() {
	const { role } = useAuth();

	return (
		<View style={{ flex: 1 }}>
			{role === "ADMIN" ? <AdminComplaints /> : <StudentComplaints />}
		</View>
	);
}
