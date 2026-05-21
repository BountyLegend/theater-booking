export const theme = {
  colors: {
    background: '#0a0a0c',
    surface: '#16161a',
    surfaceVariant: '#242429',
    primary: '#D4AF37',
    primaryLight: '#f0d67f',
    secondary: '#8a2be2',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    error: '#ff4d4d',
    success: '#00cc66',
    border: '#333338',
  },
  spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
  borderRadius: { s: 8, m: 16, l: 24, round: 999 },
  typography: {
    h1: { fontSize: 36, fontWeight: '800' as const, letterSpacing: 0 },
    h2: { fontSize: 28, fontWeight: '700' as const },
    h3: { fontSize: 22, fontWeight: '600' as const },
    body: { fontSize: 16, lineHeight: 24 },
    caption: { fontSize: 14, color: '#a0a0a0' },
  },
  shadows: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
};