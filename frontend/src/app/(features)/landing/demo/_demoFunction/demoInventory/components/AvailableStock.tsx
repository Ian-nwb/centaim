import React from "react";
import { IconPackage, IconArrowUp, IconArrowDown } from "@tabler/icons-react";

const AvailableStockCard = ({
  title = "Available stock",
  stock = "24,618",
  value = "$219,857",
  changePercent = "+20%",
  todayChange = "+1,472 today",
  changeColor = "green",
  changeIndicator = "blue",
  trend = "up"
}) => {
  const TrendIcon = trend === "up" ? IconArrowUp : IconArrowDown;

  return (
    <div className="inventory-left-availableStock">
      <span
        className="availableStock-indicator"
        style={{ backgroundColor: changeIndicator }}
      />
      {/* Header */}
      <div className="availableStock-header">
        <div className="availableStock-header-title">
          <header>{title}</header>
          <IconPackage className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </div>
        <button className="availableStock-btn"></button>
      </div>

      {/* Main Data */}
      <div className="availableStock-data">
        <div className="availableStock-data-all">{stock}</div>
        <div className="availableStock-data-status">
          <p className="availableStock-data-status-value">{value}</p>
          <p className="availableStock-data-status-regular">total value</p>
        </div>
      </div>

      {/* Update */}
      <div className="availableStock-data-update">
        <p className="stock-change">
          <TrendIcon size={16} color={changeColor} />
          <span>{changePercent}</span>
        </p>
        <p>{todayChange}</p>
      </div>
    </div>
  );
};

export default AvailableStockCard;
