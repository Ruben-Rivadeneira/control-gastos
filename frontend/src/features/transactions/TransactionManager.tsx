// src/features/transactions/TransactionManager.tsx
import { useEffect, useState } from "react"
import { useCategorias } from "../../hook/useCategories"
import { del, get, post } from "../../services/api"

type Transaccion = {
    id: string
    type: "ingreso" | "egreso"
    amount: number
    date: string
    userId: string
    categoryId: string
    name?: string
}

export default function TransactionManager() {
    const [transacciones, setTransacciones] = useState<Transaccion[]>([])
    const categorias = useCategorias()

    const [form, setForm] = useState<Omit<Transaccion, "id" | "categoria">>({
        type: "ingreso",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        userId: "",
        categoryId: "",
    })

    const load = async () => {
        const data = await get("/transactions")
        setTransacciones(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (form.amount <= 0 || !form.categoryId) {
            alert("Por favor completa todos los campos correctamente.")
            return
        }
        const fakeUserId = "1"
        console.log("Datos a enviar:", form)
        await post("/transactions", {
            ...form,
            userId: fakeUserId,
        })
        setForm({ ...form, amount: 0 })
        load()
    }

    const handleDelete = async (id: string) => {
        await del(`/transactions/${id}`)
        load()
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">Registrar Transacción</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center bg-white p-4 rounded shadow mb-4">
                <select className="border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "ingreso" | "egreso" })}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                <input className="border p-2" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} placeholder="Monto" />
                <input className="border p-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <select className="border p-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Agregar</button>
            </form>

            <h2 className="text-lg mt-6 font-semibold">Transacciones</h2>
            <table className="w-full text-left mt-2">
                <thead>
                    <tr>
                        <th>Tipo</th><th>Monto</th><th>Fecha</th><th>Categoría</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {transacciones.map((t) => (
                        <tr key={t.id}>
                            <td>{t.type}</td>
                            <td>${t.amount}</td>
                            <td>{t.date?.slice(0, 10)}</td>
                            <td>{t.name || "-"}</td>
                            <td>
                                <button onClick={() => handleDelete(t.id)} className="text-red-600">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
