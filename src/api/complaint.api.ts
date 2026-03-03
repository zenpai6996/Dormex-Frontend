const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchComplaints(token: string) {
	const res = await fetch(`${API_URL}/complaints`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to fetch complaints");
	return res.json();
}

export async function createComplaint(
	token: string,
	data: { category: string; description: string },
) {
	const res = await fetch(`${API_URL}/complaints`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create complaint");
	return res.json();
}
