import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import ErrorState from "@/components/dashboard/ErrorState";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { fetchDashboard } from "@/src/api/dashboard.api";
import { useAuth } from "@/src/context/AuthContext";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export default function TabOneScreen() {
	const { token, role, loading: authLoading } = useAuth();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const loadDashboard = async () => {
		if (!token) return;
		try {
			setLoading(true);
			const dashboardData = await fetchDashboard(token);
			setData(dashboardData);
		} catch (error) {
			console.error("Failed to load dashboard", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadDashboard();
		}, [token]),
	);

	useEffect(() => {
		loadDashboard();
	}, [token]);

	if (authLoading || loading) {
		return <DashboardSkeleton />;
	}

	if (!data) {
		return <ErrorState />;
	}

	return (
		<View style={{ flex: 1 }}>
			{role === "ADMIN" ? (
				<AdminDashboard data={data} />
			) : (
				<StudentDashboard data={data} onRefresh={loadDashboard} />
			)}
		</View>
	);
}
