"use client"

import "./demo.css";
import "./demoMQ.css";

import { IconArrowDown,} from "@tabler/icons-react";
import { IconCalendar, IconDatabase, IconClock } from "@tabler/icons-react";
import { useState } from "react";


import DemoFunction from "./_demoFunction/demoAppointment/demoFunction";
import DemoInventory from "./_demoFunction/demoInventory/demoInventory";

type DemoKey = "appointment" | "inventory";
const Demo = () => {

  const [activeDemo, setActiveDemo] = useState<DemoKey>("appointment");

  const demoOptions: {
    id: DemoKey | "soon";
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
  }[] = [
    { id: "appointment", label: "Appointment", icon: <IconCalendar size={20} /> },
    { id: "inventory", label: "Inventory", icon: <IconDatabase size={20} /> },
    { id: "soon", label: "More soon", icon: <IconClock size={20} />, disabled: true },
  ];

  const demoComponents: Record<DemoKey, React.ComponentType> = {
    appointment: DemoFunction,
    inventory: DemoInventory,
  };

  const ActiveDemo = demoComponents[activeDemo];


return (
    <div className="demo">
      <div className="demo-box">   
        <div className="demo-box-pointer">
          <p  className="demo-box-pointer-regular">Give us a shot!</p>
          <div className="demo-box-pointer-down">
            <IconArrowDown size={"24px"} color="#00889a" />
            <p>Try Our Demo</p>
          </div>
          <div className="select-demo">
            <p className="select-demo-regular">Select the type of demo for you</p>
            {/* <div className="select-demo-options">
              {demoOptions.map((demo) => (
                <button
                  key={demo.id}
                  disabled={demo.disabled}
                  onClick={() => {
                    if (demo.id !== "soon") {
                      setActiveDemo(demo.id);
                    }
                  }}
                  className={activeDemo === demo.id ? "active-demo" : ""}
                >
                  {demo.label}
                </button>
              ))}
            </div> */}
          </div>
        </div>  

        <div className="demo-box-in">

          <div className="demo-box-in-main">  
            {/* demo content here */}
            {/* <p>demo</p> */}
            {/* <DemoFunction /> */}
            {/* <DemoInventory /> */}
            <ActiveDemo />
          </div>

          
          <div className="demo-box-in-toggle">
            <div className="demo-box-in-toggle-bg">
              <div className="select-demo-options-side">
                {demoOptions.map((demo) => (
                  <button
                    key={demo.id}
                    disabled={demo.disabled}
                    data-label={demo.label} 
                    onClick={() => {
                      if (demo.id !== "soon") {
                        setActiveDemo(demo.id);
                      }
                    }}
                    className={activeDemo === demo.id ? "active-demo" : ""}
                  >
                    <span className="demo-btn-icon">{demo.icon}</span>
                  </button>
                ))}
              </div>
            </div> 
          </div>
        </div> {/* demo-box-in */}
      </div> {/* demo-box */}
    </div>
  );
};

export default Demo;