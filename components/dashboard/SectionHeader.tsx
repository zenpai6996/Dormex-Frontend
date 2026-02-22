import { Text, View } from "react-native";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
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
				marginBottom: 16,
				marginTop: 8,
			}}
		>
			<View>
				<Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
					{title}
				</Text>
				{subtitle && (
					<Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 2 }}>
						{subtitle}
					</Text>
				)}
			</View>
			{action}
		</View>
	);
}
