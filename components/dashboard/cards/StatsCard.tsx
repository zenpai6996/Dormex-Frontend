import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface StatsCardProps {
	label: string;
	value: string | number;
	icon?: string;
	gradient?: boolean;
	trend?: {
		value: number;
		label: string;
	};
}

export default function StatsCard({
	label,
	value,
	icon,
	gradient = false,
	trend,
}: StatsCardProps) {
	const CardContent = () => (
		<View style={{ padding: 16 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "#aaa", fontSize: 14 }}>{label}</Text>
				{icon && <Text style={{ color: "#FFCC00", fontSize: 18 }}>{icon}</Text>}
			</View>
			<Text
				style={{
					color: "white",
					fontSize: 28,
					fontWeight: "bold",
					marginTop: 8,
				}}
			>
				{value}
				{trend && (
					<View
						style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
					>
						<Text
							style={{
								color: trend.value > 0 ? "#4ADE80" : "#F87171",
								fontSize: 12,
								marginLeft: 30,
								marginTop: 10,
							}}
						>
							{trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
						</Text>
						<Text
							style={{
								color: "#666",
								marginLeft: 2,
								marginTop: 10,
								fontSize: 12,
							}}
						>
							{trend.label}
						</Text>
					</View>
				)}
			</Text>
		</View>
	);

	if (gradient) {
		return (
			<LinearGradient
				colors={["rgba(255,204,0,0.15)", "rgba(255,204,0,0.05)"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(255,204,0,0.2)",
					overflow: "hidden",
				}}
			>
				<CardContent />
			</LinearGradient>
		);
	}

	return (
		<View
			style={{
				borderRadius: 16,
				backgroundColor: "rgba(255,255,255,0.05)",
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				overflow: "hidden",
			}}
		>
			<CardContent />
		</View>
	);
}
