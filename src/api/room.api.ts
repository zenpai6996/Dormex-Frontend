const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchRoomsByBlock(token: string, blockId: string) {
	const res = await fetch(`${API_URL}/rooms/block/${blockId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to fetch rooms");
	return res.json();
}

export async function createRoom(
	token: string,
	data: { blockId: string; roomNumber: string; capacity: number },
) {
	const res = await fetch(`${API_URL}/rooms`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Failed to create room");
	}
	return res.json();
}

export async function assignStudentToRoom(
	token: string,
	data: { roomId: string; studentId: string },
) {
	const res = await fetch(`${API_URL}/rooms/assign`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Failed to assign student");
	}
	return res.json();
}

export async function removeStudentFromRoom(token: string, studentId: string) {
	const res = await fetch(`${API_URL}/rooms/remove`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ studentId }),
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Failed to remove student");
	}
	return res.json();
}

export async function deleteRoom(token: string, roomId: string) {
	const res = await fetch(`${API_URL}/rooms/${roomId}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Failed to delete room");
	}
	return res.json();
}
