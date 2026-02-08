import "../demoUI.css";

import { IconUserPlus, IconArrowRight } from "@tabler/icons-react";

const TotalCrew = () => {
  return (
    <main className="home-top-main-left-down">
      <div className="home-top-main-left-down-header">
        <div className="home-top-main-left-down-header-main">
          <header>Weekly new applicants</header>
          {/* <User_Add
            style={{ color: 'var(--primary-color)', width: '20px', height: '20px', '--stroke-width': '7px' }}
          /> */}
          {/* <p>User_Add</p> */}
          <IconUserPlus className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </div>

        <button className="home-top-main-left-down-header-btn">
          {/* <Arrow_Right_SM
            style={{ color:'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
          /> */}
          {/* <p>Arrow_Right_SM</p> */}
          <IconArrowRight className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </button>
      </div>

      <div className="home-top-main-left-down-data">
        <div className="home-top-main-left-down-data-all">
          {/* <p>totalCrewCount</p> */}
          <p>2,014</p>
        </div>
        <div className="home-top-main-left-up-data-complete">
          <p>+409 Today</p>
        </div>
      </div>
    </main>
  );
};

export default TotalCrew;
