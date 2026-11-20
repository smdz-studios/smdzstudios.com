window.SMDZ_SITE_CONFIG = Object.freeze({
  // available — Disponible — Verde
  // limited — Disponibilidad limitada — Naranja
  // closed — Agenda cerrada — Rojo
  // inquire — Consultar disponibilidad — Amarillo
  customWorkAvailability: 'available',
  publicSiteUrl: 'https://smdzstudios.com/',
  statusPublicUrl: 'https://status.smdzstudios.com/',
  // true: maintenance screen on Home, Discord and 404; false: normal navigation. Status stays accessible.
  maintenance: {
    enabled: false,
    message: {
      en: 'We are working on improvements. Please check back soon.',
      es: 'Estamos trabajando en mejoras. Vuelve a visitarnos pronto.',
      fr: 'Nous travaillons sur des améliorations. Revenez bientôt.',
      de: 'Wir arbeiten an Verbesserungen. Schau bald wieder vorbei.',
      pt: 'Estamos a trabalhar em melhorias. Volta em breve.',
      it: 'Stiamo lavorando a dei miglioramenti. Torna presto.'
    }
  },
  // Visible Status page refresh interval in seconds (15–300). Does not trigger GitHub Actions.
  uptimeRefreshSeconds: 30,
  uptimeDataUrl: 'https://raw.githubusercontent.com/smdz-studios/smdzstudios.com/uptime-data/history.json'
});
