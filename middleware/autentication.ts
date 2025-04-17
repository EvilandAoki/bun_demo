import type { IncomingMessage, ServerResponse } from "http";
import { verify, type JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import { config } from "../config";

export interface authenticadedRequest extends IncomingMessage {
    user: JwtPayload | string;
}

export const authenticateToken = async (req: authenticadedRequest, res: ServerResponse,): Promise<boolean> => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Unauthorized" }));
        return false;
    }

    if (isTokenRevoked(token)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ message: "forbiden" }));
        return false;
    }

    try {
        const decoded = verify(token, config.jwtSecret);
        req.user = decoded;
        return true;
    } catch (_err) {
        res.statusCode = 403;
        res.end(JSON.stringify({ message: "Forbiden" }))
        return false;
    }

}