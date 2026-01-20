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
    const hasPropertyInfo = dto.propertyId || dto.propertyTitle || dto.propertyUrl
    
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: 'contacto@antheacapital.com',
      subject: hasPropertyInfo ? `Solicitud de información - Propiedad` : 'Nuevo contacto desde la web',
      html: `
        <h2>${hasPropertyInfo ? 'Solicitud de información sobre propiedad' : 'Nuevo mensaje de contacto'}</h2>
        <p><strong>Nombre:</strong> ${dto.name} ${dto.surname}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Teléfono:</strong> ${dto.phone}</p>
        ${hasPropertyInfo ? `
          <hr style="margin: 20px 0; border: none; border-top: 2px solid #C9A961;">
          <h3 style="color: #C9A961;">Información de la Propiedad:</h3>
          ${dto.propertyType ? `<p><strong>Tipo:</strong> ${dto.propertyType}</p>` : ''}
          ${dto.propertyTitle ? `<p><strong>Título:</strong> ${dto.propertyTitle}</p>` : ''}
          ${dto.propertyPrice ? `<p><strong>Precio:</strong> ${dto.propertyPrice}</p>` : ''}
          ${dto.propertyId ? `<p><strong>ID Propiedad:</strong> ${dto.propertyId}</p>` : ''}
          ${dto.propertyUrl ? `<p><strong>Enlace:</strong> <a href="${dto.propertyUrl}" style="color: #C9A961;">${dto.propertyUrl}</a></p>` : ''}
          <hr style="margin: 20px 0; border: none; border-top: 2px solid #C9A961;">
        ` : ''}
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap;">${dto.message}</p>
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

