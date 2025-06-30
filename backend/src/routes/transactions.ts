import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../models/db'

const router = express.Router()

router.get('/', async (_, res) => {
    const rows = await db('Transaction')
        .leftJoin('Category', 'Transaction.categoryId', 'Category.id')
        .leftJoin('User', 'Transaction.userId', 'User.id')
        .select(
            'Transaction.*',
            'Category.name as categoryName',
            'User.name as Usuario'
        )
    res.json(rows)
})

router.post('/', async (req, res) => {
    const { type, amount, date, description, categoryId, userId } = req.body
    const id = uuidv4()
    await db('Transaction').insert({ id, type, amount, date, description, categoryId, userId })
    res.json({ id, type, amount, date, categoryId, userId })
})

router.put('/:id', async (req, res) => {
    const { type, amount, date, categoryId, userId } = req.body
    await db('Transaction').where({ id: req.params.id }).update({ type, amount, date, categoryId, userId })
    res.json({ success: true })
})

router.delete('/:id', async (req, res) => {
    await db('Transaction').where({ id: req.params.id }).del()
    res.json({ success: true })
})

export default router