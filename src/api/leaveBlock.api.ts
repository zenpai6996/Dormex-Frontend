const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function leaveBlock(token: string) {
	const res = await fetch(`${API_URL}/joinBlock/leave`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Failed to leave block");
	}
	return res.json();
}
