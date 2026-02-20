import { OnboardingContext } from "@/context/OnboardingContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext } from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const { width, height } = Dimensions.get("window");

const screen1 = () => {
	const router = useRouter();
	const onboarding = useContext(OnboardingContext);

	const handleDone = async () => {
		await onboarding?.completeOnboarding(); // Mark onboarding as completed
		router.push("/(auth)/register");
	};

	// Custom square dots component (kept exactly as in your file)
	const DotComponent = ({ selected }) => {
		return (
			<View
				style={[
					styles.dot,
					{
						backgroundColor: selected ? "#ffcc00" : "rgba(255,255,255,0.4)",
						width: 8,
					},
				]}
			/>
		);
	};

	// Done button component (using same styling as Next/Skip)
	const DoneButton = ({ ...props }) => {
		return (
			<TouchableOpacity style={styles.button} {...props}>
				<Text style={styles.buttonText}>Done</Text>
			</TouchableOpacity>
		);
	};

	// Skip button component (using same styling as Next/Done)
	const SkipButton = ({ ...props }) => {
		return (
			<TouchableOpacity style={styles.button} {...props}>
				<Text style={styles.buttonText}>Skip</Text>
			</TouchableOpacity>
		);
	};

	// Next button component (using same styling as Skip/Done)
	const NextButton = ({ ...props }) => {
		return (
			<TouchableOpacity style={styles.button} {...props}>
				<Text style={styles.buttonText}>Next</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Onboarding
				onDone={handleDone}
				onSkip={handleDone}
				DoneButtonComponent={DoneButton}
				SkipButtonComponent={SkipButton}
				NextButtonComponent={NextButton}
				DotComponent={DotComponent}
				titleStyles={styles.titleText}
				subTitleStyles={styles.subtitleText}
				containerStyles={{
					paddingHorizontal: 20,
				}}
				imageContainerStyles={{
					paddingBottom: 20,
				}}
				bottomBarHighlight={false}
				bottomBarColor="transparent"
				pages={[
					{
						background: (
							<LinearGradient
								colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
								style={{ flex: 1 }}
							/>
						),
						backgroundColor: "#2A2F45",
						image: (
							<View style={styles.lottie}>
								<LottieView
									source={require("../../assets/animation/House.json")}
									autoPlay
									loop
									style={styles.lottieAnimation}
									resizeMode="cover"
								/>
							</View>
						),
						title: (
							<Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>
								Welcome to Dorm<Text style={{ color: "#FFCC00" }}>Ex</Text>
							</Text>
						),
						subtitle: "Your all in one Hostel Management Tool",
					},
					{
						background: (
							<LinearGradient
								colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
								style={{ flex: 1 }}
							/>
						),
						backgroundColor: "#2A2F45",
						image: (
							<View style={styles.lottie}>
								<LottieView
									source={require("../../assets/animation/Contact.json")}
									autoPlay
									loop
									style={styles.lottieAnimation}
									resizeMode="cover"
								/>
							</View>
						),
						title: "Room Allocation",
						subtitle: "Find your perfect roommate effortlessly",
					},
					{
						background: (
							<LinearGradient
								colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
								style={{ flex: 1 }}
							/>
						),
						backgroundColor: "#2A2F45",
						image: (
							<View style={styles.lottie}>
								<LottieView
									source={require("../../assets/animation/food.json")}
									autoPlay
									loop
									style={styles.lottieAnimation}
									resizeMode="cover"
								/>
							</View>
						),
						title: "Mess Menu",
						subtitle: "Know what you eat in your mess",
					},
					{
						background: (
							<LinearGradient
								colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
								style={{ flex: 1 }}
							/>
						),
						backgroundColor: "#2A2F45",
						image: (
							<View style={styles.lottie}>
								<LottieView
									source={require("../../assets/animation/review.json")}
									autoPlay
									loop
									style={styles.lottieAnimation}
									resizeMode="cover"
								/>
							</View>
						),
						title: "Complaints",
						subtitle: "Voice your concerns and get them resolved",
					},
				]}
			/>
		</View>
	);
};

export default screen1;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	lottie: {
		height: width * 0.9,
		width: width,
		justifyContent: "center",
		alignItems: "center",
	},
	lottie1: {
		height: width * 0.8,
		width: width,
		justifyContent: "center",
		alignItems: "center",
	},
	lottieAnimation: {
		width: "100%",
		height: "100%",
	},
	// Dot styles (kept exactly as in your file)
	dot: {
		height: 8,
		borderRadius: 4,
		marginHorizontal: 4,
	},
	// Unified button style for all buttons (Next, Skip, Done)
	button: {
		marginHorizontal: 20,
		marginBottom: 10,
		paddingHorizontal: 30,
		paddingVertical: 12,
		backgroundColor: "#ffcc00", // Pop of yellow color
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	buttonText: {
		color: "#090040", // Dark blue text for contrast on yellow
		fontSize: 16,
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	// Text styles
	titleText: {
		color: "#fff",
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	subtitleText: {
		color: "rgba(255,255,255,0.9)",
		fontSize: 16,
		textAlign: "center",
		paddingHorizontal: 20,
		lineHeight: 24,
	},
});
