import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function DashboardSkeleton() {
	const fadeAnim = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 0.7,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(fadeAnim, {
					toValue: 0.3,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, []);

	const SkeletonItem = ({ style }) => (
		<Animated.View
			style={[
				{
					backgroundColor: "rgba(255,255,255,0.1)",
					borderRadius: 16,
					opacity: fadeAnim,
				},
				style,
			]}
		/>
	);

	return (
		<LinearGradient
			colors={["#0A0F1E", "#1A1F32", "#2A2F45"]}
			style={{ flex: 1 }}
		>
			<View style={{ padding: 16 }}>
				<SkeletonItem style={{ height: 40, width: 200, marginBottom: 24 }} />

				<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
					<SkeletonItem style={{ width: "48%", height: 100 }} />
					<SkeletonItem style={{ width: "48%", height: 100 }} />
					<SkeletonItem style={{ width: "48%", height: 100 }} />
					<SkeletonItem style={{ width: "48%", height: 100 }} />
				</View>

				<SkeletonItem style={{ height: 150, marginTop: 16 }} />
				<SkeletonItem style={{ height: 200, marginTop: 16 }} />
				<SkeletonItem style={{ height: 120, marginTop: 16 }} />
			</View>
		</LinearGradient>
	);
}
