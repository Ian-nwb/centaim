
import { IconCalendar, IconArrowRight } from "@tabler/icons-react";

interface ComingTodayProps {
  count: number;
  earliestTime: string;
}

const ComingToday = ({ count, earliestTime }: ComingTodayProps) => {
  return (
    <main className="home-top-main-mid-up">
      <div className="home-top-main-mid-up-header">
        <div className="home-top-main-mid-up-header-main">
          <header>Coming today</header>
          <IconCalendar className="demo-icons" strokeWidth={2} color="var(--gray-color)"/>
        </div>

        <button>
          <IconArrowRight className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </button>
      </div>

      <div className="home-top-main-mid-up-data">
        {/* <p>todayCount</p> */}
        {/* <p>56</p> */}
        <p>{count}</p>
      </div>

      <div className="home-top-main-mid-up-time">
        <p className="home-top-main-mid-up-time-sub">Arrival time</p>
        <p className="home-top-main-mid-up-time-main">{earliestTime}</p>
      </div>
    </main>
  );
};

export default ComingToday;