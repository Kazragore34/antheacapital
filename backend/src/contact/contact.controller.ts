import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { ContactService } from './contact.service'
import { ContactDto, ValuationDto } from './dto/contact.dto'

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name)

  constructor(private readonly contactService: ContactService) {}

  @Post()
  async contact(@Body() dto: ContactDto) {
    try {
      this.logger.log(`Nuevo mensaje de contacto recibido de: ${dto.email}`)
      await this.contactService.sendContactEmail(dto)
      this.logger.log(`Correo enviado correctamente a: contacto@antheacapital.com`)
      return { success: true, message: 'Mensaje enviado correctamente' }
    } catch (error) {
      this.logger.error(`Error al enviar correo de contacto: ${error.message}`, error.stack)
      throw new HttpException(
        {
          success: false,
          message: 'Error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('valuation')
  async valuation(@Body() dto: ValuationDto) {
    try {
      this.logger.log(`Nueva solicitud de valoración recibida de: ${dto.email}`)
      await this.contactService.sendValuationEmail(dto)
      this.logger.log(`Correo de valoración enviado correctamente a: contacto@antheacapital.com`)
      return { success: true, message: 'Solicitud de valoración enviada correctamente' }
    } catch (error) {
      this.logger.error(`Error al enviar correo de valoración: ${error.message}`, error.stack)
      throw new HttpException(
        {
          success: false,
          message: 'Error al enviar la solicitud. Por favor, inténtelo de nuevo más tarde.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

