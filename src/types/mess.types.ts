export interface MessMenuItem {
	_id: string;
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface MessMenuFormData {
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
}

export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";
