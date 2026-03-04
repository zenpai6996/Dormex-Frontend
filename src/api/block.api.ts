const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchBlocks(token: string) {
	const res = await fetch(`${API_URL}/blocks`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to fetch blocks");
	return res.json();
}

export async function fetchBlockById(token: string, blockId: string) {
	const res = await fetch(`${API_URL}/blocks/${blockId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to fetch block details");
	return res.json();
}

export async function createBlock(
	token: string,
	data: { name: string; maxCapacity: number },
) {
	const res = await fetch(`${API_URL}/blocks`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create block");
	return res.json();
}

export async function regenerateInviteCode(token: string, blockId: string) {
	const res = await fetch(`${API_URL}/blocks/${blockId}/regenerate-code`, {
		method: "PATCH",
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to regenerate code");
	return res.json();
}

export async function deleteBlock(
	token: string,
	blockId: string,
	password: string,
) {
	const res = await fetch(`${API_URL}/blocks/${blockId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ password }),
	});

	const text = await res.text();

	if (!res.ok) {
		try {
			const err = JSON.parse(text);
			throw new Error(err.message || "Failed to delete block");
		} catch (e) {
			throw new Error(text || "Failed to delete block");
		}
	}

	try {
		return JSON.parse(text);
	} catch (e) {
		return { message: "Block deleted successfully" };
	}
}
