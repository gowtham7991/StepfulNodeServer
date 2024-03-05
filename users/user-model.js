import pool from "../db-config.js";

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
}

export const getUserByEmailAndPassword = async (email, password) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    return result.rows;
}

export const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows;
}

export const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows;
}

export const createUser = async (details) => {
    const result = await pool.query('INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5)', 
                                    [details.name, details.email, details.password, details.phone, details.role]);
    return result
}