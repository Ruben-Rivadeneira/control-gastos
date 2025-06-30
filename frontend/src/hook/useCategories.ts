import { useEffect, useState } from "react";
import { get } from "../services/api";

export type Categoria = { id: string; name: string }

export const useCategorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([])

    useEffect(() => {
        const fetchCategorias = async () => {
            const data = await get("/categories")
            setCategorias(data)
        }
        fetchCategorias()
    }, [])

    return categorias
}
