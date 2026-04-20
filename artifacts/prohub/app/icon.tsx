import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 8,
          color: '#f8fafc',
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          position: 'relative',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>P</span>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: 999,
            background: '#38bdf8',
            marginLeft: 1,
            marginTop: 10,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
