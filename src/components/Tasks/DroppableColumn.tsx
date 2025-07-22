import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
  children: React.ReactNode;
  id: string;
}

export function DroppableColumn({ children, id }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-colors ${
        isOver ? 'bg-muted/50 rounded-lg' : ''
      }`}
    >
      {children}
    </div>
  );
}