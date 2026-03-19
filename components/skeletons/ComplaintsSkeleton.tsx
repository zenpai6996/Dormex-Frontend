import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function ComplaintsSkeleton() {
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

	const SkeletonItem = ({ style }: { style?: object }) => (
		<Animated.View
			style={[
				{
					backgroundColor: "rgba(255,255,255,0.1)",
					borderRadius: 12,
					opacity: fadeAnim,
				},
				style,
			]}
		/>
	);

	return (
		<LinearGradient
			colors={["#0A0F1E", "#0A0F1E", "#0A0F1E"]}
			style={{ flex: 1 }}
		>
			<View style={{ padding: 16, paddingTop: 60 }}>
				<SkeletonItem style={{ height: 28, width: 170, marginBottom: 8 }} />
				<SkeletonItem style={{ height: 14, width: 240, marginBottom: 20 }} />

				<View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
					{Array.from({ length: 4 }).map((_, index) => (
						<SkeletonItem
							key={index}
							style={{ height: 50, flex: 1, borderRadius: 14 }}
						/>
					))}
				</View>

				<SkeletonItem style={{ height: 130, borderRadius: 16 }} />
				<SkeletonItem
					style={{ height: 130, marginTop: 12, borderRadius: 16 }}
				/>
				<SkeletonItem
					style={{ height: 130, marginTop: 12, borderRadius: 16 }}
				/>
			</View>
		</LinearGradient>
	);
}
