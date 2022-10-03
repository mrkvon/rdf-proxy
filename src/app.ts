import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios'
import helmet from 'helmet'
import type { Method } from 'axios'
// import { addColors } from 'winston/lib/winston/config'
// import debug from 'debug';

// const log = debug('app')

const app = express()
const port = 3001

app.use(helmet())
app.use(cors())
app.use(json({ limit: '100MB'}))

app.all(
  '/',
  async (req: express.Request<{}, {}, {}, { uri: string }>, res, next) => {
    try {
      if (req.query.uri) {
        const { uri,...params} = req.query
        try {
          const response = await axios.request({
            url: req.query.uri,
            params,
            method: req.method as Method,
            data: req.body,
            headers: { ...(req.headers.authorization ? { authorization: req.headers.authorization } : {}), accept: req.headers?.accept ?? 'text/turtle' },
          })
          return res
            .set(response.headers)
            .status(response.status)
            .send(response.data)

        }
         catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            return res
              .set(error.response.headers)
              .status(error.response.status)
              .send(error.response.data)
          } else throw error
          
        }
      } else {
        throw new Error('uri not specified')
      }
    } catch (e) {
      return next(e)
    }
  },
)

const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)
  res.status(500).send(err.message)
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
