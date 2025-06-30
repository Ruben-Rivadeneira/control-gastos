import express, { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../models/db'

const router = express.Router()


router.get('/', async (_: Request, res: Response) => {
  const categorias = await db('Category').select()
  res.json(categorias)
})


router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const categoria = await db('Category').where({ id: req.params.id }).first()
  categoria
    ? res.json(categoria)
    : res.status(404).json({ error: 'Categoría no encontrada' })
})

router.post('/', async (req, res) => {
    const { name } = req.body
    const id = uuidv4()
    await db('Category').insert({ id, name })
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
