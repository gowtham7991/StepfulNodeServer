import pool from "../db-config.js"

export const createFeedback = async (details) => {
    const result = await pool.query('INSERT INTO feedbacks (booking_id, satisfaction_score, notes) VALUES ($1, $2, $3) RETURNING id', 
                              [details.bookingId, details.score, details.notes])
    return result.rows[0].id
}

export const findFeedbacksByCoach = async (bookingIds) => {
    const query = `SELECT 
                        feedbacks.id as id,
                        feedbacks.booking_id as booking_id,
                        users.name as student_name,
                        slots.slot_date as date,
                        feedbacks.satisfaction_score as score,
                        feedbacks.notes as notes
                    FROM feedbacks
                    INNER JOIN bookings ON bookings.id = feedbacks.booking_id
                    INNER JOIN slots ON slots.id = bookings.slot_id
                    INNER JOIN users ON users.id = bookings.student_id
                    WHERE feedbacks.booking_id = ANY($1)
                    `
    const result = await pool.query(query, [bookingIds])
    return result.rows
}

export const findFeedbackByBookingId = async (bookingId) => {
    const result = await pool.query('SELECT * FROM feedbacks WHERE booking_id = $1', [bookingId])
    return result.rows
}

export const findFeedbackById = async (id) => {
    const result = await pool.query('SELECT * FROM feedbacks WHERE id = $1', [id])
    return result.rows
}


