import { Text, View } from "react-native";

interface EmptyStateProps {
	message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ color: "#888" }}>{message}</Text>
		</View>
	);
}
