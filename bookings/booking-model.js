import pool from "../db-config.js";

export const findUpcomingBookingByUserId = async (userId) => {
    const query = `SELECT 
                    coach.name as coach_name, 
                    student.name as student_name,
                    coach.phone as coach_phone,
                    student.phone as student_phone,
                    bookings.scheduled_time,
                    bookings.status,
                    slots.slot_date as date
                FROM bookings
                INNER JOIN users coach ON coach.id = bookings.coach_id
                INNER JOIN users student ON student.id = bookings.student_id
                INNER JOIN slots ON slots.id = bookings.slot_id
                WHERE slots.slot_date >= CURRENT_DATE AND (coach.id = $1 OR student.id = $1) `

    const result = await pool.query(query, [userId])
    return result.rows
}

export const findPastBookingByUserId = async (userId) => {
    const query = `SELECT 
                    bookings.id,
                    coach.name as coach_name, 
                    student.name as student_name,
                    coach.phone as coach_phone,
                    student.phone as student_phone,
                    bookings.scheduled_time,
                    bookings.status,
                    slots.slot_date as date
                FROM bookings
                INNER JOIN users coach ON coach.id = bookings.coach_id
                INNER JOIN users student ON student.id = bookings.student_id
                INNER JOIN slots ON slots.id = bookings.slot_id
                WHERE slots.slot_date <= CURRENT_DATE AND bookings.scheduled_time <= localtime AND (coach.id = $1 OR student.id = $1) `

    const result = await pool.query(query, [userId])
    return result.rows
}

export const findBookingById = async (id) => {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id])
    return result.rows
}

export const createBooking = async (slotDetails, studentId) => {
    const result = await pool.query('INSERT INTO bookings (slot_id, coach_id, student_id, scheduled_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
                                    [slotDetails.id, slotDetails.coach_id, studentId, slotDetails.start_time, "SCHEDULED"])
    return result.rows[0].id
}