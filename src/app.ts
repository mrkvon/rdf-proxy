import express from 'express'
import cors from 'cors'
import axios from 'axios'
import helmet from 'helmet'
// import { addColors } from 'winston/lib/winston/config'
// import debug from 'debug';

// const log = debug('app')

const app = express()
const port = 3000

app.use(helmet())
app.use(cors())

app.get(
  '/',
  async (req: express.Request<{}, {}, {}, { uri: string }>, res, next) => {
    try {
      if (req.query.uri) {
        const response = await axios.get(req.query.uri, {
          headers: { accept: req.headers?.accept ?? 'text/turtle' },
        })
        return res
          .set(response.headers)
          .status(response.status)
          .send(response.data)
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
