import Tooltip from "@mui/material/Tooltip";
import { IHeaderParams } from "ag-grid-community";
import { useEffect, useRef, useState } from "react";

export default function HeaderTooltipRenderer(props: IHeaderParams) {
  const ref = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      setShowTooltip(el.scrollWidth > el.clientWidth);
    }
  }, [props.displayName]);

  return (
    <Tooltip title={showTooltip ? props.displayName : ""}>
      <div
        ref={ref}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          fontWeight: 500,
        }}
      >
        {props.displayName}
      </div>
    </Tooltip>
  );
}
