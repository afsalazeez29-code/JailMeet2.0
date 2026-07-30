import type { ReactNode } from 'react';
import { LANDING_MEDIA_URLS } from '@features/landing/landing-assets';

type LandingAboutProps = {
  arrowIcon: ReactNode;
};

export default function LandingAbout({ arrowIcon }: LandingAboutProps) {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <h3>Our Mission: Keeping Families Connected</h3>
            <img
              src={LANDING_MEDIA_URLS.prisonerSection}
              className="img-fluid rounded-4 mb-4"
              alt="Prison visit support"
            />
            <p>JailMeet is an innovative online platform designed to simplify the process of visiting incarcerated loved ones and managing parole requests.
               Our mission is to bridge the gap between inmates and their families by providing a seamless, secure, and user-friendly system for scheduling prison visits.
                With just a few clicks, visitors can book appointments, receive real-time updates, and access essential resources—all while ensuring compliance with correctional facility regulations.
                 JailMeet saves time, reduces stress, and helps maintain vital family connections during challenging times.</p>
        <p>We understand the emotional and logistical difficulties of staying in touch with someone in prison, which is why JailMeet also offers support for parole applications and legal guidance.
           Our platform is built with privacy and convenience in mind, allowing users to submit requests, track their status, and receive notifications—all from one centralized location.
            Whether you're planning a visit or navigating the parole process, JailMeet is your trusted partner in fostering hope, connection, and a smoother journey toward rehabilitation and reunification.</p>
          </div>

          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="250">
            <div className="content ps-0 ps-lg-5">
              <p className="fst-italic">Key Benefits of JailMeet:</p>
              <ul>
                <li>
                  <i className="bi bi-check-circle-fill"></i>{' '}
                  <span>
                    Easy Scheduling
                    {arrowIcon}
                    Book prison visits quickly and receive instant
                    confirmations.
                  </span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>{' '}
                  <span>
                    Parole Assistance
                    {arrowIcon}
                    Submit and track parole requests with expert guidance.
                  </span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>{' '}
                  <span>
                    Secure & Reliable
                    {arrowIcon}
                    A trusted platform that ensures privacy and compliance.
                  </span>
                </li>
              </ul>
              <p>
         At JailMeet, we believe that no barrier should keep you from supporting your loved ones.
          Our platform is designed to make every step—from scheduling visits to navigating parole—simple and stress-free.
           With JailMeet, you can focus on what truly matters: maintaining hope, connection, and a path toward reunification. 
            Start your journey today and experience a smoother, more compassionate way to stay close, even when miles apart.
              </p>
              <div className="position-relative">
                <img
                  src={LANDING_MEDIA_URLS.videoThumbnail}
                  className="img-fluid rounded-4"
                  alt="JailMeet introduction video"
                />

                <a
                  href={LANDING_MEDIA_URLS.introductionVideo}
                  className="glightbox pulsating-play-btn"
                  aria-label="Play JailMeet introduction video"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
