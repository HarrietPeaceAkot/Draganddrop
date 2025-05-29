import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Square, Image, ArrowRight } from 'lucide-react';

const componentTypes = [
  {
    type: 'button',
    icon: Square,
    label: 'Button',
    defaultContent: 'Click me',
    color: 'bg-blue-500'
  },
  {
    type: 'text',
    icon: Type,
    label: 'Text',
    defaultContent: 'Hello World',
    color: 'bg-green-500'
  },
  {
    type: 'image',
    icon: Image,
    label: 'Image',
    defaultContent: 'Image',
    color: 'bg-purple-500'
  },
  {
    type: 'input',
    icon: ArrowRight,
    label: 'Input',
    defaultContent: 'Enter text',
    color: 'bg-orange-500'
  }
];

export const ComponentLibrary = () => {
  const handleDragStart = (e: React.DragEvent, componentType: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'new-component',
      componentType: componentType.type,
      content: componentType.defaultContent
    }));
  };

  return (
    <div className="p-6 h-full">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Component Library</h2>
      
      <div className="space-y-4">
        {componentTypes.map((component) => {
          const IconComponent = component.icon;
          return (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              className="flex items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 cursor-grab hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className={`p-2 rounded-md ${component.color} text-white mr-3`}>
                <IconComponent size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{component.label}</p>
                <p className="text-sm text-gray-500">Drag to add</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drag components into the mobile preview</li>
          <li>• Move components between pages</li>
          <li>• Click components to edit properties</li>
          <li>• Use the page manager to create new pages</li>
        </ul>
      </div>
    </div>
  );
};
