'use client';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

export default function ImagePlaceholder({ 
  width = 400, 
  height = 300, 
  text = 'Image', 
  className = '' 
}: ImagePlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#2a2a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '1rem',
        fontWeight: 500,
        border: '2px dashed #3a3a3a',
      }}
    >
      {text}
    </div>
  );
}