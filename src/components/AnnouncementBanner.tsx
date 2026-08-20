type Props = {
  /** Message d'annonce, saisi par l'organisateur dans le panneau de réglages. */
  message: string
  onDismiss: () => void
}

/**
 * Bandeau d'annonce affiché au-dessus du compte à rebours.
 *
 * Purement contrôlé : la visibilité est décidée par l'appelant (pas d'état
 * local), pour que fermer une annonce n'empêche pas les suivantes de s'afficher.
 */
export function AnnouncementBanner({ message, onDismiss }: Props) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 bg-neutral-900/90 px-6 py-3 text-neutral-50 backdrop-blur"
      role="status"
    >
      <div>{message}</div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full p-2 text-neutral-400 transition hover:text-neutral-50"
        aria-label="Fermer l'annonce"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
