import pool from "../db-config.js";

export const getAllSlots = async () => {
   const result = await pool.query('SELECT * FROM slots')
   return result.rows
}

export const getSlotsById = async (slotId) => {
    const result = await pool.query('SELECT * FROM slots WHERE id = $1', [slotId])
    return result.rows
}

export const getSlotsByCoachId = async (coachId) => {
    const result = await pool.query('SELECT * FROM slots WHERE coach_id = $1', [coachId])
    return result.rows
}

export const getSlotsByDate = async (date) => {
    const query = `SELECT slots.id, slots.slot_date, slots.start_time, slots.is_booked, users.name AS coach_name FROM slots
                   INNER JOIN users ON users.id = slots.coach_id
                   WHERE slot_date = $1`
    const result = await pool.query(query, [date])
    return result.rows
}

export const getSlotsByDateAndCoach = async (date, coach) => {
    const result = await pool.query('SELECT * FROM slots WHERE slot_date = $1 AND coach_id = $2', [date, coach])
    return result.rows
}

export const getOverlappingSlotsByDateAndCoach = async (date, coach, start, end) => {
    const query = `SELECT * FROM slots 
                   WHERE slot_date = $1 AND coach_id = $2
                   AND NOT (start_time >= $4 OR end_time <= $3)`;
    const result = await pool.query(query, [date, coach, start, end])
    return result.rows
}

export const addSlot = async (details) => {
    const result = await pool.query('INSERT INTO slots (coach_id, slot_date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING id', 
                                    [details.coachId, details.slotDate, details.startTime, details.endTime])
    return result.rows[0].id
}

export const markSlotAsBooked = async (slotId) => {
    const result = await pool.query('UPDATE slots SET is_booked = true WHERE id = $1', [slotId])
    return result.rows
}