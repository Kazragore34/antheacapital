const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-black-soft">
          Política de Privacidad y Protección de Datos
        </h1>
        
        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">1. Responsable del Tratamiento</h2>
            <p>
              <strong>Anthea Capital Consulting</strong><br />
              Calle Stuart 45<br />
              Aranjuez, Madrid 28300<br />
              España
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">2. Finalidad del Tratamiento</h2>
            <p>
              La finalidad de la recogida de sus datos es para poder atender sus solicitudes de información 
              y prestarle nuestros servicios, así como enviarle comunicaciones comerciales sobre nuestros 
              productos y/o servicios.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">3. Legitimación</h2>
            <p>
              Su consentimiento previo facilitado mediante la casilla correspondiente establecida a tal 
              efecto o en su caso la ejecución de un contrato del que usted sea parte.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">4. Destinatarios</h2>
            <p>
              Con carácter general los datos no se cederán a terceros salvo en los casos en que exista una 
              obligación legal.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">5. Derechos</h2>
            <p>
              Podrá ejercer los derechos de acceso, rectificación, limitación de tratamiento, supresión, 
              portabilidad y oposición al tratamiento de sus datos de carácter personal, así como a la 
              retirada del consentimiento prestado para el tratamiento de los mismos.
            </p>
            <p className="mt-4">
              Para ejercer sus derechos, puede contactar con nosotros en:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email: contacto@antheacapital.com</li>
              <li>Dirección: Calle Stuart 45, Aranjuez, Madrid 28300</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">6. Conservación de Datos</h2>
            <p>
              Los datos personales serán conservados durante el tiempo necesario para cumplir con la 
              finalidad para la que fueron recabados y para determinar las posibles responsabilidades que 
              se pudieran derivar de dicha finalidad y del tratamiento de los datos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">7. Seguridad</h2>
            <p>
              Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad 
              de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

