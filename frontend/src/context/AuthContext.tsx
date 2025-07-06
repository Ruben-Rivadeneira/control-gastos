import { createContext, useContext, useEffect, useState } from "react"
import { post } from "../services/api"

type User = {
    id: string
    email: string
    name: string
}

type AuthContextType = {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("auth")
        if (stored) {
            const parsed = JSON.parse(stored)
            setToken(parsed.token)
            setUser(parsed.user)
        }
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const res = await post("/auth/login", { email, password })
            if (res.token && res.user) {
                setToken(res.token)
                setUser(res.user)
                localStorage.setItem("auth", JSON.stringify(res))
                return { success: true }
            } else {
                return { success: false, error: res.error || "Login failed" }
            }
        } catch {
            return { success: false, error: "Error de conexión" }
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await post("/auth/register", { name, email, password })
            if (res.message) {
                return await login(email, password)
            } else {
                return { success: false, error: res.error || "Registro fallido" }
            }
        } catch {
            return { success: false, error: "Error de red" }
        }
    }

    const logout = () => {
        localStorage.removeItem("auth")
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

