import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

type OnboardingContextType = {
	hasCompletedOnboarding: boolean;
	completeOnboarding: () => Promise<void>;
	loading: boolean;
};

export const OnboardingContext = createContext<
	OnboardingContextType | undefined
>(undefined);

export const OnboardingProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkOnboardingStatus();
	}, []);

	const checkOnboardingStatus = async () => {
		try {
			const status = await AsyncStorage.getItem("hasCompletedOnboarding");
			setHasCompletedOnboarding(status === "true");
		} catch (error) {
			console.error("Error checking onboarding status:", error);
		} finally {
			setLoading(false);
		}
	};

	const completeOnboarding = async () => {
		try {
			await AsyncStorage.setItem("hasCompletedOnboarding", "true");
			setHasCompletedOnboarding(true);
		} catch (error) {
			console.error("Error saving onboarding status:", error);
		}
	};

	return (
		<OnboardingContext.Provider
			value={{ hasCompletedOnboarding, completeOnboarding, loading }}
		>
			{children}
		</OnboardingContext.Provider>
	);
};
