import { MessMenuFormData, MessMenuItem } from "../types/mess.types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchMessMenu(token: string): Promise<MessMenuItem[]> {
	const res = await fetch(`${BASE_URL}/mess`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to fetch mess menu");
	}

	return res.json();
}

export async function createMessMenu(
	token: string,
	data: MessMenuFormData,
): Promise<MessMenuItem> {
	const res = await fetch(`${BASE_URL}/mess`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("Failed to create mess menu");
	}

	return res.json();
}

export async function updateMessMenu(
	token: string,
	id: string,
	data: MessMenuFormData,
): Promise<MessMenuItem> {
	const res = await fetch(`${BASE_URL}/mess/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("Failed to update mess menu");
	}

	return res.json();
}
