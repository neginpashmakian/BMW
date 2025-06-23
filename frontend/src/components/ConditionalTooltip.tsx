import { Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function ConditionalTooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const el = spanRef.current;
    if (el) {
      setShowTooltip(el.scrollWidth > el.clientWidth);
    }
  }, [content]);

  return (
    <Tooltip title={showTooltip ? content : ""}>
      <span
        ref={spanRef}
        style={{
          display: "inline-block",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
}
