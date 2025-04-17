import type { IncomingMessage, ServerResponse } from "http";
import { authenticateToken, type authenticadedRequest } from "../middleware/autentication";
import { addCharacter, CharacterSchema, getCharacterById, HttpMethod, Role, type Character } from "../models";
import { authorizedRoles } from "../middleware/authorization";
import { parseBody } from "../utils/parseBody";
import { safeParse } from "valibot";

export const characterRouter = async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    if (! await authenticateToken(req as authenticadedRequest, res)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Unauthorized" }))
    }

    if (url === "/characters/" && method === HttpMethod.GET) {
        const id = parseInt(url.split("/").pop() as string, 10)
        const character = getCharacterById(id);
        if (!character) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Character not found" }));
            return
        }
        res.statusCode = 200;
        res.end(JSON.stringify(character))
        return
    }

    if (url === "/characters" && method === HttpMethod.POST) {
        if (!(await authorizedRoles(Role.ADMIN, Role.USER)(req as authenticadedRequest, res))) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbiden" }))
        }

        const body = await parseBody(req)
        const result = safeParse(CharacterSchema, body)

        if (result.issues) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: result.issues }))
        }
        const character: Character = body();
        addCharacter(character);
        res.statusCode = 201;
        res.end(JSON.stringify(character));
        return
    }
}