import React from 'react';
import { AppComponent, AppPage } from './MobileAppBuilder';
import { ComponentRenderer } from './ComponentRenderer';

interface MobilePreviewProps {
  page: AppPage;
  onUpdateComponents: (components: AppComponent[]) => void;
  pages: AppPage[];
  onMoveComponentBetweenPages: (componentId: string, fromPageId: string, toPageId: string, dropX: number, dropY: number) => void;
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({
  page,
  onUpdateComponents,
  pages,
  onMoveComponentBetweenPages,
  selectedComponent,
  onSelectComponent
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 25;
    
    if (data.type === 'new-component') {
      const newComponent: AppComponent = {
        id: `component-${Date.now()}`,
        type: data.componentType,
        x: Math.max(0, Math.min(x, 270)),
        y: Math.max(0, Math.min(y, 550)),
        width: 100,
        height: 40,
        content: data.content,
        style: {
          backgroundColor: data.componentType === 'button' ? '#3b82f6' : 'transparent',
          color: data.componentType === 'button' ? 'white' : '#1f2937',
          fontSize: 14,
          borderRadius: 8
        }
      };

      onUpdateComponents([...page.components, newComponent]);
    } else if (data.type === 'existing-component') {
      // Handle moving component between pages
      onMoveComponentBetweenPages(data.componentId, data.fromPageId, page.id, x, y);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleComponentMove = (componentId: string, newX: number, newY: number) => {
    const updatedComponents = page.components.map(component =>
      component.id === componentId
        ? { ...component, x: Math.max(0, Math.min(newX, 270)), y: Math.max(0, Math.min(newY, 550)) }
        : component
    );
    onUpdateComponents(updatedComponents);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Mobile Frame */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-80 h-[640px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-6 bg-gray-50 flex items-center justify-between px-4 text-xs">
              <span>9:41</span>
              <span>●●●</span>
            </div>
            
            {/* Page Header */}
            <div className="h-12 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <h3 className="text-white font-semibold">{page.name}</h3>
            </div>

            {/* Droppable Area */}
            <div
              className="relative w-full h-[552px] bg-gray-50 border-2 border-dashed border-transparent hover:border-blue-300 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Components */}
              {page.components.map((component) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  isSelected={selectedComponent === component.id}
                  onMove={handleComponentMove}
                  onSelect={onSelectComponent}
                  pageId={page.id}
                  onStartCrossPageDrag={(componentId, fromPageId) => {
                    // Set up cross-page drag data
                    const dragData = {
                      type: 'existing-component',
                      componentId,
                      fromPageId
                    };
                    // This will be handled by the ComponentRenderer
                  }}
                />
              ))}

              {/* Drop Zone Hint */}
              {page.components.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">Drop components here</p>
                    <p className="text-sm">Drag from library or other pages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
