import z from "zod";

export const StudentDashboardSchema = z.object({
	role: z.literal("STUDENT"),

	student: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		status: z.string(),
		block: z.any().nullable(),
		room: z.any().nullable(),
	}),

	todayMenu: z
		.object({
			day: z.string(),
			breakfast: z.string(),
			lunch: z.string(),
			dinner: z.string(),
		})
		.nullable(),
});
