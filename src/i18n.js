/** Site copy — PT-BR default */

export const LOCALE_STORAGE_KEY = 'fran-locale'
export const LOCALES = ['pt-BR', 'en-US']
export const DEFAULT_LOCALE = 'pt-BR'

export function readStoredLocale() {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (v === 'pt-BR' || v === 'en-US') return v
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE
}

export function localeToHtmlLang(locale) {
  return locale === 'pt-BR' ? 'pt-BR' : 'en-US'
}

export function weekdayHeaders(locale) {
  if (locale === 'pt-BR') {
    return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

const STRINGS = {
  'pt-BR': {
    navAbout: 'sobre mim',
    navMusic: 'música',
    navGallery: 'galeria',
    navContent: 'conteúdo',
    navShows: 'shows',
    navContact: 'contato',
    heroTagline: 'produtor musical, baixista, multi-instrumentista, criador de conteúdo',
    sectionAbout: 'Sobre mim',
    sectionMusic: 'Música',
    sectionGallery: 'Galeria',
    sectionContent: 'Conteúdo',
    sectionShows: 'Shows',
    sectionContact: 'Contato',
    aboutBio1:
      'Francisco Nogueira é produtor musical, baixista, multi-instrumentista e criador de conteúdo com base em São Paulo, Brasil.',
    aboutBio2:
      'Com paixão por construir sons em vários instrumentos e estilos de produção, o foco está em colaboração e dar vida a visões criativas — no estúdio, no palco ou em conteúdo digital.',
    aboutBio3: 'Disponível para sessões, colaborações e projetos criativos.',
    aboutBio4: 'Entre em contato para conectar e criar.',
    notepadMenubarAbout: 'Arquivo Editar Formatar Exibir Ajuda',
    openMusicPlayer: 'Abrir player de música',
    spotifyIframeTitle: 'Fran Nogueira — RECS no Spotify',
    footerCopyright: '© {year} Francisco Nogueira',
    ariaLangSwitch: 'Idioma do site',
    navMenuOpen: 'Abrir menu de navegação',
    navMenuClose: 'Fechar menu de navegação',
    ariaCursorPick: 'Estilo do cursor do mouse',
    cursorClassic: 'Cursor em flecha clássica',
    cursorThin: 'Cursor palheta fina',
    cursorHeavy: 'Cursor palheta pesada',
    tooltipVideoBg: 'Fundo em vídeo',
    contactEmailLabel: '✉ Email',
    contactWhatsappLabel: 'WhatsApp',
    contactInstagramLabel: 'Instagram',
    contactTiktokLabel: 'TikTok',
    contactResumeLabel: 'Currículo',

    galleryPrevAria: 'Imagem anterior',
    galleryNextAria: 'Próxima imagem',
    galleryLightboxAria: 'Ver imagem ampliada',
    galleryAlt: 'Galeria {n}',
    galleryFullSizeAlt: 'Tamanho completo',

    contentReelPrevAria: 'Reel anterior',
    contentReelNextAria: 'Próximo reel',

    showsPrev: '◀ anterior',
    showsNext: 'próximo ▶',
    showsCalendarTitle: 'Calendário',
    showsDateLabel: 'Data do show:',
    showsBookCta: 'agende o próximo show!',
    showsImgAlt: 'Foto do show {date}',

    musicTitleBar: 'Francisco Nogueira — player',
    musicClose: 'Fechar',
    musicMenubar: 'Arquivo Editar Opções Ajuda',
    musicVolume: 'Volume:-',
    musicPlaylist: 'Playlist',
    musicStatusPlaying: 'Tocando',
    musicStatusPaused: 'Em pausa',
    musicTrackOf: 'Faixa {current} de {total}',
    musicStart: 'Iniciar',
    musicPause: 'Pausar',
    musicPlaybackFailed: 'Reprodução falhou',
    musicLoadFailed: 'Falha ao carregar o áudio',
    musicFooterPlayer: 'Player de música',
    musicFooterArtist: 'Francisco Nogueira',
    musicSoundcloudLink: 'Sets completos no Soundcloud',
    musicYoutubeLink: 'Assistir no YouTube',
    musicTimeLocale: 'pt-BR',
  },

  'en-US': {
    navAbout: 'about me',
    navMusic: 'music',
    navGallery: 'gallery',
    navContent: 'content',
    navShows: 'shows',
    navContact: 'contact',
    heroTagline: 'music producer, bassist, multi-instrumentalist, content creator',
    sectionAbout: 'About me',
    sectionMusic: 'Music',
    sectionGallery: 'Gallery',
    sectionContent: 'Content',
    sectionShows: 'Shows',
    sectionContact: 'Contact',
    aboutBio1:
      'Francisco Nogueira is a music producer, bassist, multi-instrumentalist, and content creator based in São Paulo, Brazil.',
    aboutBio2:
      'With a passion for crafting sounds across multiple instruments and production styles, the focus is on collaboration and bringing creative visions to life—whether in the studio, on stage, or through digital content.',
    aboutBio3: 'Available for sessions, collaborations, and creative projects.',
    aboutBio4: 'Reach out to connect and create.',
    notepadMenubarAbout: 'File  Edit  Format  View  Help',
    openMusicPlayer: 'Open Music Player',
    spotifyIframeTitle: 'Fran Nogueira — RECS on Spotify',
    footerCopyright: '© {year} Francisco Nogueira',
    ariaLangSwitch: 'Site language',
    navMenuOpen: 'Open navigation menu',
    navMenuClose: 'Close navigation menu',
    ariaCursorPick: 'Mouse cursor style',
    cursorClassic: 'Classic arrow cursor',
    cursorThin: 'Thin pick cursor',
    cursorHeavy: 'Heavy pick cursor',
    tooltipVideoBg: 'Video background',
    contactEmailLabel: '✉ Email',
    contactWhatsappLabel: 'WhatsApp',
    contactInstagramLabel: 'Instagram',
    contactTiktokLabel: 'TikTok',
    contactResumeLabel: 'Resume',

    galleryPrevAria: 'Previous image',
    galleryNextAria: 'Next image',
    galleryLightboxAria: 'View image',
    galleryAlt: 'Gallery {n}',
    galleryFullSizeAlt: 'Full size',

    contentReelPrevAria: 'Previous reel',
    contentReelNextAria: 'Next reel',

    showsPrev: '◀ Previous',
    showsNext: 'Next ▶',
    showsCalendarTitle: 'Calendar',
    showsDateLabel: 'Show date:',
    showsBookCta: 'Book the next show!',
    showsImgAlt: 'Show photo {date}',

    musicTitleBar: 'Francisco Nogueira music player',
    musicClose: 'Close',
    musicMenubar: 'File  Edit  Options  Help',
    musicVolume: 'Volume:-',
    musicPlaylist: 'Playlist',
    musicStatusPlaying: 'Playing',
    musicStatusPaused: 'Paused',
    musicTrackOf: 'Track {current} of {total}',
    musicStart: 'Start',
    musicPause: 'Pause',
    musicPlaybackFailed: 'Playback failed',
    musicLoadFailed: 'Failed to load audio',
    musicFooterPlayer: 'Music Player',
    musicFooterArtist: 'Francisco Nogueira',
    musicSoundcloudLink: 'Full Sets on Soundcloud',
    musicYoutubeLink: 'Watch on YouTube',
    musicTimeLocale: 'en-US',
  },
}

/**
 * @param {'pt-BR' | 'en-US'} locale
 * @param {keyof STRINGS['en-US']} key
 */
export function t(locale, key) {
  const table = STRINGS[locale] || STRINGS[DEFAULT_LOCALE]
  return table[key] ?? STRINGS['en-US'][key] ?? String(key)
}

/**
 * Replace `{name}` placeholders in translated strings.
 * @param {'pt-BR' | 'en-US'} locale
 * @param {string} key
 * @param {Record<string, string | number>} vars
 */
export function tVars(locale, key, vars = {}) {
  let s = t(locale, key)
  Object.entries(vars).forEach(([k, v]) => {
    s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
  })
  return s
}
