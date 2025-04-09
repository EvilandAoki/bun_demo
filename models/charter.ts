import { minLength, object, pipe, string, type InferInput } from "valibot";

export const CharacterSchema = object({
    name: pipe(string(), minLength(6)),
    lastname: pipe(string(), minLength(6))
})

export type Character = InferInput<typeof CharacterSchema> & { id: number };

const characters: Map<number, Character> = new Map();

export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values())
}
export const getCharacterById = (id: number): Character | undefined => {
    return characters.get(id)
}