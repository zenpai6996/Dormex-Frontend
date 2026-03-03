import { DashboardSchema } from "@/src/schemas/dashboard.schema";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchDashboard(token: string) {
	const res = await fetch(`${BASE_URL}/dashboard`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		console.log("Dashboard status:", res.status);
		console.log("Dashboard error:", text);

		throw new Error("Failed to fetch dashboard");
	}

	const json = await res.json();

	const parsed = DashboardSchema.safeParse(json);

	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Invalid dashboard response");
	}

	return parsed.data;
}

export async function fetchStudentDashboard(token: string) {
	const res = await fetch(`${BASE_URL}/dashboard`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to fetch dashboard");
	return res.json();
}
