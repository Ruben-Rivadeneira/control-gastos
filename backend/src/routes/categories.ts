import express, { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../models/db'

const router = express.Router()


router.get('/', async (req: any, res: any) => {

  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ error: 'El id de usuario es requerido' });
  }

  try {
    const categories = await db('Category').where({ userId: userId });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})


router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const categoria = await db('Category').where({ id: req.params.id }).first()
  categoria
    ? res.json(categoria)
    : res.status(404).json({ error: 'Categoría no encontrada' })
})

router.post('/', async (req, res) => {
  const { name, color, type, userId } = req.body
  const id = uuidv4()
  const newCategory = {
    id: uuidv4(),
    userId: req.body.userId,
    name,
    color,
    type
  };
  await db('Category').insert({ id, name, color, type, userId })
  res.json({ id, name })
})

router.put('/:id', async (req, res) => {
  const { name } = req.body
  await db('Category').where({ id: req.params.id }).update({ name })
  res.json({ success: true })
})


router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const deleted = await db('Category').where({ id: req.params.id }).del()
  deleted
    ? res.json({ success: true })
    : res.status(404).json({ error: 'Categoría no encontrada' })
})

export default router
