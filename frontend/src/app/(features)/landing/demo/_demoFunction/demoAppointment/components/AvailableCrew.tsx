import { IconArrowRight,  IconCircle, IconUsers} from "@tabler/icons-react";

const AvailableCrew = () => {
  return (
    <main className="home-top-main-left-up">
      <div className="home-top-main-left-up-header">
        <div className="home-top-main-left-up-header-main">
          <header>Available staff</header>
          <IconUsers className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </div>

        {/* <Link to="/admin/availability"> */}
          <button className="home-top-main-left-up-header-btn">
            <IconArrowRight className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
          </button>
        {/* </Link> */}
      </div>

      <div className="home-top-main-left-up-data">
        <div className="home-top-main-left-up-data-all">
          {/* <p>availableCrewCount</p> */}
          <p>241</p>
        </div>
        <div className="home-top-main-left-up-data-complete">
          <p>+36 Today</p>
        </div>
      </div>

      <div className="home-top-main-left-up-job">
        <header className="home-top-main-left-up-job-header">
          <p>Job titles</p>
        </header>

        <main className="home-top-main-left-up-job-main">
          {/* {jobTitleItems.map(({ title, count }) => ( */}
          <div className="home-top-main-left-up-job-main-card">
            <IconCircle 
              className="demo-icons" 
              strokeWidth={2} 
              color="var(--primary-color-opacity-15)"  
              fill="var(--primary-color-opacity-15)"  
            />
            <p>Chief Engineer</p>
            <p>(21)</p>
          </div>

          <div className="home-top-main-left-up-job-main-card">
            
            <IconCircle 
              className="demo-icons" 
              strokeWidth={2} 
              color="var(--primary-color-opacity-15)"  
              fill="var(--primary-color-opacity-15)"  
            />
            <p>Engineer</p>
            <p>(48)</p>
          </div>

          <div className="home-top-main-left-up-job-main-card">
            
            <IconCircle 
              className="demo-icons" 
              strokeWidth={2} 
              color="var(--primary-color-opacity-15)"  
              fill="var(--primary-color-opacity-15)"  
            />
            <p>Trainee Engineer</p>
            <p>(11)</p>
          </div>
          {/* ))} */}
        </main>
      </div>
    </main>
  );
};

export default AvailableCrew;