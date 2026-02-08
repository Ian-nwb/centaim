import { IconFileText, IconArrowRight } from "@tabler/icons-react";

import ExpiringCertificateCard from "./cards/ExpiringCertificateCard";

const ExpiringCertificate = () => {
  return (
    <section className="home-top-main-right">
      <div className="home-top-main-right-header">
        <div className="home-top-main-right-header-main">
          <header>Inventory</header>
          <IconFileText className="demo-icons" strokeWidth={2} color="var(--black-color-opacity-60)"/>

        </div>

        <button className="home-top-main-right-header-btn">
          <IconArrowRight className="demo-icons" strokeWidth={2} color="var(--gray-color)" />
        </button>
      </div>

      {/* <HomeCertAdmin /> */}
      {/* <p>HomeCertAdmin</p> */}
      <ExpiringCertificateCard />
    </section>
  );
};

export default ExpiringCertificate;