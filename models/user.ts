import { compare, hash } from "bcrypt";
import { email, minLength, object, pipe, string, type InferInput } from "valibot";


const emailSchema = pipe(string(), email())
const passwordSchema = pipe(string(), minLength(6))

export enum Role {
    "ADMIN" = "admin",
    "USER" = "user"
}

export const authSchema = object({
    email: emailSchema,
    password: passwordSchema
})

export type User = InferInput<typeof authSchema> & {
    id: number;
    role: Role,
    refreshToken?: string
}

const users: Map<string, User> = new Map();

/**
 * creates a new user with given email and password
 * the password is a hashed before storing
 * @param {string} email - THe email of the user
 * @param {string} password - THe password of the user
 * @returns {Promise<User>} - the Created user
 */

export const createUser = async (
    email: string,
    password: string
): Promise<User> => {
    const hashedPassword = await hash(password, 10)

    const newUser: User = {
        id: Date.now(),
        email,
        password: hashedPassword,
        role: Role.USER
    }
    users.set(email, newUser);
    return newUser;
}

/**
 * Finds user by their given email.
 * @param {string} email - The email of the user to find.
 * @return {User | undefined} -  the user if found, othervise undefined.
 */

export const findUserbyEmail = (email: string): User | undefined => {
    return users.get(email)
}

/**
 * Validates user's password
 * 
 * @param {User} user - the user whase password is to be validated
 * @param {string} password - The password to validate
 * @returns {promise<boolean>} - true if password is valid, otherwise false
 */

export const validatePassword = async (user: User, password: string): Promise<boolean> => {
    return compare(password, user.password)
}

/**
 * revoque Token
 * @param {string} email - The email of the user to remove the token.
 * @return {boolean} - true if the token is revoked, otherwise false.
 */

export const revokeUserToken = (email: string): boolean => {
    const foundUser = users.get(email)
    if (!foundUser) {
        return false
    }
    users.set(email, { ...foundUser, refreshToken: undefined })
    return true
}