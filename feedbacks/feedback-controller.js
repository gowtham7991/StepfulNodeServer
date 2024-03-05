import * as feedbackModel from "./feedback-model.js"
import * as bookingModel from "../bookings/booking-model.js"
import * as userModel from "../users/user-model.js"

const FeedbackController = (app) => {

    const getFeedbackHistory = async (req, res) => {
        try {
            const coachId = req.params.coachId
            const users = await userModel.getUserById(coachId)

            if (users.length === 0) {
                res.sendStatus(404)
                return
            }

            const bookingsByCoach = await bookingModel.findPastBookingByUserId(coachId)
            const bookingIds = bookingsByCoach.map(k => k.id)
            const feedbacks = await feedbackModel.findFeedbacksByCoach(bookingIds)

            res.json(feedbacks)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const getFeedbackByBooking = async (req, res) => {
        try {
            const bookingId = req.params.bookingId
            const bookings = await bookingModel.findBookingById(bookingId)

            if (bookings.length === 0) {
                res.sendStatus(404)
                return
            }

            const feedbacks = await feedbackModel.findFeedbackByBookingId(bookingId)

            res.json(feedbacks)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const postFeedback = async (req, res) => {
        try {
            const bookingId = req.body.bookingId
            const bookings = await bookingModel.findBookingById(bookingId)

            if (bookings.length === 0) {
                res.sendStatus(404)
                return
            }

            const feedbackId = await feedbackModel.createFeedback(req.body)
            const feedback = await feedbackModel.findFeedbackById(feedbackId)
            res.json(feedback[0])
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    app.get("/feedbacks/coach/:coachId", getFeedbackHistory)
    app.get("/feedbacks/booking/:bookingId", getFeedbackByBooking)
    app.post("/feedbacks", postFeedback)
}

export default FeedbackController