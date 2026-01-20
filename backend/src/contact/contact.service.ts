import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { ContactDto, ValuationDto } from './dto/contact.dto'

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name)
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    const emailHost = this.configService.get('EMAIL_HOST')
    const emailPort = this.configService.get('EMAIL_PORT')
    const emailUser = this.configService.get('EMAIL_USER')
    const emailPass = this.configService.get('EMAIL_PASS')
    const emailFrom = this.configService.get('EMAIL_FROM')

    // Verificar que todas las variables de entorno estén configuradas
    if (!emailHost || !emailPort || !emailUser || !emailPass || !emailFrom) {
      this.logger.error('⚠️ Variables de entorno de correo no configuradas:')
      this.logger.error(`EMAIL_HOST: ${emailHost ? '✓' : '✗'}`)
      this.logger.error(`EMAIL_PORT: ${emailPort ? '✓' : '✗'}`)
      this.logger.error(`EMAIL_USER: ${emailUser ? '✓' : '✗'}`)
      this.logger.error(`EMAIL_PASS: ${emailPass ? '✓' : '✗'}`)
      this.logger.error(`EMAIL_FROM: ${emailFrom ? '✓' : '✗'}`)
      throw new Error('Variables de entorno de correo no configuradas. Por favor, configure EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS y EMAIL_FROM.')
    }

    this.logger.log(`Configurando transporte de correo: ${emailHost}:${emailPort}`)
    
    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort, 10),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      // Opciones adicionales para mejor compatibilidad
      tls: {
        rejectUnauthorized: false, // Para servidores con certificados autofirmados
      },
      // Opciones de depuración
      debug: true,
      logger: true,
    })

    // Verificar la conexión al servidor de correo
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error(`❌ Error al verificar conexión con servidor de correo: ${error.message}`)
      } else {
        this.logger.log('✅ Conexión con servidor de correo verificada correctamente')
      }
    })
  }

  async sendContactEmail(dto: ContactDto) {
    const hasPropertyInfo = dto.propertyId || dto.propertyTitle || dto.propertyUrl
    
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: 'contacto@antheacapital.com',
      replyTo: dto.email, // Permitir responder directamente al cliente
      subject: hasPropertyInfo ? `Solicitud de información - Propiedad` : 'Nuevo contacto desde la web',
      html: `
        <h2>${hasPropertyInfo ? 'Solicitud de información sobre propiedad' : 'Nuevo mensaje de contacto'}</h2>
        <p><strong>Nombre:</strong> ${dto.name} ${dto.surname}</p>
        <p><strong>Email:</strong> <a href="mailto:${dto.email}">${dto.email}</a></p>
        <p><strong>Teléfono:</strong> <a href="tel:${dto.phone}">${dto.phone}</a></p>
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
      text: `
${hasPropertyInfo ? 'Solicitud de información sobre propiedad' : 'Nuevo mensaje de contacto'}

Nombre: ${dto.name} ${dto.surname}
Email: ${dto.email}
Teléfono: ${dto.phone}
${hasPropertyInfo ? `
--- Información de la Propiedad ---
${dto.propertyType ? `Tipo: ${dto.propertyType}` : ''}
${dto.propertyTitle ? `Título: ${dto.propertyTitle}` : ''}
${dto.propertyPrice ? `Precio: ${dto.propertyPrice}` : ''}
${dto.propertyId ? `ID Propiedad: ${dto.propertyId}` : ''}
${dto.propertyUrl ? `Enlace: ${dto.propertyUrl}` : ''}
--- Fin Información de la Propiedad ---
` : ''}
Mensaje:
${dto.message}
      `.trim(),
    }

    try {
      this.logger.log(`Enviando correo a: contacto@antheacapital.com desde: ${mailOptions.from}`)
      const result = await this.transporter.sendMail(mailOptions)
      this.logger.log(`✅ Correo enviado correctamente. MessageId: ${result.messageId}`)
      return result
    } catch (error) {
      this.logger.error(`❌ Error al enviar correo: ${error.message}`, error.stack)
      throw error
    }
  }

  async sendValuationEmail(dto: ValuationDto) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: 'contacto@antheacapital.com',
      replyTo: dto.email,
      subject: 'Nueva solicitud de valoración',
      html: `
        <h2>Nueva solicitud de valoración</h2>
        <p><strong>Nombre:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${dto.email}">${dto.email}</a></p>
        <p><strong>Teléfono:</strong> <a href="tel:${dto.phone}">${dto.phone}</a></p>
        <h3>Datos de la propiedad:</h3>
        <p><strong>Dirección:</strong> ${dto.address}</p>
        <p><strong>Tipo:</strong> ${dto.type}</p>
        <p><strong>Superficie:</strong> ${dto.area} m²</p>
        <p><strong>Habitaciones:</strong> ${dto.bedrooms}</p>
        <p><strong>Estado:</strong> ${dto.state}</p>
      `,
      text: `
Nueva solicitud de valoración

Nombre: ${dto.name}
Email: ${dto.email}
Teléfono: ${dto.phone}

Datos de la propiedad:
Dirección: ${dto.address}
Tipo: ${dto.type}
Superficie: ${dto.area} m²
Habitaciones: ${dto.bedrooms}
Estado: ${dto.state}
      `.trim(),
    }

    try {
      this.logger.log(`Enviando correo de valoración a: contacto@antheacapital.com desde: ${mailOptions.from}`)
      const result = await this.transporter.sendMail(mailOptions)
      this.logger.log(`✅ Correo de valoración enviado correctamente. MessageId: ${result.messageId}`)
      return result
    } catch (error) {
      this.logger.error(`❌ Error al enviar correo de valoración: ${error.message}`, error.stack)
      throw error
    }
  }
}

