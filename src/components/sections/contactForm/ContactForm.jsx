import { useState } from 'react'
import ContactFormView from './ContactFormView'

const INITIAL_FIELDS = { name: '', email: '', service: '', message: '' }

function ContactForm() {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      // Remplace par ton appel API
      await new Promise((res) => setTimeout(res, 1000))
      setStatus('success')
      setFields(INITIAL_FIELDS)
    } catch {
      setStatus('error')
    }
  }

  return (
    <ContactFormView
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      status={status}
    />
  )
}

export default ContactForm
