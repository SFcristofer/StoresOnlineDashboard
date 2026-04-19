import React from 'react';

// Mapeo exacto de los componentes del Admin para la web final
const Components: Record<string, React.FC<any>> = {
  Container: ({ children, padding, margin, background, flexDir }: any) => (
    <div style={{
      padding: `${padding || 0}px`,
      margin: `${margin || 0}px`,
      background: background || 'transparent',
      display: 'flex',
      flexDirection: flexDir || 'column',
      gap: '16px',
      width: '100%'
    }}>
      {children}
    </div>
  ),
  Text: ({ text, fontSize, color, fontWeight, textAlign }: any) => (
    <p style={{ 
      fontSize: `${fontSize || 16}px`, 
      color: color || 'white', 
      fontWeight: fontWeight || 'normal', 
      textAlign: textAlign || 'left', 
      margin: 0 
    }}>
      {text}
    </p>
  ),
  Button: ({ text, color, bgColor }: any) => (
    <div>
      <button 
        style={{ backgroundColor: bgColor || '#3b82f6', color: color || 'white' }} 
        className="px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform"
      >
        {text}
      </button>
    </div>
  ),
  Image: ({ src, width, borderRadius, height }: any) => (
    <div style={{ width: width || '100%' }}>
      <img 
        src={src || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'} 
        style={{ borderRadius: `${borderRadius || 0}px`, height: height || 'auto', objectFit: 'cover' }} 
        className="w-full shadow-2xl" 
      />
    </div>
  ),
  Carousel: ({ children, height }: any) => (
    <div 
      style={{ height: `${height || 300}px`, minHeight: '100px' }} 
      className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 custom-scrollbar"
    >
      {/* Envolvemos a los hijos para que tengan un ancho mínimo y funcionen bien en el carrusel */}
      {React.Children.map(children, child => (
        <div className="snap-center shrink-0 min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw] h-full">
          {child}
        </div>
      ))}
    </div>
  )
};

export const CraftRenderer = ({ json }: { json: string | object }) => {
  if (!json) return null;
  
  let nodes: any = {};
  try {
    nodes = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (e) {
    return null;
  }

  // Función recursiva que construye el árbol de React a partir del JSON de Craft
  const renderNode = (nodeId: string): React.ReactNode => {
    const node = nodes[nodeId];
    if (!node) return null;

    const ComponentName = node.type.resolvedName;
    const Component = Components[ComponentName];
    
    if (!Component) return null; // Ignorar componentes desconocidos

    const childrenNodes = node.nodes || [];
    const children = childrenNodes.map((id: string) => renderNode(id));

    return (
      <Component key={nodeId} {...node.props}>
        {children}
      </Component>
    );
  };

  return <>{renderNode('ROOT')}</>;
};
