import { FontAwesome } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	action?: {
		label?: string;
		onPress: () => void;
		icon?: string;
	};
}

export default function SectionHeader({
	title,
	subtitle,
	action,
}: SectionHeaderProps) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: 12,
			}}
		>
			<View>
				<Text
					style={{
						color: "white",
						fontSize: 18,
						fontWeight: "600",
					}}
				>
					{title}
				</Text>
				{subtitle && (
					<Text
						style={{
							color: "#9CA3AF",
							fontSize: 13,
							marginTop: 2,
						}}
					>
						{subtitle}
					</Text>
				)}
			</View>
			{action && (
				<Pressable
					onPress={action.onPress}
					style={({ pressed }) => ({
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: pressed
							? "rgba(255,204,0,0.2)"
							: "rgba(255,204,0,0.1)",
						paddingHorizontal: 15,
						paddingVertical: 12,
						borderRadius: 20,
						transform: [{ scale: pressed ? 0.98 : 1 }],
						borderColor: "#FFCC00",
						borderWidth: pressed ? 1 : 0.5,
					})}
				>
					{action.icon && (
						<FontAwesome
							name={action.icon as any}
							size={20}
							color="#FFCC00"
							style={{ marginRight: 0 }}
						/>
					)}
					<Text
						style={{
							color: "#FFCC00",
							fontSize: 13,
							fontWeight: "500",
						}}
					>
						{action.label}
					</Text>
				</Pressable>
			)}
		</View>
	);
}
