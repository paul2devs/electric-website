import type { Request } from "express";
import type { SafeUser } from "../../users/users.service";
export type AuthRequest = Request & {
    user: SafeUser;
};
