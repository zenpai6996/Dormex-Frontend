import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface ComplaintsSummaryProps {
	total: number;
	open: number;
	inProgress: number;
	resolved: number;
}

export default function ComplaintsSummary({
	total,
	open,
	inProgress,
	resolved,
}: ComplaintsSummaryProps) {
	const openPercentage = Math.round((open / total) * 100) || 0;
	const inProgressPercentage = Math.round((inProgress / total) * 100) || 0;
	const resolvedPercentage = Math.round((resolved / total) * 100) || 0;

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 20,
				marginBottom: 16,
			}}
		>
			{/* Stat boxes */}
			<View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
				{[
					{
						label: "Open",
						value: open,
						color: "#EF4444",
						bg: "rgba(239, 68, 68, 0.07)",
						border: "rgba(239,68,68,0.2)",
					},
					{
						label: "In Progress",
						value: inProgress,
						color: "#FFCC00",
						bg: "rgba(255,204,0,0.07)",
						border: "rgba(255,204,0,0.2)",
					},
					{
						label: "Resolved",
						value: resolved,
						color: "#4ADE80",
						bg: "rgba(74,222,128,0.07)",
						border: "rgba(74,222,128,0.2)",
					},
				].map((item) => (
					<View
						key={item.label}
						style={{
							flex: 1,
							backgroundColor: item.bg,
							borderRadius: 20,
							borderWidth: 1,
							borderColor: item.border,
							paddingVertical: 14,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: item.color,
								fontSize: 26,
								fontWeight: "700",
								lineHeight: 30,
							}}
						>
							{item.value}
						</Text>
						<Text style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>
							{item.label}
						</Text>
					</View>
				))}
			</View>

			{/* Divider */}
			<View
				style={{
					height: 1,
					backgroundColor: "rgba(255,255,255,0.07)",
					marginBottom: 16,
				}}
			/>

			{/* Progress bars */}
			<View style={{ gap: 10 }}>
				{[
					{ label: "Open", percentage: openPercentage, color: "#EF4444" },
					{
						label: "In Progress",
						percentage: inProgressPercentage,
						color: "#FFCC00",
					},
					{
						label: "Resolved",
						percentage: resolvedPercentage,
						color: "#4ADE80",
					},
				].map((item) => (
					<View key={item.label}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginBottom: 6,
							}}
						>
							<Text style={{ color: "#9CA3AF", fontSize: 12 }}>
								{item.label}
							</Text>
							<Text
								style={{ color: item.color, fontSize: 12, fontWeight: "600" }}
							>
								{item.percentage}%
							</Text>
						</View>
						<View
							style={{
								height: 5,
								backgroundColor: "rgba(255,255,255,0.08)",
								borderRadius: 3,
								overflow: "hidden",
							}}
						>
							<View
								style={{
									width: `${item.percentage}%`,
									height: "100%",
									backgroundColor: item.color,
									borderRadius: 3,
									opacity: 0.85,
								}}
							/>
						</View>
					</View>
				))}
			</View>
		</LinearGradient>
	);
}
