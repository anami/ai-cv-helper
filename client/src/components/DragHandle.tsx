interface DragHandleProps {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
}

export function DragHandle({ onMouseDown }: DragHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1.5 cursor-col-resize bg-gray-200 hover:bg-blue-400 transition-colors shrink-0"
    />
  );
}
