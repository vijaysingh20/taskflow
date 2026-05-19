import z from "zod";

const schema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
}); 
const result = schema.safeParse(process.env);

if(!result.success) {
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
}

export const config = result.data;
export type Config = typeof config;