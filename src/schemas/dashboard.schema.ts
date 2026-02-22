import { z } from "zod";
import { AdminDashboardSchema } from "./admin.dashboard.schema";
import { StudentDashboardSchema } from "./student.dashboard.schema";

export const DashboardSchema = z.union([
	AdminDashboardSchema,
	StudentDashboardSchema,
]);

export type DashboardType = z.infer<typeof DashboardSchema>;
