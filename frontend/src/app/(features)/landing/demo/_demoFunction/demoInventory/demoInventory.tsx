import React from 'react'

import { IconUser, IconCircleCheck } from "@tabler/icons-react";
import { IconDatabase } from "@tabler/icons-react";

import "./demoInventory.css"
import "./demoInventoryMQ.css"

import InventoryRight from './components/InventoryRight';
import AvailableStock from './components/AvailableStock'
import LowStock from './components/LowStock'

export default function demoInventory() {
  const inventoryStats = [
    { color: "green", label: "Receive stock", value: 318 },
    { color: "yellow", label: "Dispatch stock", value: 201 },
    { color: "orange", label: "Adjust stock", value: 72 },
    { color: "red", label: "Transfer stock", value: 198 },
  ];

  return (
    <div className='demo-inventory'>
        <div className="demo-inventory-container">
            <div className="inventory-container-in">
                <header className='inventory-header'>
                  <div className='inventory-header-left'>
                    <div className="profile-avatar">
                      <IconUser size={20} color="white" />
                    </div>
                    <p>Warehouse 1</p>
                  </div>

                  <button 
                    className="home-top-header-button"
                  >
                    <IconDatabase className="global-icons" strokeWidth={2} />
                    <p className="home-top-header-button-text">Manage Stock</p>
                  </button>
                </header>
                <main className='inventory-content'>
                  <section className="inventory-content-left">
                    <AvailableStock
                      // title=''
                      changeColor='green'
                      stock="24,618"
                      value="$219,857"
                      changePercent="+20%"
                      todayChange="+1,472 today"
                      changeIndicator="blue"
                      trend="up"
                    />
                    <div className="inventory-content-left-bottom">
                      <LowStock 
                      title='Low stock'
                      stock="618"
                      changePercent="-19%"
                      todayChange="-172 today"
                      changeColor='red'
                      changeIndicator="orange"
                      trend="down"
                    />
                      <LowStock 
                      title='Low stock'
                      stock="89"
                      changePercent="+19%"
                      todayChange="-18 today"
                      changeColor='red'
                      changeIndicator="red"
                      trend="down"  
                    />
                    </div>
                  </section>
                    
                  <section className="inventory-content-mid">
                    <div className="inventory-mid-overview">
                      <div className='overview-header-title'>
                        <header>Request overview</header>
                        <IconCircleCheck className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
                      </div>

                      <div className="overview-data">
                        <div className="overview-data-all">840</div>
                      </div>
                    </div>

                    <div className="overview-data-details">
                      
                    </div>
                  </section>

                  <InventoryRight inventoryStats={inventoryStats} />
                </main>
            </div>
        </div>
    </div>
  )
}
