import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../models/db'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-local' // usar dotenv


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    const exists = await db('User').where({ email }).first()
    //if (exists) return res.status(400).json({ error: 'El usuario ya existe' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()
    await db('User').insert({ id, name, email, password: hashedPassword })
    res.status(201).json({ message: 'Usuario registrado correctamente'})
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await db('User').where({ email }).first()
  //if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

  const valid = await bcrypt.compare(password, user.password)
  //if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' })

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
  res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } })
})

export default router
