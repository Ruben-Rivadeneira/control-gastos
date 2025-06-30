import dotenv from 'dotenv'
import knex from 'knex'
dotenv.config()

export const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT || 3366),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
})


export const initDB = async () => {
    const hasCategories = await db.schema.hasTable('Category')
    if (!hasCategories) {
        await db.schema.createTable('Category', (table) => {
            table.uuid('id').primary()
            table.string('name').notNullable()
        })
        console.log('Tabla de categorias creada')
    }

    const hasUsers = await db.schema.hasTable('User')
    if (!hasUsers) {
        await db.schema.createTable('User', (table) => {
            table.uuid('id').primary()
            table.string('name').notNullable()
            table.string('email').notNullable()
            table.string('password').notNullable()
        })
        console.log('Tabla de usuarios creada')
    }

    const hasTransactions = await db.schema.hasTable('Transaction')
    if (!hasTransactions) {
        await db.schema.createTable('Transaction', (table) => {
            table.uuid('id').primary()
            table.string('type')
            table.float('amount')
            table.date('date')
            table.uuid('categoryId')
            table.uuid('userId')
            table.foreign('categoryId').references('Category.id').onDelete('SET NULL')
            table.foreign('userId').references('User.id').onDelete('SET NULL')
        })
        console.log('Tabla de transacciones creada')
    }
}
