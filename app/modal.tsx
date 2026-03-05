import AdminProfileModal from "@/components/profile/AdminProfileModal";
import StudentProfileModal from "@/components/profile/StudentProfileModal";
import { fetchProfile } from "@/src/api/profile.api";
import { useAuth } from "@/src/context/AuthContext";
import { UserProfile } from "@/src/types/profile.types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ModalScreen() {
	const { token, role } = useAuth();
	const router = useRouter();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (token) {
			loadProfile();
		}
	}, [token]);

	const loadProfile = async () => {
		setLoading(true);
		try {
			const data = await fetchProfile(token!);
			setProfile(data);
		} catch (error) {
			console.error("Failed to load profile", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		router.back();
	};

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#0A0F1E",
				}}
			>
				<ActivityIndicator size="large" color="#FFCC00" />
			</View>
		);
	}

	if (role === "ADMIN") {
		return (
			<AdminProfileModal
				onClose={handleClose}
				profile={profile}
				loading={loading}
			/>
		);
	}

	return (
		<StudentProfileModal
			onClose={handleClose}
			profile={profile}
			loading={loading}
		/>
	);
}
