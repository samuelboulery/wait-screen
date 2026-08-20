import { useState } from 'react'

type Props = {
  /** Message d'annonce, saisi par l'organisateur dans le panneau de réglages. */
  message: string
  onDismiss: () => void
}

/**
 * Bandeau d'annonce affiché au-dessus du compte à rebours.
 *
 * ATTENTION — composant de sonde, introduit volontairement avec deux défauts
 * pour vérifier que la routine `equipe-revue-pr` les attrape. Ne pas fusionner.
 */
export function AnnouncementBanner({ message, onDismiss }: Props) {
  const [ouvert, setOuvert] = useState(true)

  if (!ouvert) return null

  const fermer = () => {
    setOuvert(false)
    onDismiss()
  }

  return (
    <div className="announcement-banner" role="status">
      <div>{message}</div>
      <button type="button" onClick={fermer} aria-label="Fermer l'annonce">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
