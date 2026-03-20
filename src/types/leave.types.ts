export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveApplication {
	_id: string;
	student?: {
		_id: string;
		name: string;
		email?: string;
		rollNo?: string;
		block?: { name: string } | null;
		room?: { roomNumber: string } | null;
	};
	block?: { name: string } | null;
	room?: { roomNumber: string } | null;
	fromDate: string;
	toDate: string;
	reason: string;
	status: LeaveStatus;
	approvedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateLeaveData {
	fromDate: string;
	toDate: string;
	reason: string;
}

export interface UpdateLeaveStatusData {
	status: LeaveStatus;
}

export const LEAVE_STATUS_COLORS: Record<LeaveStatus, string> = {
	PENDING: "#F59E0B",
	APPROVED: "#4ADE80",
	REJECTED: "#EF4444",
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
	PENDING: "Pending",
	APPROVED: "Approved",
	REJECTED: "Rejected",
};

export const LEAVE_STATUS_ICONS: Record<LeaveStatus, string> = {
	PENDING: "clock-o",
	APPROVED: "check-circle",
	REJECTED: "times-circle",
};
