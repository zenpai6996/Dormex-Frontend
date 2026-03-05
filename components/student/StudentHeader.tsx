import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface StudentHeaderProps {
	name: string;
	email: string;
	status: string;
	blockName?: string;
	roomNumber?: string;
}

export default function StudentHeader({
	name,
	email,
	status,
	blockName,
	roomNumber,
}: StudentHeaderProps) {
	return (
		<LinearGradient
			colors={["rgba(255,204,0,0.15)", "rgba(255,204,0,0.05)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,204,0,0.2)",
				padding: 20,
				marginBottom: 20,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				{/* <View
					style={{
						width: 60,
						height: 60,
						borderRadius: 30,
						backgroundColor: "rgba(255,204,0,0.2)",
						alignItems: "center",
						justifyContent: "center",
						marginRight: 16,
					}}
				>
					<Text
						style={{
							color: "#FFCC00",
							fontSize: 24,
							fontWeight: "bold",
						}}
					>
						{name.charAt(0).toUpperCase()}
					</Text>
				</View> */}
				<View style={{ flex: 1 }}>
					<Text
						style={{
							color: "white",
							fontSize: 19,
							fontWeight: "bold",
							marginBottom: 4,
						}}
					>
						Welcome{" "}
						<Text
							style={{
								color: "rgba(230, 190, 28, 0.88)",
								fontSize: 19,
								fontWeight: "bold",
								marginBottom: 4,
							}}
						>
							{name}
						</Text>
					</Text>
					<View
						style={{
							flexDirection: "row",
							gap: 8,
							marginTop: 10,
						}}
					>
						<View
							style={{
								backgroundColor:
									status === "ACTIVE"
										? "rgba(34,197,94,0.2)"
										: "rgba(156,163,175,0.2)",
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									color: status === "ACTIVE" ? "#4ADE80" : "#9CA3AF",
									fontSize: 11,
									fontWeight: "600",
									textTransform: "uppercase",
								}}
							>
								STATUS : {status}
							</Text>
						</View>
						{roomNumber && (
							<View
								style={{
									backgroundColor: "rgba(255,204,0,0.2)",
									paddingHorizontal: 10,
									paddingVertical: 4,
									borderRadius: 8,
								}}
							>
								<Text
									style={{
										color: "#FFCC00",
										fontSize: 11,
										fontWeight: "600",
									}}
								>
									Room {roomNumber}
								</Text>
							</View>
						)}
						{blockName && (
							<View
								style={{
									backgroundColor: "rgba(255,204,0,0.2)",
									paddingHorizontal: 10,
									paddingVertical: 4,
									borderRadius: 8,
								}}
							>
								<Text
									style={{
										color: "#FFCC00",
										fontSize: 11,
										fontWeight: "600",
									}}
								>
									Block {blockName}
								</Text>
							</View>
						)}
					</View>
					{/* <Text
						style={{
							color: "white",
							fontSize: 14,
							marginBottom: 6,
						}}
					>
						Email : {email}
					</Text> */}
				</View>
			</View>
		</LinearGradient>
	);
}
