import express from "express"
import morgan from "morgan"
import routes from './routes'
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Use routes
app.use(routes)

export default app
