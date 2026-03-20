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
	const cleanedFilters: Record<string, string> = {};
	if (filters) {
		Object.entries(filters).forEach(([key, value]) => {
			if (value && value !== "undefined") {
				cleanedFilters[key] = value;
			}
		});
	}
	const queryParams = new URLSearchParams(cleanedFilters).toString();
	const url = `${API_URL}/admin-students${queryParams ? `?${queryParams}` : ""}`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		try {
			const err = JSON.parse(text);
			throw new Error(err.message || "Failed to fetch students");
		} catch (error) {
			throw new Error(text || "Failed to fetch students");
		}
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

export async function deleteStudentByAdmin(
	token: string,
	studentId: string,
	password: string,
) {
	const res = await fetch(`${API_URL}/admin-students/${studentId}`, {
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
			throw new Error(err.message || "Failed to delete student");
		} catch (error) {
			throw new Error(text || "Failed to delete student");
		}
	}

	try {
		return JSON.parse(text);
	} catch (error) {
		return { message: "Student deleted successfully" };
	}
}
