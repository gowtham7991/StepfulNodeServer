import express from 'express';
import cors from 'cors';
import UserController from './users/user-controller.js';
import SlotController from './slots/slot-controller.js';
import BookingController from './bookings/booking-controller.js';
import FeedbackController from './feedbacks/feedback-controller.js';

const app = express();
app.use(cors());
app.use(express.json());

UserController(app);
SlotController(app);
BookingController(app);
FeedbackController(app);

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});
