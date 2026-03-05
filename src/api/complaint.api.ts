import {
	Complaint,
	CreateComplaintData,
	UpdateComplaintStatusData,
} from "@/src/types/complaint.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchComplaints(token: string): Promise<Complaint[]> {
	const res = await fetch(`${API_URL}/complaints`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to fetch complaints");
	}
	return res.json();
}

export async function createComplaint(
	token: string,
	data: CreateComplaintData,
): Promise<Complaint> {
	const res = await fetch(`${API_URL}/complaints`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to create complaint");
	}
	return res.json();
}

export async function updateComplaintStatus(
	token: string,
	complaintId: string,
	data: UpdateComplaintStatusData,
): Promise<Complaint> {
	const res = await fetch(`${API_URL}/complaints/${complaintId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to update complaint status");
	}
	return res.json();
}

export async function deleteComplaint(
	token: string,
	complaintId: string,
): Promise<{ message: string }> {
	const res = await fetch(`${API_URL}/complaints/${complaintId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to delete complaint");
	}

	try {
		return await res.json();
	} catch (e) {
		return { message: "Complaint deleted successfully" };
	}
}
