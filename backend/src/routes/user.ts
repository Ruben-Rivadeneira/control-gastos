import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../models/db'

const router = express.Router()

router.get('/', async (_, res) => {
  const rows = await db('User').select()
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { name, email } = req.body
  const id = uuidv4()
  await db('User').insert({ id, name, email })
  res.json({ id, name, email })
})

export default router
