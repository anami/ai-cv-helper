interface DragHandleProps {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
}

export function DragHandle({ onMouseDown }: DragHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1.5 cursor-col-resize bg-slate-800 hover:bg-blue-500 transition-colors shrink-0"
    />
  );
}
