export interface UserProfile {
	_id: string;
	name: string;
	email: string;
	role: "ADMIN" | "STUDENT";
	status?: "ACTIVE" | "LEFT" | "TRANSFERRED";
	rollNo?: string;
	dateOfBirth?: string;
	phoneNumber?: string;
	branch?: "IT" | "CS" | "ECE" | "EE" | "ME" | "CE" | "OTHER";
	joiningDate?: string;
	block?: {
		_id: string;
		name: string;
	};
	room?: {
		_id: string;
		roomNumber: string;
	};
	createdAt: string;
}

export interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
