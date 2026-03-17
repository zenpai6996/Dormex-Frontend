// src/context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
	token: string | null;
	role: "ADMIN" | "STUDENT" | null;
	login: (token: string, role: "ADMIN" | "STUDENT") => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
	isAuthenticated: boolean; // Add this
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this

	useEffect(() => {
		loadAuth();
	}, []);

	async function loadAuth() {
		try {
			const storedToken = await AsyncStorage.getItem("token");
			const storedRole = await AsyncStorage.getItem("role");

			if (storedToken && storedRole) {
				setToken(storedToken);
				setRole(storedRole as "ADMIN" | "STUDENT");
				setIsAuthenticated(true);
			}
		} catch (error) {
			console.error("Auth load error:", error);
		} finally {
			// Add a small delay to ensure state is settled
			setTimeout(() => {
				setLoading(false);
			}, 100);
		}
	}

	async function login(newToken: string, newRole: "ADMIN" | "STUDENT") {
		try {
			await AsyncStorage.setItem("token", newToken);
			await AsyncStorage.setItem("role", newRole);

			setToken(newToken);
			setRole(newRole);
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	async function logout() {
		try {
			await AsyncStorage.removeItem("token");
			await AsyncStorage.removeItem("role");

			setToken(null);
			setRole(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
	}

	return (
		<AuthContext.Provider
			value={{ token, role, login, logout, loading, isAuthenticated }}
		>
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
