import { Injectable } from '@nestjs/common'
import { PropertiesService } from '../properties/properties.service'

@Injectable()
export class AdminService {
  constructor(private readonly propertiesService: PropertiesService) {}

  async getDashboardStats() {
    const allProperties = await this.propertiesService.findAll({})
    const published = allProperties.filter(p => p.status === 'published')
    const drafts = allProperties.filter(p => p.status === 'draft')
    const venta = allProperties.filter(p => p.type === 'venta')
    const alquiler = allProperties.filter(p => p.type === 'alquiler')

    return {
      total: allProperties.length,
      published: published.length,
      drafts: drafts.length,
      venta: venta.length,
      alquiler: alquiler.length,
    }
  }
}

