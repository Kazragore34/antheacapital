import api from './api'
import { ContactForm, ValuationForm } from '../types'

export const contactService = {
  sendContact: async (form: ContactForm): Promise<any> => {
    try {
      const response = await api.post('/contact', form)
      return response.data
    } catch (error: any) {
      console.error('[ContactService] Error al enviar contacto:', error)
      // Re-lanzar el error para que el componente pueda manejarlo
      throw error
    }
  },

  sendValuation: async (form: ValuationForm): Promise<any> => {
    try {
      const response = await api.post('/contact/valuation', form)
      return response.data
    } catch (error: any) {
      console.error('[ContactService] Error al enviar valoración:', error)
      throw error
    }
  },
}

