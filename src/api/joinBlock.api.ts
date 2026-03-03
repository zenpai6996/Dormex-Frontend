const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function joinBlock(token: string, inviteCode: string) {
	const res = await fetch(`${API_URL}/joinBlock/join`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ inviteCode }),
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Failed to join block");
	}
	return res.json();
}
