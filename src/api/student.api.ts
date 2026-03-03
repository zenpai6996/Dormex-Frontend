const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchStudentsByBlock(token: string, blockId: string) {
	const res = await fetch(`${API_URL}/students/block/${blockId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("Failed to fetch students");
	return res.json();
}
