/**
 * Valida NIF, NIE o DNI español
 * @param document - Documento a validar (NIF, NIE o DNI)
 * @returns true si es válido, false si no
 */
export const validateNIF = (document: string): boolean => {
  // Eliminar espacios y convertir a mayúsculas
  const cleanDoc = document.trim().toUpperCase().replace(/\s/g, '')

  // Verificar formato básico
  if (!/^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(cleanDoc)) {
    return false
  }

  // Extraer número y letra
  const number = cleanDoc.slice(0, -1)
  const letter = cleanDoc.slice(-1)

  // Convertir primera letra de NIE (X=0, Y=1, Z=2)
  let num = 0
  if (number[0] === 'X') {
    num = parseInt('0' + number.slice(1))
  } else if (number[0] === 'Y') {
    num = parseInt('1' + number.slice(1))
  } else if (number[0] === 'Z') {
    num = parseInt('2' + number.slice(1))
  } else {
    num = parseInt(number)
  }

  // Calcular letra correcta
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const correctLetter = letters[num % 23]

  return letter === correctLetter
}

/**
 * Valida CIF (Código de Identificación Fiscal)
 * @param cif - CIF a validar
 * @returns true si es válido, false si no
 */
export const validateCIF = (cif: string): boolean => {
  const cleanCIF = cif.trim().toUpperCase().replace(/\s/g, '')

  // Verificar formato básico: letra + 7 dígitos + letra/dígito
  if (!/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(cleanCIF)) {
    return false
  }

  const letter = cleanCIF[0]
  const numbers = cleanCIF.slice(1, 8)
  const control = cleanCIF[8]

  // Calcular suma de posiciones pares e impares
  let sumEven = 0
  let sumOdd = 0

  for (let i = 0; i < numbers.length; i++) {
    const digit = parseInt(numbers[i])
    if (i % 2 === 0) {
      // Posiciones impares (0-indexed)
      const doubled = digit * 2
      sumOdd += Math.floor(doubled / 10) + (doubled % 10)
    } else {
      // Posiciones pares (0-indexed)
      sumEven += digit
    }
  }

  const total = sumOdd + sumEven
  const lastDigit = total % 10
  const checkDigit = lastDigit === 0 ? 0 : 10 - lastDigit

  // Verificar según tipo de letra
  const controlChars = '0123456789'
  const controlLetters = 'ABCDEFGHIJ'

  if (['P', 'Q', 'R', 'S', 'W'].includes(letter)) {
    // Letras: debe ser letra
    return control === controlLetters[checkDigit]
  } else if (['A', 'B', 'E', 'H'].includes(letter)) {
    // Números: debe ser número
    return control === controlChars[checkDigit]
  } else {
    // Puede ser letra o número
    return control === controlChars[checkDigit] || control === controlLetters[checkDigit]
  }
}

/**
 * Valida cualquier documento de identificación español (NIF, NIE, DNI, CIF)
 * @param document - Documento a validar
 * @returns objeto con isValid y type
 */
export const validateDocument = (document: string): { isValid: boolean; type: 'NIF' | 'NIE' | 'CIF' | 'UNKNOWN' } => {
  const cleanDoc = document.trim().toUpperCase().replace(/\s/g, '')

  // Intentar validar como CIF primero
  if (validateCIF(cleanDoc)) {
    return { isValid: true, type: 'CIF' }
  }

  // Intentar validar como NIF/NIE
  if (validateNIF(cleanDoc)) {
    if (cleanDoc[0] === 'X' || cleanDoc[0] === 'Y' || cleanDoc[0] === 'Z') {
      return { isValid: true, type: 'NIE' }
    }
    return { isValid: true, type: 'NIF' }
  }

  return { isValid: false, type: 'UNKNOWN' }
}

