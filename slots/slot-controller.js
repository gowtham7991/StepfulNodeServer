import * as slotModel from "./slot-model.js"
import * as userModel from "../users/user-model.js"

const SlotController = (app) => {
    const getAllSlots = async (req, res) => {
        try {
            const date = req.query.date
            const slots = await slotModel.getSlotsByDate(date)

            const groupedSlots = slots.reduce((acc, obj) => {
                const key = obj.coach_name; // Extracting just the date part
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {});

            res.json(groupedSlots)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const getAllSlotsByCoach = async (req, res) => {
        try {
            const coachId = req.params["coach_id"]
            const slots = await slotModel.getSlotsByCoachId(coachId)

            const groupedSlots = slots.reduce((acc, obj) => {
                const key = obj.slot_date.toISOString().split("T")[0]; // Extracting just the date part
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {});

            for (const date in groupedSlots) {
                groupedSlots[date].sort((a, b) => new Date(a.slot_date) - new Date(b.slot_date));
            }

            res.json(groupedSlots)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    const addSlot = async (req, res) => {
        try {
            // check if the user exists and is a coach
            const coachId = req.body.coachId
            const slotDate = req.body.slotDate
            const startTime = req.body.startTime
            const endTime = req.body.endTime

            const users = await userModel.getUserById(coachId)

            // user doesnot exist
            if (users.length == 0) {
                res.status(404).send({message : "User doesn't exist!"})
                return
            }
            const user = users[0]

            if (user.role !== 'COACH') {
                res.status(403).send({message : "Cannot add a slot as a Student!"})
                return
            }

            // check if there are any overlapping slots for the coach
            const overlappingSlots = await slotModel.getOverlappingSlotsByDateAndCoach(slotDate, coachId, startTime, endTime)

            if (overlappingSlots.length > 0) {
                res.status(400).send({message: "Overlapping slot!"})
                return
            }

            const slotDetails = req.body
            const slotId = await slotModel.addSlot(slotDetails)
            console.log(slotId)
            const slot = await slotModel.getSlotsById(slotId)
            
            return res.json(slot[0])
        } catch (error) {
            res.status(500).send(error.message)
        } 
    }

    app.get("/slots", getAllSlots)
    app.get("/slots/coach/:coach_id", getAllSlotsByCoach)
    app.post("/slots", addSlot)
}

export default SlotController