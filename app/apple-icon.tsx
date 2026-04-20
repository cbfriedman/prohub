import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0b1220 0%, #1e293b 55%, #334155 100%)',
          color: '#f8fafc',
          fontSize: 112,
          fontWeight: 800,
          letterSpacing: -6,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          position: 'relative',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>P</span>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: '#38bdf8',
            marginLeft: 6,
            marginTop: 58,
            boxShadow: '0 0 32px rgba(56, 189, 248, 0.55)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
