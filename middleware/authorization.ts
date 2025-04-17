import type { ServerResponse } from "http"
import type { authenticadedRequest } from "./autentication"
import type { User } from "../models"

export const authorizedRoles = (...roles: string[]) => {
    return async (
        req: authenticadedRequest,
        res: ServerResponse,
    ): Promise<boolean> => {
        const userRole = (req.user as User).role

        if (!userRole || !roles.includes(userRole)) {
            res.statusCode = 403
            res.end(JSON.stringify({ message: "Forbiden" }))
            return false
        }
        return true
    }
}