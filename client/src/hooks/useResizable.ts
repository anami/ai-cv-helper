import { useState, useCallback, useEffect, useRef } from "react";

export function useResizable(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth);
  const dragging = useRef(false);
  const direction = useRef<"left" | "right">("right");

  const startDragging = useCallback(
    (dir: "left" | "right") => (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      direction.current = dir;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const vw = window.innerWidth;
      let newWidth: number;
      if (direction.current === "right") {
        // Left panel: width = mouse X position
        newWidth = e.clientX;
      } else {
        // Right panel: width = distance from mouse to right edge
        newWidth = vw - e.clientX;
      }
      setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [minWidth, maxWidth]);

  return { width, startDragging };
}
