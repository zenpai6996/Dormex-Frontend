import z from "zod";
export const BlockStatSchema = z.object({
	blockId: z.string(),
	blockName: z.string(),
	totalStudents: z.number(),
	totalRooms: z.number(),
	occupiedRooms: z.number(),
	vacantRooms: z.number(),
	totalCapacity: z.number(),
	occupiedSeats: z.number(),
	availableSeats: z.number(),
	inviteCodeExpiresAt: z.string().nullable().optional(),
});
export const AdminDashboardSchema = z.object({
	role: z.literal("ADMIN"),

	students: z.object({
		total: z.number(),
		active: z.number(),
	}),

	rooms: z.object({
		total: z.number(),
		occupied: z.number(),
		vacant: z.number(),
	}),

	complaints: z.object({
		total: z.number(),
		open: z.number(),
		inProgress: z.number(),
		resolved: z.number(),
	}),

	blocks: z.object({
		total: z.number(),
		blockStats: z.array(BlockStatSchema),
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
