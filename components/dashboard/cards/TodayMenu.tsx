import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface TodayMenuProps {
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
}

interface MenuItem {
	icon: string;
	label: string;
	value: string;
	color: string;
}

export default function TodayMenu({
	day,
	breakfast,
	lunch,
	dinner,
}: TodayMenuProps) {
	const router = useRouter();

	const items: MenuItem[] = [
		{ icon: "coffee", label: "Breakfast", value: breakfast, color: "#F59E0B" },
		{ icon: "sun-o", label: "Lunch", value: lunch, color: "#F59E0B" },
		{ icon: "moon-o", label: "Dinner", value: dinner, color: "#F59E0B" },
	];

	return (
		<Pressable onPress={() => router.push("/(tabs)/two")}>
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
							borderRadius: 25,
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
							Today's Menu{" "}
							<Text
								style={{
									color: "#9CA3AF",
									fontSize: 13,
								}}
							>
								- {day}
							</Text>
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
								borderRadius: 20,
								backgroundColor: `${item.color}20`,
								alignItems: "center",
								justifyContent: "center",
								marginRight: 12,
								marginTop: 2,
							}}
						>
							<FontAwesome
								name={item.icon as any}
								size={14}
								color={item.color}
							/>
						</View>

						<View style={{ flex: 1 }}>
							<Text
								style={{
									color: "#d8b817",
									fontSize: 15,
									marginBottom: 6,
								}}
							>
								{item.label}
							</Text>

							{item.value && item.value.includes(",") ? (
								<View
									style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
								>
									{item.value.split(",").map((val: string, idx: number) => {
										const trimmedVal = val.trim();
										if (!trimmedVal) return null;
										return (
											<View
												key={idx}
												style={{
													backgroundColor: "#f59f0b00",
													paddingHorizontal: 15,
													paddingVertical: 2,
													borderRadius: 5,
													borderWidth: 1,
													borderColor: `${item.color}30`,
												}}
											>
												<Text
													style={{
														color: "white",
														fontSize: 12,
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
		</Pressable>
	);
}
