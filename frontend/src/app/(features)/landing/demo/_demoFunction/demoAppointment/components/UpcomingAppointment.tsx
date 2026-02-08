import { IconCalendarClock, IconArrowRight } from "@tabler/icons-react";

interface UpcomingAppointment {
  count: number;
  earliestDate: string;
} 

const UpcomingAppointment = ({ count, earliestDate }: UpcomingAppointment) => {
  return (
    <main className="home-top-main-mid-down">
      <div className="home-top-main-mid-down-header">
        <div className="home-top-main-mid-down-header-main">
          <header>Upcoming appointment</header>
          <IconCalendarClock className="demo-icons" strokeWidth={2} color="var(--gray-color)"/>

        </div>

        <button className="home-top-main-left-down-header-btn">
          <IconArrowRight className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </button>
      </div>

      <div className="home-top-main-mid-down-data">
        {/* <p>upcomingCount</p> */}
        {/* <p>39</p> */}
        <p>{count}</p>
      </div>

      <div className="home-top-main-mid-down-time">
        <p className="home-top-main-mid-down-time-sub">Arrival date</p>
        {/* set date today dynamic */}
        <p className="home-top-main-mid-down-time-main">{earliestDate}</p>
      </div>
    </main>
  );
};

export default UpcomingAppointment;
