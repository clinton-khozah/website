import Image from 'next/image'

export function Favicon() {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        backgroundColor: '#0f1424',
        borderRadius: '5px',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/images/Picture1.png"
        alt="Favicon"
        width={28}
        height={28}
        style={{
          borderRadius: '3px',
        }}
      />
    </div>
  )
} 