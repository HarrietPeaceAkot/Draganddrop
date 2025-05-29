import React, { useState } from 'react';
import { AppPage, AppComponent } from './MobileAppBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface PageManagerProps {
  pages: AppPage[];
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponents: (pageId: string, components: AppComponent[]) => void;
}

export const PageManager: React.FC<PageManagerProps> = ({
  pages,
  onAddPage,
  onDeletePage,
  selectedComponent,
  onSelectComponent,
  onUpdateComponents
}) => {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (page: AppPage) => {
    setEditingPageId(page.id);
    setEditName(page.name);
  };

  const saveEdit = () => {
    setEditingPageId(null);
  };

  const cancelEdit = () => {
    setEditingPageId(null);
    setEditName('');
  };

  const deleteComponent = (componentId: string) => {
    const pageWithComponent = pages.find(page => 
      page.components.some(c => c.id === componentId)
    );
    
    if (pageWithComponent) {
      const updatedComponents = pageWithComponent.components.filter(c => c.id !== componentId);
      onUpdateComponents(pageWithComponent.id, updatedComponents);
      onSelectComponent(null);
    }
  };

  const getComponentPage = (componentId: string) => {
    return pages.find(page => page.components.some(c => c.id === componentId));
  };

  const selectedComponentData = selectedComponent ? 
    pages.flatMap(p => p.components).find(c => c.id === selectedComponent) : null;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Pages</h2>
        <Button onClick={onAddPage} size="sm" className="gap-2">
          <Plus size={16} />
          Add Page
        </Button>
      </div>

      <div className="space-y-2 mb-6">
        {pages.map((page) => (
          <div
            key={page.id}
            className="p-4 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              {editingPageId === page.id ? (
                <div className="flex-1 mr-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="h-8"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{page.name}</h3>
                  <p className="text-sm text-gray-500">
                    {page.components.length} component{page.components.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Component List */}
            {page.components.length > 0 && (
              <div className="mt-3 space-y-1">
                {page.components.slice(0, 3).map((component) => (
                  <div
                    key={component.id}
                    className={`flex items-center gap-2 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                      selectedComponent === component.id 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => onSelectComponent(component.id)}
                  >
                    <div className={`w-2 h-2 rounded ${
                      component.type === 'button' ? 'bg-blue-500' :
                      component.type === 'text' ? 'bg-green-500' :
                      component.type === 'image' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <span className="capitalize">{component.type}</span>
                    <span className="text-gray-400">•</span>
                    <span className="truncate">{component.content}</span>
                  </div>
                ))}
                {page.components.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{page.components.length - 3} more
                  </div>
                )}
              </div>
            )}

            {/* Page Actions */}
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(page);
                }}
                className="h-7 px-2 text-xs"
              >
                Rename
              </Button>
              {pages.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage(page.id);
                  }}
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Component Actions */}
      {selectedComponent && selectedComponentData && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-3 text-gray-800">Selected Component</h4>
          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {selectedComponentData.type}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Content:</span> {selectedComponentData.content}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Page:</span> {getComponentPage(selectedComponent)?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteComponent(selectedComponent)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectComponent(null)}
            >
              Deselect
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-gray-800 mb-2">How to Use</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drag components from library to any page</li>
          <li>• Drag components between pages directly</li>
          <li>• Click components to select and edit</li>
          <li>• All pages are visible side by side</li>
        </ul>
      </div>
    </div>
  );
};
