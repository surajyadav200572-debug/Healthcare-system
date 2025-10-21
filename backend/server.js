import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import mongoose from 'mongoose'
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import reportRouter from "./routes/reportRoute.js"
import notificationRouter from "./routes/notificationRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/reports", reportRouter)
app.use("/api/notifications", notificationRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// Health endpoint to check server and DB status
app.get('/health', (req, res) => {
  const states = ['disconnected','connected','connecting','disconnecting']
  const dbState = mongoose.connection.readyState
  res.json({
    server: 'ok',
    db: {
      state: states[dbState] || dbState,
      readyState: dbState
    }
  })
})

app.listen(port, () => console.log(`Server started on PORT:${port}`))