'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';

import SiteFooter from '../../../components/common/SiteFooter';
import LandingAbout from './LandingAbout';
import LandingAssets from './LandingAssets';
import LandingHeader from './LandingHeader';
import LandingHero from './LandingHero';
import { getCurrentUser } from '@features/auth/services/auth.service';
import { getAccessToken } from '@features/auth/services/token.service';
import { LANDING_MEDIA_URLS } from '@features/landing/landing-assets';

export default function LandingPage() {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollTopActive, setIsScrollTopActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setIsScrollTopActive(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-active', isMobileNavOpen);
  }, [isMobileNavOpen]);

  const handleVisitorEntry = async () => {
    const token = getAccessToken();

    if (token) {
      try {
        const user = await getCurrentUser(token);

        if (user.role === 'VISITOR') {
          router.push('/visitor/dashboard');
          return;
        }
      } catch {
        // The shared authenticated request flow clears invalid or expired tokens.
      }
    }

    router.push('/register?role=visitor');
  };

  const arrowIcon = (
    <IoIosArrowForward
      aria-hidden="true"
      style={{
        display: 'inline-block',
        color: '#ff4a17',
        fontSize: '19px',
        margin: '0 5px',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    />
  );

  return (
    <>
      <LandingAssets />

      <LandingHeader
        isLoginDropdownOpen={isLoginDropdownOpen}
        isScrolled={isScrolled}
        onLoginDropdownToggle={() =>
          setIsLoginDropdownOpen((current) => !current)
        }
        onMobileNavToggle={() => setIsMobileNavOpen((current) => !current)}
        onVisitorEntry={() => void handleVisitorEntry()}
      />

      <main className="main">
        <LandingHero onVisitorEntry={() => void handleVisitorEntry()} />
        <LandingAbout arrowIcon={arrowIcon} />

        <section id="stats" className="stats section light-background">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-emoji-smile color-blue flex-shrink-0"></i>
                  <div>
                    <span
                      data-purecounter-start="0"
                      data-purecounter-end="232"
                      data-purecounter-duration="1"
                      className="purecounter"
                    >
                      232
                    </span>
                    <p>Happy Clients</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-journal-richtext color-orange flex-shrink-0"></i>
                  <div>
                    <span
                      data-purecounter-start="0"
                      data-purecounter-end="521"
                      data-purecounter-duration="1"
                      className="purecounter"
                    >
                      521
                    </span>
                    <p>Projects</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-headset color-green flex-shrink-0"></i>
                  <div>
                    <span
                      data-purecounter-start="0"
                      data-purecounter-end="1463"
                      data-purecounter-duration="1"
                      className="purecounter"
                    >
                      1463
                    </span>
                    <p>Hours Of Support</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-people color-pink flex-shrink-0"></i>
                  <div>
                    <span
                      data-purecounter-start="0"
                      data-purecounter-end="15"
                      data-purecounter-duration="1"
                      className="purecounter"
                    >
                      15
                    </span>
                    <p>Hard Workers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Services</h2>
            <p>
              Featured Services
              <br />
            </p>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-5">
              <div className="col-xl-4 col-md-6" data-aos="zoom-in">
                <div className="service-item">
                  <div className="img">
                    <img
                      src={LANDING_MEDIA_URLS.prisoner2}
                      className="img-fluid"
                      alt="Visit Scheduling"
                    />
                  </div>
                  <div className="details position-relative">
                    <div className="icon">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <a className="stretched-link">
                      <h3>Visit Scheduling Made Simple</h3>
                    </a>
                    <p>
                      Book, reschedule, or cancel visits in minutes with
                      real-time confirmations and facility-specific guidelines.
                      Our system keeps you informed every step of the way.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6" data-aos="zoom-in">
                <div className="service-item">
                  <div className="img">
                    <img
                      src={LANDING_MEDIA_URLS.prisoner3}
                      className="img-fluid"
                      alt="Parole Support"
                    />
                  </div>
                  <div className="details position-relative">
                    <div className="icon">
                      <i className="bi bi-file-earmark-text"></i>
                    </div>
                    <a className="stretched-link">
                      <h3>Parole Application Support</h3>
                    </a>
                    <p>
                      Navigate the complex parole process with our step-by-step
                      guidance, document preparation help, and status tracking
                      system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6" data-aos="zoom-in">
                <div className="service-item">
                  <div className="img">
                    <img
                      src={LANDING_MEDIA_URLS.prisoner}
                      className="img-fluid"
                      alt="Virtual Visitation"
                    />
                  </div>
                  <div className="details position-relative">
                    <div className="icon">
                      <i className="bi bi-camera-video"></i>
                    </div>
                    <a className="stretched-link">
                      <h3>Virtual Visitation Solutions</h3>
                    </a>
                    <p>
                      When in-person visits are not possible, connect through
                      secure video calls and digital message delivery services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <a
        href="#hero"
        id="scroll-top"
        className={`scroll-top d-flex align-items-center justify-content-center${
          isScrollTopActive ? ' active' : ''
        }`}
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}
