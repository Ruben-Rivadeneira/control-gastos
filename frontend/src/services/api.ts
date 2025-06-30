const API_URL = "http://localhost:3001/api"

export const get = async (path: string) => {
    const res = await fetch(`${API_URL}${path}`)
    return res.json()
}

export const post = async (path: string, data: any) => {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return res.json()
}

export const del = async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, { method: "DELETE" })
    return res.json()
}
