export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface Complaint {
	_id: string;
	student: {
		_id: string;
		name: string;
		email: string;
		rollNo?: string;
		room?: {
			roomNumber: string;
		};
		block?: {
			name: string;
		};
	};
	category: string;
	description: string;
	status: ComplaintStatus;
	createdAt: string;
	updatedAt: string;
}

export interface CreateComplaintData {
	category: string;
	description: string;
}

export interface UpdateComplaintStatusData {
	status: ComplaintStatus;
}

export const COMPLAINT_CATEGORIES = [
	"Maintenance",
	"Electrical",
	"Plumbing",
	"Cleaning",
	"Noise",
	"Security",
	"Internet",
	"Food Quality",
	"Cleanliness",
	"Other",
] as const;

export const COMPLAINT_STATUS_COLORS = {
	OPEN: "#e70c0c",
	IN_PROGRESS: "#F59E0B",
	RESOLVED: "#4ADE80",
} as const;

export const COMPLAINT_STATUS_BACKGROUND = {
	OPEN: "#e70c0c",
	IN_PROGRESS: "#F59E0B",
	RESOLVED: "#4ADE80",
} as const;

export const COMPLAINT_STATUS_LABELS = {
	OPEN: "Open",
	IN_PROGRESS: "In Progress",
	RESOLVED: "Resolved",
} as const;

export const COMPLAINT_STATUS_ICONS = {
	OPEN: "exclamation-circle",
	IN_PROGRESS: "clock-o",
	RESOLVED: "check-circle",
} as const;
