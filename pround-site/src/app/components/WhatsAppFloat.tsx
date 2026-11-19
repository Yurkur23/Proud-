const phone = '5534996610451'
const message = 'Olá, vim pelo site da Pround e gostaria de conversar sobre meu projeto.'

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Pround pelo WhatsApp"
      className="fixed bottom-5 right-5 z-[80] grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(0,0,0,.25)] transition hover:scale-105 hover:bg-[#20BD5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
    >
      <svg viewBox="0 0 32 32" className="size-7 fill-current" aria-hidden="true">
        <path d="M16.04 2.67A13.25 13.25 0 0 0 4.65 22.67L2.87 29.2l6.68-1.75A13.26 13.26 0 1 0 16.04 2.67Zm0 24.12a10.85 10.85 0 0 1-5.53-1.51l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.87 10.87 0 1 1 9.09 4.97Zm5.97-8.14c-.33-.17-1.97-.97-2.27-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.71.08-.33-.17-1.4-.52-2.66-1.65-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.14-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.78-1.01-2.43-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.41-.3.33-1.15 1.13-1.15 2.74s1.18 3.18 1.35 3.4c.17.22 2.33 3.56 5.65 4.99.79.34 1.41.54 1.89.69.79.25 1.51.22 2.08.13.63-.09 1.97-.81 2.25-1.59.28-.78.28-1.45.19-1.59-.08-.14-.3-.22-.63-.39Z" />
      </svg>
    </a>
  )
}
