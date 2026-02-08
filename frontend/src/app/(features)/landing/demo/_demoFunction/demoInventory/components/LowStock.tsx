import React from "react";
import { IconPackage, IconArrowDown, IconArrowUp } from "@tabler/icons-react";

const LowStockCard = ({
  title = "Available stock",
  stock = "24,618",
  changePercent = "+20%",
  todayChange = "+1,472 today",
  changeColor = "green",        // arrow + percent color
  changeIndicator = "green",    // right-side line color
  trend = "down",               // "up" or "down"
}) => {
  const TrendIcon = trend === "up" ? IconArrowUp : IconArrowDown;

  return (
    <div className="inventory-left-lowStock">

      {/* Right indicator line */}
      <span
        className="lowStock-indicator"
        style={{ backgroundColor: changeIndicator }}
      />

      {/* Header */}
      <div className="lowStock-header">
        <div className="lowStock-header-title">
          <header>{title}</header>
          <IconPackage className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </div>
        <button className="lowStock-btn"></button>
      </div>

      {/* Main Data */}
      <div className="lowStock-data">
        <div className="lowStock-data-all">{stock}</div>
        <div className="lowStock-data-status"></div>
      </div>

      {/* Update */}
      <div className="lowStock-data-update">
        <p className="lowStock-change" style={{ color: changeColor }}>
          <TrendIcon size={16} color={changeColor} />
          <span>{changePercent}</span>
        </p>
        <p>{todayChange}</p>
      </div>
    </div>
  );
};

export default LowStockCard;
