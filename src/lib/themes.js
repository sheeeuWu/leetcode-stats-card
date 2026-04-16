export const themes = {
  dark: {
    background:  '161b22',
    border:      '30363d',
    text:        'ffffff',
    subtext:     '8b949e',
    card:        '0d1117',
    easy:        '22c55e',
    medium:      'f89f1b',
    hard:        'ef4444',
    accent:      'fefe5b',
  },
  light: {
    background:  'ffffff',
    border:      'd0d7de',
    text:        '1f2328',
    subtext:     '656d76',
    card:        'f6f8fa',
    easy:        '22c55e',
    medium:      'f89f1b',
    hard:        'ef4444',
    accent:      'b45309',
  },
  transparent: {
    background:  '00000000',
    border:      '30363d',
    text:        'ffffff',
    subtext:     '8b949e',
    card:        'ffffff0d',
    easy:        '22c55e',
    medium:      'f89f1b',
    hard:        'ef4444',
    accent:      'fefe5b',
  },
}

export function getTheme(themeName, customParams = {}) {
  const base = themes[themeName] ?? themes.dark

  return {
    ...base,
    ...(customParams.bg     && { background: customParams.bg }),
    ...(customParams.border && { border:     customParams.border }),
    ...(customParams.text   && { text:       customParams.text }),
    ...(customParams.ring   && { easy:       customParams.ring,
                                 medium:     customParams.ring,
                                 hard:       customParams.ring }),
    ...(customParams.accent && { accent:     customParams.accent }),
  }
}