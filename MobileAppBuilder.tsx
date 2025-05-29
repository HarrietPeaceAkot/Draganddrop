import React, { useState } from 'react';
import { ComponentLibrary } from './ComponentLibrary';
import { MobilePreview } from './MobilePreview';
import { PageManager } from './PageManager';
import { DragDropProvider } from './DragDropProvider';

export interface AppComponent {
  id: string;
  type: 'button' | 'text' | 'image' | 'input';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style?: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    borderRadius?: number;
  };
}

export interface AppPage {
  id: string;
  name: string;
  components: AppComponent[];
}

export const MobileAppBuilder = () => {
  const [pages, setPages] = useState<AppPage[]>([
    {
      id: 'page-1',
      name: 'Home',
      components: []
    }
  ]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const addPage = () => {
    const newPage: AppPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      components: []
    };
    setPages([...pages, newPage]);
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
  };

  const updatePageComponents = (pageId: string, components: AppComponent[]) => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, components } : page
    ));
  };

  const moveComponentBetweenPages = (componentId: string, fromPageId: string, toPageId: string, dropX: number, dropY: number) => {
    const fromPage = pages.find(p => p.id === fromPageId);
    const toPage = pages.find(p => p.id === toPageId);
    
    if (!fromPage || !toPage || fromPageId === toPageId) return;

    const component = fromPage.components.find(c => c.id === componentId);
    if (!component) return;

    // Remove from source page
    const updatedFromComponents = fromPage.components.filter(c => c.id !== componentId);
    
    // Add to destination page with new position
    const updatedToComponents = [...toPage.components, {
      ...component,
      x: Math.max(0, Math.min(dropX, 270)),
      y: Math.max(0, Math.min(dropY, 550))
    }];

    setPages(pages.map(page => {
      if (page.id === fromPageId) {
        return { ...page, components: updatedFromComponents };
      }
      if (page.id === toPageId) {
        return { ...page, components: updatedToComponents };
      }
      return page;
    }));
  };

  return (
    <DragDropProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Left Sidebar - Component Library */}
        <div className="w-80 bg-white shadow-xl border-r border-gray-200">
          <ComponentLibrary />
        </div>

        {/* Center - Mobile Previews */}
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Mobile App Builder
            </h1>
            <p className="text-gray-600 mt-2">Drag components between pages to build your mobile app</p>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-8 min-w-max pb-6">
              {pages.map((page) => (
                <div key={page.id} className="flex-shrink-0">
                  <MobilePreview
                    page={page}
                    onUpdateComponents={(components) => updatePageComponents(page.id, components)}
                    pages={pages}
                    onMoveComponentBetweenPages={moveComponentBetweenPages}
                    selectedComponent={selectedComponent}
                    onSelectComponent={setSelectedComponent}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Page Manager */}
        <div className="w-80 bg-white shadow-xl border-l border-gray-200">
          <PageManager
            pages={pages}
            onAddPage={addPage}
            onDeletePage={deletePage}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onUpdateComponents={updatePageComponents}
          />
        </div>
      </div>
    </DragDropProvider>
  );
};
