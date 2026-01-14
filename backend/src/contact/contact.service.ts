import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { ContactDto, ValuationDto } from './dto/contact.dto'

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    })
  }

  async sendContactEmail(dto: ContactDto) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: 'contacto@antheacapital.com',
      subject: `Nuevo contacto desde la web${dto.propertyId ? ' - Propiedad' : ''}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${dto.name} ${dto.surname}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Teléfono:</strong> ${dto.phone}</p>
        ${dto.propertyId ? `<p><strong>Propiedad ID:</strong> ${dto.propertyId}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${dto.message}</p>
      `,
    }

    return this.transporter.sendMail(mailOptions)
  }

  async sendValuationEmail(dto: ValuationDto) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: 'contacto@antheacapital.com',
      subject: 'Nueva solicitud de valoración',
      html: `
        <h2>Nueva solicitud de valoración</h2>
        <p><strong>Nombre:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Teléfono:</strong> ${dto.phone}</p>
        <h3>Datos de la propiedad:</h3>
        <p><strong>Dirección:</strong> ${dto.address}</p>
        <p><strong>Tipo:</strong> ${dto.type}</p>
        <p><strong>Superficie:</strong> ${dto.area} m²</p>
        <p><strong>Habitaciones:</strong> ${dto.bedrooms}</p>
        <p><strong>Estado:</strong> ${dto.state}</p>
      `,
    }

    return this.transporter.sendMail(mailOptions)
  }
}

