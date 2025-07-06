import { useEffect, useState } from 'react'
import CategoryManager from '../components/categories/CategoryManager'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { get } from '../services/api'
import type { Category } from '../types'

const CategoriesView = () => {
    const { dispatch } = useApp()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadCategories = async () => {
            if (!user) {
                setError('Usuario no autenticado')
                setLoading(false)
                return
            }

            try {
                setError(null)
                let categories: Category[] = []

                try {
                    categories = await get(`/categories?userId=${user.id}`)
                } catch (userIdError) {
                    console.log('Error al cargar el ID:', userIdError)

                    try {
                        categories = await get('/categories')
                        console.log('Categorías cargadas sin ID:', categories)
                    } catch (generalError) {
                        console.log('Fallo general del endpoint:', generalError)
                        throw generalError
                    }
                }

                if (!Array.isArray(categories)) {
                    console.warn('API devuelve error:', categories)
                    categories = []
                }

                dispatch({
                    type: 'LOAD_DATA',
                    payload: {
                        categories,
                        transactions: [],
                        purchaseItems: []
                    }
                })

            } catch (err) {
                console.error('Error cargando categorias:', err)

                let errorMessage = 'Error al cargar las categorías'

                if (err instanceof Error) {
                    if (err.message.includes('<!DOCTYPE')) {
                        errorMessage = 'El servidor está devolviendo HTML en lugar de JSON. Verifica que el servidor esté funcionando correctamente.'
                    } else if (err.message.includes('fetch')) {
                        errorMessage = 'No se puede conectar con el servidor. Verifica que esté ejecutándose en http://localhost:3001'
                    } else if (err.message.includes('400')) {
                        errorMessage = 'Error de solicitud: Los parámetros enviados no son válidos'
                    } else if (err.message.includes('401')) {
                        errorMessage = 'Error de autenticación: Usuario no autorizado'
                    } else if (err.message.includes('500')) {
                        errorMessage = 'Error interno del servidor'
                    } else {
                        errorMessage = `Error: ${err.message}`
                    }
                }

                setError(errorMessage)

                dispatch({
                    type: 'LOAD_DATA',
                    payload: {
                        categories: [],
                        transactions: [],
                        purchaseItems: []
                    }
                })
            } finally {
                setLoading(false)
            }
        }

        loadCategories()
    }, [dispatch, user])

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando categorías...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-medium mb-2">Error al cargar categorías</h3>
                    <p className="text-red-700 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Reintentar
                    </button>
                </div>

                {/* Debug info */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
                    <p><strong>Información de depuración:</strong></p>
                    <p>Usuario: {user?.id || 'No autenticado'}</p>
                    <p>URL de API: {process.env.REACT_APP_API_URL || 'http://localhost:3001'}</p>
                    <p>Endpoint: GET /api/categories</p>
                </div>
            </div>
        )
    }

    return <CategoryManager />
}

export default CategoriesView