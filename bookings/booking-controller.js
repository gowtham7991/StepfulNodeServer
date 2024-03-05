import * as bookingModel from "./booking-model.js"
import * as userModel from "../users/user-model.js"
import * as slotModel from "../slots/slot-model.js"

const BookingController = (app) => {
    const getUpcomingBookingsByUser = async (req, res) => {
        try {
            
            const userId = req.params.userid
            console.log(userId)
            const users = await userModel.getUserById(userId)

            if (users.length === 0) {
                res.sendStatus(404)
                return
            }
            const bookings = await bookingModel.findUpcomingBookingByUserId(userId)
            res.json(bookings)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const getPastBookingsByUser = async (req, res) => {
        try {
            const userId = req.params.userid
            const users = await userModel.getUserById(userId)

            if (users.length === 0) {
                res.sendStatus(404)
                return
            }
            const bookings = await bookingModel.findPastBookingByUserId(userId)
            res.json(bookings)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const createBooking = async (req, res) => {
        try {
            const slotId = req.body.slotId
            const studentId = req.body.studentId

            // check if the student exists
            const students = await userModel.getUserById(studentId)

            if (students.length === 0) {
                res.sendStatus(404)
                return
            }

            // check if it is a valid slot
            const slots = await slotModel.getSlotsById(slotId)

            if (slots.length === 0) {
                res.sendStatus(404)
                return
            } else {
                // check if the slot is booked
                const slot = slots[0]
                
                if (slot.is_booked === true) {
                    res.sendStatus(403)
                    return
                }

                // create a new booking
                const bookingId = await bookingModel.createBooking(slot, studentId)
                const booking = await bookingModel.findBookingById(bookingId)
                await slotModel.markSlotAsBooked(slotId)
                res.json(booking[0])
            }
            
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    app.get("/bookings/upcoming/:userid", getUpcomingBookingsByUser)
    app.get("/bookings/past/:userid", getPastBookingsByUser)
    app.post("/bookings", createBooking)
}

export default BookingController