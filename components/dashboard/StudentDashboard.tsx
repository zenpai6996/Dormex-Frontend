import { Text, View } from "react-native";
import EmptyState from "./EmptyState";

export default function StudentDashboard({ data }) {
	if (!data.todayMenu) {
		return <EmptyState message="Menu not updated today." />;
	}

	return (
		<View style={{ padding: 16 }}>
			<Text style={{ fontSize: 18, color: "white" }}>Today's Menu</Text>

			<Text style={{ color: "#ccc", marginTop: 8 }}>
				Breakfast: {data.todayMenu.breakfast}
			</Text>
			<Text style={{ color: "#ccc" }}>Lunch: {data.todayMenu.lunch}</Text>
			<Text style={{ color: "#ccc" }}>Dinner: {data.todayMenu.dinner}</Text>
		</View>
	);
}
