import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
	user: any;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const API = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const token = await AsyncStorage.getItem("token");
				const role = await AsyncStorage.getItem("role");

				if (token) {
					API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
					setUser({ token, role });
				}
			} catch (error) {
				console.log("Error loading user:", error);
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, []);

	const login = async (email: string, password: string) => {
		const res = await API.post("/auth/login", { email, password });

		await AsyncStorage.setItem("token", res.data.token);
		await AsyncStorage.setItem("role", res.data.role);

		API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

		setUser(res.data);
	};

	const register = async (name: string, email: string, password: string) => {
		await API.post("/auth/register", { name, email, password });
	};

	const logout = async () => {
		await AsyncStorage.clear();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
