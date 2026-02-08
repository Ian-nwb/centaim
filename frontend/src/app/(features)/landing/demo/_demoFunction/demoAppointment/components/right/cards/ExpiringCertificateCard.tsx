import { IconCircle, IconBell } from "@tabler/icons-react";

const ExpiringCertificateCard = () => {
  return (
    <div className="home-top-main-right-cards">

      {/* Certificate Card 1 */}
      <main className="home-top-main-right-cards-card">
        <div className="home-top-main-right-cards-card-up">
          {/* <Circle_Primary /> */}
          <IconCircle 
              size={48} 
              strokeWidth={2} 
              color="var(--white-color-opacity-15)"  
              fill="var(--primary-color-opacity-15)"  
          />

          <div className="home-top-main-right-cards-card-up-text">
            <p className="home-top-main-right-cards-card-up-text-name">John R. Smith</p>
            <p className="home-top-main-right-cards-card-up-text-cert">Training Certificate</p>
          </div>
        </div>

        <div className="home-top-main-right-cards-card-down">
          <button className="home-top-main-right-cards-card-down-btn">
            <p>Notify</p>
            <IconBell size={20} strokeWidth={2} />
          </button>

          <div className="home-top-main-right-cards-card-down-text">
            <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
            <p className="home-top-main-right-cards-card-down-text-date">JAN 10, 2025</p>
          </div>
        </div>
      </main>

      {/* Certificate Card 2 */}
      <main className="home-top-main-right-cards-card">
        <div className="home-top-main-right-cards-card-up">
          {/* <Circle_Primary /> */}
          <IconCircle 
              size={48} 
              strokeWidth={2} 
              color="var(--white-color-opacity-15)"  
              fill="var(--primary-color-opacity-15)"  
          />

          <div className="home-top-main-right-cards-card-up-text">
            <p className="home-top-main-right-cards-card-up-text-name">Sarah C. WIlliams</p>
            <p className="home-top-main-right-cards-card-up-text-cert">Medical Certificate</p>
          </div>
        </div>

        <div className="home-top-main-right-cards-card-down">
          <button className="home-top-main-right-cards-card-down-btn">
            <p>Notify</p>
            <IconBell size={20} strokeWidth={2} />
          </button>

          <div className="home-top-main-right-cards-card-down-text">
            <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
            <p className="home-top-main-right-cards-card-down-text-date">FEB 04, 2025</p>
          </div>
        </div>
      </main>

      {/* Certificate Card 3 */}
      <main className="home-top-main-right-cards-card">
        <div className="home-top-main-right-cards-card-up">
          {/* <Circle_Primary /> */}
          <IconCircle 
              size={48} 
              strokeWidth={2} 
              color="var(--white-color-opacity-15)"  
              fill="var(--primary-color-opacity-15)"  
          />

          <div className="home-top-main-right-cards-card-up-text">
            <p className="home-top-main-right-cards-card-up-text-name">James D. Jhonson</p>
            <p className="home-top-main-right-cards-card-up-text-cert">Training Certificate</p>
          </div>
        </div>

        <div className="home-top-main-right-cards-card-down">
          <button className="home-top-main-right-cards-card-down-btn">
            <p>Notify</p>
            <IconBell size={20} strokeWidth={2} />
          </button>

          <div className="home-top-main-right-cards-card-down-text">
            <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
            <p className="home-top-main-right-cards-card-down-text-date">MAR 15, 2025</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ExpiringCertificateCard;
