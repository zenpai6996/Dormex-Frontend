import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
	token: string | null;
	role: "ADMIN" | "STUDENT" | null;
	login: (token: string, role: "ADMIN" | "STUDENT") => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadAuth();
	}, []);

	async function loadAuth() {
		const storedToken = await AsyncStorage.getItem("token");
		const storedRole = await AsyncStorage.getItem("role");

		if (storedToken && storedRole) {
			setToken(storedToken);
			setRole(storedRole as "ADMIN" | "STUDENT");
		}

		setLoading(false);
	}

	async function login(newToken: string, newRole: "ADMIN" | "STUDENT") {
		await AsyncStorage.setItem("token", newToken);
		await AsyncStorage.setItem("role", newRole);

		setToken(newToken);
		setRole(newRole);
	}

	async function logout() {
		await AsyncStorage.removeItem("token");
		await AsyncStorage.removeItem("role");

		setToken(null);
		setRole(null);
	}

	return (
		<AuthContext.Provider value={{ token, role, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return context;
};
