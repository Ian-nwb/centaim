'use client'
import "./demoUI.css";
import "./demoUIMQ.css";

import AvailableCrew from "./components/AvailableCrew";
import ComingToday from "./components/ComingToday";
import ExpiringCertificate from "./components/right/ExpiringCertificate";
import TotalCrew from "./components/TotalCrew";
import UpcomingAppointment from "./components/UpcomingAppointment";

import AppointmentModal from "./components/modal/AppointmentModal";
import ConfirmationModal from "./components/modal/ConfirmationModal";

import { Grid3x3, CalendarCheck } from "lucide-react";
import { useState } from "react";

const DemoUI = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState ({
    name: '',
    time: '',
    date: ''
  });
  const [todayCount, setTodayCount] = useState(56);
  const [upcomingCount, setUpcomingCount] = useState(39);
  const [earliestTodayTime, setEarliestTodayTime] = useState("10:30");
  const [earliestUpcomingDateISO, setEarliestUpcomingDateISO] = useState(() =>{
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  });

  const formattedupcomingDate = new Date(earliestUpcomingDateISO).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric' })

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isEarlierTime = (newTime: string, current: string): boolean => {
    const [h1, m1] = newTime.split(':').map(Number);
    const [h2, m2] = current.split(':').map(Number);
    const min1 = h1 * 60 + m1;
    const min2 = h2 * 60 + m2;
    return min1 < min2;
  };

  const isEarlierDate = (newDateISO: string, currentISO: string): boolean => {
    // const currentDate = new Date(currentFormatted).toISOString().split('T')[0];
    return newDateISO < currentISO;
  };

  const handleBook = (type: 'today' | 'upcoming', time?: string, date?: string, name?: string, job?: string) => {
    console.log(`Booked: ${name} (${job}) on ${date} at ${time || 'N/A'} - Type: ${type}`);

    if (type === 'today') {
      setTodayCount((prev) => prev + 1);
      if (time && isEarlierTime(time, earliestTodayTime)) {
        setEarliestTodayTime(time);
      }
    } else {
      setUpcomingCount((prev) => prev + 1);
      if (date && isEarlierDate(date, earliestUpcomingDateISO)) {
        setEarliestUpcomingDateISO(formatDate(date));
      }
    }

    const formattedDate = date ? formatDate(date) : '';
    const displayTime = time || 'TBD';
    setConfirmationDetails({ name: name || '', time: displayTime, date: formattedDate });

    setShowConfirmation(true);
    setShowModal(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="home">
      <div className="home-box">
        <main className="home-box-in">
          <div className="home-top">
            <header className="home-top-header">
              <div className="home-top-header-heading">
                {/* <Grid3x3 size="var(--icon-size)" /> */}
                <Grid3x3 className="global-icons"  style={{ color: 'black' }}/>
                 {/* <Grid3x3 size={24} /> */}
                <p>Dashboard</p>
              </div>
              <button 
                className="home-top-header-button"
                onClick={() => setShowModal(true)}
              >
                <CalendarCheck className="global-icons" strokeWidth={2} />
                <p className="home-top-header-button-text">Book now</p>
              </button>
            </header>

            <main className="home-top-main">
              <section className="home-top-main-left">
                <AvailableCrew />
                <TotalCrew />
              </section>

              <section className="home-top-main-mid">
                <ComingToday count={todayCount} earliestTime={earliestTodayTime} />
                <UpcomingAppointment count={upcomingCount} earliestDate={formattedupcomingDate} />
              </section>

              <ExpiringCertificate />
            </main>
          </div>            
        </main>

        {showModal && (
          <AppointmentModal 
            onClose={() => setShowModal(false)} 
            onBook={handleBook} 
          />
        )}

        {showConfirmation && (
          <ConfirmationModal
          name={confirmationDetails.name}
          time={confirmationDetails.time}
          date={confirmationDetails.date}
          onClose={handleCloseConfirmation}
          />
        )}
      </div>
    </div>
  );
};

export default DemoUI;