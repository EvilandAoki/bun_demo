import { minLength, object, pipe, string, type InferInput } from "valibot";

export const CharacterSchema = object({
    name: pipe(string(), minLength(6)),
    lastname: pipe(string(), minLength(6))
})

export type Character = InferInput<typeof CharacterSchema> & { id: number };

const characters: Map<number, Character> = new Map();

export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values());
}
export const getCharacterById = (id: number): Character | undefined => {
    return characters.get(id);
}

export const addCharacter = (character: Character): Character => {

    if (character.id && !characters.has(character.id)) {
        console.error("character with id", character.id, "already exist");
        return character
    }

    const newCharecter = {
        ...character,
        id: new Date().getTime()
    }

    characters.set(newCharecter.id, newCharecter);

    return newCharecter;
}

export const updateCharcter = (id: number, updateCharcter: Character): Character | null => {
    if (!characters.has(id)) {
        console.error('Character with id', id, 'not found')
        return null
    }

    characters.set(id, updateCharcter);
    return updateCharcter;
}

export const deleteCharacter = (id: number): boolean => {
    if (!characters.has(id)) {
        console.error('Character with id', id, 'not found')
        return false
    }

    characters.delete(id);
    return true
}