import { Controller, Post, Body } from '@nestjs/common'
import { ContactService } from './contact.service'
import { ContactDto, ValuationDto } from './dto/contact.dto'

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async contact(@Body() dto: ContactDto) {
    await this.contactService.sendContactEmail(dto)
    return { message: 'Mensaje enviado correctamente' }
  }

  @Post('valuation')
  async valuation(@Body() dto: ValuationDto) {
    await this.contactService.sendValuationEmail(dto)
    return { message: 'Solicitud de valoración enviada correctamente' }
  }
}

