import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface MenuItem {
	icon: string;
	label: string;
	value: string;
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
	const router = useRouter();
	const items: MenuItem[] = [
		{ icon: "coffee", label: "Breakfast", value: breakfast },
		{ icon: "sun-o", label: "Lunch", value: lunch },
		{ icon: "moon-o", label: "Dinner", value: dinner },
	];

	return (
		<Pressable
			onPress={() => router.push({ pathname: "/(tabs)/two", params: { day } })}
		>
			<LinearGradient
				colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"]}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(255,255,255,0.08)",
					marginBottom: 16,
					overflow: "hidden",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						gap: 10,
						paddingHorizontal: 15,
						paddingTop: 15,
						paddingBottom: 14,
						borderBottomWidth: 1,
						borderBottomColor: "rgba(255,255,255,0.06)",
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
						<View
							style={{
								width: 32,
								height: 32,
								borderRadius: 20,
								backgroundColor: "rgba(74,222,128,0.12)",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<FontAwesome name="cutlery" size={14} color="#4ADE80" />
						</View>
						<Text
							style={{
								color: "white",
								fontSize: 15,
								fontWeight: "700",
								letterSpacing: 0.2,
							}}
						>
							Today's Menu
						</Text>
					</View>

					<View
						style={{
							backgroundColor: "rgba(255,255,255,0.06)",
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderRadius: 20,
						}}
					>
						<Text
							style={{
								color: "#9CA3AF",
								fontSize: 11,
								fontWeight: "500",
								letterSpacing: 0.4,
							}}
						>
							{day}
						</Text>
					</View>
				</View>

				<View style={{ paddingHorizontal: 18, paddingVertical: 6 }}>
					{items.map((item, index) => (
						<View
							key={item.label}
							style={{
								flexDirection: "row",
								paddingVertical: 13,
								borderBottomWidth: index < items.length - 1 ? 1 : 0,
								borderBottomColor: "rgba(255,255,255,0.04)",
							}}
						>
							<View
								style={{
									alignItems: "center",
									marginRight: 14,
									paddingTop: 2,
								}}
							>
								<View
									style={{
										width: 3,
										height: "100%",
										position: "absolute",
										left: -18,
										backgroundColor: "rgba(245,158,11,0.5)",
										borderRadius: 2,
										top: -1,
									}}
								/>
								<View
									style={{
										width: 30,
										height: 30,
										borderRadius: 20,
										backgroundColor: "rgba(245,158,11,0.1)",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FontAwesome
										name={item.icon as any}
										size={13}
										color={"#F59E0B"}
									/>
								</View>
							</View>

							<View style={{ flex: 1 }}>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: 7,
									}}
								>
									<Text
										style={{
											color: "#d8b817",
											fontSize: 12,
											fontWeight: "600",
											letterSpacing: 0.8,
											textTransform: "uppercase",
										}}
									>
										{item.label}
									</Text>
								</View>

								{item.value && item.value.includes(",") ? (
									<View
										style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}
									>
										{item.value.split(",").map((val: string, idx: number) => {
											const trimmedVal = val.trim();
											if (!trimmedVal) return null;
											return (
												<View
													key={idx}
													style={{
														backgroundColor: "rgba(255,255,255,0.05)",
														paddingHorizontal: 10,
														paddingVertical: 3,
														borderRadius: 6,
														borderWidth: 1,
														borderColor: "rgba(255,255,255,0.08)",
													}}
												>
													<Text
														style={{
															color: "rgba(255,255,255,0.85)",
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
											color: item.value ? "rgba(255,255,255,0.82)" : "#374151",
											fontSize: 14,
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
				</View>
			</LinearGradient>
		</Pressable>
	);
}
