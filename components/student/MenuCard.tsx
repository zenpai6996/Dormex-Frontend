import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface MenuItem {
	icon: string;
	label: string;
	value: string;
	color: string;
}

interface MenuCardProps {
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
}

export default function MenuCard({
	day,
	breakfast,
	lunch,
	dinner,
}: MenuCardProps) {
	const items: MenuItem[] = [
		{ icon: "coffee", label: "Breakfast", value: breakfast, color: "#F59E0B" },
		{ icon: "sun-o", label: "Lunch", value: lunch, color: "#EF4444" },
		{ icon: "moon-o", label: "Dinner", value: dinner, color: "#8B5CF6" },
	];

	return (
		<LinearGradient
			colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: "rgba(255,255,255,0.1)",
				padding: 20,
				marginBottom: 16,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<View
					style={{
						width: 48,
						height: 48,
						borderRadius: 12,
						backgroundColor: "rgba(34,197,94,0.1)",
						alignItems: "center",
						justifyContent: "center",
						marginRight: 12,
					}}
				>
					<FontAwesome name="cutlery" size={20} color="#4ADE80" />
				</View>
				<View>
					<Text
						style={{
							color: "white",
							fontSize: 18,
							fontWeight: "bold",
						}}
					>
						Today's Menu
					</Text>
					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 13,
						}}
					>
						{day}
					</Text>
				</View>
			</View>

			<View
				style={{
					height: 1,
					backgroundColor: "rgba(255,255,255,0.1)",
					marginBottom: 16,
				}}
			/>

			{items.map((item, index) => (
				<View
					key={item.label}
					style={{
						flexDirection: "row",
						alignItems: "flex-start",
						paddingVertical: 12,
						borderBottomWidth: index < items.length - 1 ? 1 : 0,
						borderBottomColor: "rgba(255,255,255,0.05)",
					}}
				>
					<View
						style={{
							width: 36,
							height: 36,
							borderRadius: 10,
							backgroundColor: `${item.color}20`,
							alignItems: "center",
							justifyContent: "center",
							marginRight: 12,
							marginTop: 2,
						}}
					>
						<FontAwesome name={item.icon as any} size={14} color={item.color} />
					</View>

					<View style={{ flex: 1 }}>
						<Text
							style={{
								color: "#d8b817",
								fontSize: 18,
								marginBottom: 6,
							}}
						>
							{item.label}
						</Text>

						{item.value && item.value.includes(",") ? (
							<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
								{item.value.split(",").map((val: string, idx: number) => {
									const trimmedVal = val.trim();
									if (!trimmedVal) return null;
									return (
										<View
											key={idx}
											style={{
												backgroundColor: `${item.color}15`,
												paddingHorizontal: 10,
												paddingVertical: 4,
												borderRadius: 12,
												borderWidth: 1,
												borderColor: `${item.color}30`,
											}}
										>
											<Text
												style={{
													color: "white",
													fontSize: 13,
													fontWeight: "500",
												}}
											>
												{trimmedVal}
											</Text>
										</View>
									);
								})}
							</View>
						) : (
							<Text
								style={{
									color: item.value ? "white" : "#6B7280",
									fontSize: 15,
									fontWeight: item.value ? "500" : "400",
									fontStyle: item.value ? "normal" : "italic",
								}}
							>
								{item.value || "Not set"}
							</Text>
						)}
					</View>
				</View>
			))}
		</LinearGradient>
	);
}
