import { ChangePasswordData, UserProfile } from "@/src/types/profile.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchProfile(token: string): Promise<UserProfile> {
	const res = await fetch(`${API_URL}/auth/profile`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to fetch profile");
	}

	return res.json();
}
export async function changePassword(
	token: string,
	data: ChangePasswordData,
): Promise<{ message: string }> {
	console.log("Changing password with token:", token.substring(0, 20) + "..."); // Log partial token for debugging

	const res = await fetch(`${API_URL}/auth/change-password`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
			// Don't send confirmPassword to backend
		}),
	});

	const responseText = await res.text();
	console.log("Change password response status:", res.status);
	console.log("Change password response:", responseText);

	if (!res.ok) {
		try {
			const error = JSON.parse(responseText);
			throw new Error(error.message || "Failed to change password");
		} catch (e) {
			throw new Error(responseText || "Failed to change password");
		}
	}

	try {
		return JSON.parse(responseText);
	} catch (e) {
		return { message: "Password changed successfully" };
	}
}
