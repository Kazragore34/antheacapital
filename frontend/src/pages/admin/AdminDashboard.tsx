import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { propertiesService } from '../../services/properties.service'
import { Property } from '../../types'
import api from '../../services/api'

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    loadData()
  }, [isAuthenticated, navigate])

  const loadData = async () => {
    try {
      const [propertiesData, statsData] = await Promise.all([
        propertiesService.getAll(),
        api.get('/admin/dashboard').then(res => res.data),
      ])
      setProperties(propertiesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta propiedad?')) return
    
    try {
      await propertiesService.delete(id)
      loadData()
    } catch (error) {
      alert('Error al eliminar la propiedad')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-serif text-2xl text-black-soft">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowForm(true)
                setEditingProperty(null)
              }}
              className="btn-primary"
            >
              Nueva Propiedad
            </button>
            <button onClick={logout} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gold">{stats.total}</div>
              <div className="text-gray-600">Total Propiedades</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-gray-600">Publicadas</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.venta}</div>
              <div className="text-gray-600">En Venta</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.alquiler}</div>
              <div className="text-gray-600">En Alquiler</div>
            </div>
          </div>
        )}

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-serif text-2xl text-black-soft">Propiedades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{property.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        property.type === 'venta' ? 'bg-gold text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {property.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      }).format(property.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        property.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status === 'published' ? 'Publicada' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setEditingProperty(property)
                          setShowForm(true)
                        }}
                        className="text-gold hover:text-gold-dark mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => property._id && handleDelete(property._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Property Form Modal - Simplified version, you can expand this */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl">
                {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingProperty(null)
                }}
                className="text-gray-500 hover:text-black-soft"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Nota: El formulario completo de creación/edición de propiedades se puede implementar aquí.
              Por ahora, puede gestionar las propiedades directamente desde la base de datos o expandir este componente.
            </p>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingProperty(null)
              }}
              className="btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

