
import React, { createContext, useContext, ReactNode } from 'react';

interface DragDropContextType {
  // Context for managing drag and drop state
}

const DragDropContext = createContext<DragDropContextType>({});

export const useDragDrop = () => useContext(DragDropContext);

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  return (
    <DragDropContext.Provider value={{}}>
      {children}
    </DragDropContext.Provider>
  );
};