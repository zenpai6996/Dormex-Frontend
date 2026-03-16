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

export async function removeStudentFromBlock(token: string, studentId: string) {
	const res = await fetch(`${API_URL}/joinBlock/remove-student`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ studentId }),
	});

	const text = await res.text();

	if (!res.ok) {
		try {
			const err = JSON.parse(text);
			throw new Error(err.message || "Failed to remove student from block");
		} catch (e) {
			throw new Error(text || "Failed to remove student from block");
		}
	}

	try {
		return JSON.parse(text);
	} catch (e) {
		return { message: "Student removed from block successfully" };
	}
}
