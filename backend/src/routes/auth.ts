import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../models/db'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-local'

router.post('/register', async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los campos son requeridos' 
      })
    }

    const exists = await db('User').where({ email }).first()
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        error: 'El usuario ya existe' 
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()
    await db('User').insert({ id, name, email, password: hashedPassword })

    return res.status(201).json({ 
      success: true, 
      message: 'Usuario creado exitosamente' 
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    })
  }
})

router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    const user = await db('User').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    console.log('Usuario: ', user)

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


export default router