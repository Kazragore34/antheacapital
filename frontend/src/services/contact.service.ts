import api from './api'
import { ContactForm, ValuationForm } from '../types'

export const contactService = {
  sendContact: async (form: ContactForm): Promise<void> => {
    await api.post('/contact', form)
  },

  sendValuation: async (form: ValuationForm): Promise<void> => {
    await api.post('/contact/valuation', form)
  },
}

