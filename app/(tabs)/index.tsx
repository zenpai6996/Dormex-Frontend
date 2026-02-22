import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import ErrorState from "@/components/dashboard/ErrorState";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { fetchDashboard } from "@/src/api/dashboard.api";
import { useAuth } from "@/src/context/AuthContext";
import { DashboardType } from "@/src/schemas/dashboard.schema";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function TabOneScreen() {
	const { token, role, loading: authLoading } = useAuth();

	const [data, setData] = useState<DashboardType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!token) return;

		fetchDashboard(token)
			.then(setData)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [token]);

	// Show skeleton while loading
	if (authLoading || loading) {
		return <DashboardSkeleton />;
	}

	// If no data after loading, show nothing
	if (!data) {
		return <ErrorState />;
	}

	return (
		<View style={{ flex: 1 }}>
			{role === "ADMIN" ? (
				<AdminDashboard data={data} />
			) : (
				<StudentDashboard data={data} />
			)}
		</View>
	);
}
