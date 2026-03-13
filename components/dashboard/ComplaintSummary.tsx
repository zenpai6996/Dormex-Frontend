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
				borderRadius: 16,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 16,
				marginBottom: 16,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					marginBottom: 16,
				}}
			>
				<View style={{ alignItems: "center" }}>
					<Text style={{ color: "#EF4444", fontSize: 24, fontWeight: "bold" }}>
						{open}
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Open</Text>
				</View>
				<View style={{ alignItems: "center" }}>
					<Text style={{ color: "#FFCC00", fontSize: 24, fontWeight: "bold" }}>
						{inProgress}
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 12 }}>In Progress</Text>
				</View>
				<View style={{ alignItems: "center" }}>
					<Text style={{ color: "#4ADE80", fontSize: 24, fontWeight: "bold" }}>
						{resolved}
					</Text>
					<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Resolved</Text>
				</View>
			</View>

			{/* Progress bars */}
			<View style={{ marginTop: 8 }}>
				<View style={{ marginBottom: 8 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginBottom: 4,
						}}
					>
						<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Open</Text>
						<Text style={{ color: "#EF4444", fontSize: 12 }}>
							{openPercentage}%
						</Text>
					</View>
					<View
						style={{
							height: 4,
							backgroundColor: "rgba(255,255,255,0.1)",
							borderRadius: 2,
						}}
					>
						<View
							style={{
								width: `${openPercentage}%`,
								height: "100%",
								backgroundColor: "#EF4444",
								borderRadius: 2,
							}}
						/>
					</View>
				</View>

				<View style={{ marginBottom: 8 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginBottom: 4,
						}}
					>
						<Text style={{ color: "#9CA3AF", fontSize: 12 }}>In Progress</Text>
						<Text style={{ color: "#FFCC00", fontSize: 12 }}>
							{inProgressPercentage}%
						</Text>
					</View>
					<View
						style={{
							height: 4,
							backgroundColor: "rgba(255,255,255,0.1)",
							borderRadius: 2,
						}}
					>
						<View
							style={{
								width: `${inProgressPercentage}%`,
								height: "100%",
								backgroundColor: "#FFCC00",
								borderRadius: 2,
							}}
						/>
					</View>
				</View>

				<View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginBottom: 4,
						}}
					>
						<Text style={{ color: "#9CA3AF", fontSize: 12 }}>Resolved</Text>
						<Text style={{ color: "#4ADE80", fontSize: 12 }}>
							{resolvedPercentage}%
						</Text>
					</View>
					<View
						style={{
							height: 4,
							backgroundColor: "rgba(255,255,255,0.1)",
							borderRadius: 2,
						}}
					>
						<View
							style={{
								width: `${resolvedPercentage}%`,
								height: "100%",
								backgroundColor: "#4ADE80",
								borderRadius: 2,
							}}
						/>
					</View>
				</View>
			</View>
		</LinearGradient>
	);
}
