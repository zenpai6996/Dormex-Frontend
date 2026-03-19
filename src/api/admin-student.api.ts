const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createStudentByAdmin(
	token: string,
	data: {
		name: string;
		email: string;
		rollNo: string;
		dateOfBirth: string;
		phoneNumber: string;
		branch: string;
		blockId?: string;
		generateRandomPassword: boolean;
		password?: string;
	},
) {
	const res = await fetch(`${API_URL}/admin-students/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	const response = await res.json();

	if (!res.ok) {
		throw new Error(response.message || "Failed to create student");
	}

	return response;
}

export async function getAllStudents(
	token: string,
	filters?: {
		branch?: string;
		block?: string;
		status?: string;
		search?: string;
	},
) {
	const queryParams = new URLSearchParams(filters as any).toString();
	const url = `${API_URL}/admin-students${queryParams ? `?${queryParams}` : ""}`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to fetch students");
	}

	return res.json();
}

export async function updateStudentByAdmin(
	token: string,
	studentId: string,
	data: any,
) {
	const res = await fetch(`${API_URL}/admin-students/${studentId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || "Failed to update student");
	}

	return res.json();
}
