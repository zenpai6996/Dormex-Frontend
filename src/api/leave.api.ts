import {
	CreateLeaveData,
	LeaveApplication,
	LeaveStatus,
	UpdateLeaveStatusData,
} from "@/src/types/leave.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchLeaves(
	token: string,
	filters?: { status?: LeaveStatus },
): Promise<LeaveApplication[]> {
	const queryParams = filters?.status
		? `?status=${encodeURIComponent(filters.status)}`
		: "";
	const res = await fetch(`${API_URL}/leaves${queryParams}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to fetch leaves");
	}
	return res.json();
}

export async function createLeave(
	token: string,
	data: CreateLeaveData,
): Promise<LeaveApplication> {
	const res = await fetch(`${API_URL}/leaves`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to create leave");
	}

	return res.json();
}

export async function updateLeaveStatus(
	token: string,
	leaveId: string,
	data: UpdateLeaveStatusData,
): Promise<LeaveApplication> {
	const res = await fetch(`${API_URL}/leaves/${leaveId}/status`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to update leave status");
	}

	return res.json();
}

export async function deleteLeave(
	token: string,
	leaveId: string,
): Promise<{ message: string }> {
	const res = await fetch(`${API_URL}/leaves/${leaveId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const text = await res.text();
	if (!res.ok) {
		throw new Error(text || "Failed to delete leave");
	}

	try {
		return JSON.parse(text);
	} catch (e) {
		return { message: "Leave application deleted" };
	}
}
