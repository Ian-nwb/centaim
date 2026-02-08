import React from "react";
import { IconClipboardCheck, IconChecklist } from "@tabler/icons-react";

type InventoryStat = {
  color: string;
  label: string;
  value: number;
};

type Props = {
  inventoryStats: InventoryStat[];
};

export default function InventoryRight({ inventoryStats }: Props) {
  return (
    <section className="inventory-content-right">
      <div className='inventory-content-right-btns'>
        <button>
          <IconClipboardCheck size={18} />
          <span>Review Request</span>
        </button>

        <button>
          <IconChecklist size={18} />
          <span>Assigned Task</span>
        </button>
      </div>

      <div className="inventory-content-right-graph">
        {inventoryStats.map((item, index) => (
          <div
            key={index}
            className="graph-bar-horizontal"
            style={{ width: `${item.value}%`, backgroundColor: item.color }}
          ></div>
        ))}
      </div>

      <div className='inventory-content-right-summary'>
        {inventoryStats.map((item, index) => (
          <div key={index} className="summary-row">
            <span
              className="summary-dot"
              style={{ backgroundColor: item.color }}
            ></span>

            <span className="summary-label">{item.label}</span>

            <span className="summary-value">
              {item.value} request
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
