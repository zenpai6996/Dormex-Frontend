import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Dimensions, Pressable, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

interface TodayMenuProps {
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
}

export default function TodayMenu({
	day,
	breakfast,
	lunch,
	dinner,
}: TodayMenuProps) {
	const router = useRouter();

	const menuSlides = [
		{
			type: "Breakfast",
			items: breakfast,
			icon: "coffee",
			color: "#FFCC00",
		},
		{
			type: "Lunch",
			items: lunch,
			icon: "sun-o",
			color: "#ff7300",
		},
		{
			type: "Dinner",
			items: dinner,
			icon: "moon-o",
			color: "#5100ff",
		},
	];

	const renderSlide = ({ item }: { item: (typeof menuSlides)[0] }) => {
		const items = item.items
			.split(",")
			.map((i) => i.trim())
			.filter((i) => i);

		return (
			<View
				style={{
					alignItems: "center",
					flex: 1,
					paddingHorizontal: 8,
				}}
			>
				{/* Icon and Title */}
				<View style={{ alignItems: "center", marginBottom: 12 }}>
					<View
						style={{
							backgroundColor: "rgba(255,255,255,0.05)",
							width: 60,
							height: 60,
							borderRadius: 30,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
							borderWidth: 1,
							borderColor: "rgba(255,255,255,0.1)",
						}}
					>
						<FontAwesome name={item.icon as any} size={28} color={item.color} />
					</View>
					<Text
						style={{
							color: item.color,
							fontSize: 16,
							fontWeight: "700",
							marginBottom: 2,
						}}
					>
						{item.type}
					</Text>
				</View>

				{/* Menu Items */}
				<View style={{ width: "100%", alignItems: "center" }}>
					{items.length > 0 ? (
						items.map((menuItem, idx) => (
							<View
								key={idx}
								style={{
									backgroundColor: "rgba(255,255,255,0.05)",
									paddingHorizontal: 14,
									paddingVertical: 8,
									borderRadius: 16,
									borderWidth: 1,
									borderColor: "rgba(255,255,255,0.1)",
									marginBottom: 8,
									width: "90%",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color: "white",
										fontSize: 13,
										fontWeight: "500",
										textAlign: "center",
									}}
								>
									{menuItem}
								</Text>
							</View>
						))
					) : (
						<View
							style={{
								backgroundColor: "rgba(255,255,255,0.05)",
								paddingHorizontal: 16,
								paddingVertical: 12,
								borderRadius: 12,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "#6B7280",
									fontSize: 13,
									fontStyle: "italic",
								}}
							>
								Not set for today
							</Text>
						</View>
					)}
				</View>
			</View>
		);
	};

	return (
		<Pressable onPress={() => router.push("/(tabs)/two")}>
			<View
				style={{
					backgroundColor: "rgba(255,255,255,0.03)",
					borderRadius: 20,
					borderWidth: 1,
					borderColor: "rgba(255,255,255,0.1)",
					padding: 16,
					marginBottom: 16,
				}}
			>
				{/* Header */}
				<View
					style={{
						marginBottom: 16,
						paddingHorizontal: 4,
					}}
				>
					<Text
						style={{
							color: "rgba(223, 173, 24, 0.79)",
							fontSize: 15,
							textAlign: "center",
							fontWeight: "600",
							marginRight: 18,
						}}
					>
						{day}
					</Text>
				</View>

				{/* Carousel */}
				<View style={{ alignItems: "center" }}>
					<Carousel
						data={menuSlides}
						renderItem={renderSlide}
						width={screenWidth - 80}
						height={280}
						loop={true}
						autoPlay={true}
						autoPlayInterval={3000}
						style={{
							width: screenWidth - 64,
						}}
					/>
				</View>
			</View>
		</Pressable>
	);
}
