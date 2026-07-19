'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';

import LandingAssets from '../components/legacy/landing/LandingAssets';

const landingAssets = '/legacy/landing';

export default function HomePage() {
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

      <header
        id="header"
        className={`header d-flex align-items-center fixed-top${
          isScrolled ? ' header-scrolled' : ''
        }`}
      >
        <div className="container-xl position-relative d-flex align-items-center">
          <Link
            href="/"
            className="logo landing-brand-logo d-flex align-items-center me-auto"
          >
            <img
              src="/legacy/logos/jmlogo.png"
              alt="JailMeet"
              className="landing-brand-wordmark"
            />
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="#hero" className="active">
                  Home
                </a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li className="dropdown">
                <button
                  className="border-0 bg-transparent"
                  type="button"
                  aria-expanded={isLoginDropdownOpen}
                  onClick={() => setIsLoginDropdownOpen((current) => !current)}
                >
                  <span>Login</span>{' '}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </button>
                <ul className={isLoginDropdownOpen ? 'dropdown-active' : ''}>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/register">Visitor Login/Register</Link>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <button
              aria-label="Toggle navigation"
              className="mobile-nav-toggle d-xl-none bi bi-list border-0 bg-transparent"
              type="button"
              onClick={() => setIsMobileNavOpen((current) => !current)}
            ></button>
          </nav>
        </div>
      </header>

      <main className="main">
        <section id="hero" className="hero section dark-background">
          <img src="/legacy/landing/prison1.jpg" alt="Prison corridor" />
          <div className="container d-flex flex-column align-items-center">
            <h2 data-aos="fade-up" data-aos-delay="100">
              Book , Arriver , Visit
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              Book appointments easily to visit and stay connected with your
              loved ones in prison.
            </p>
            <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
              <Link href="/register" className="btn-get-started">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="about section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <h3>Our Mission: Keeping Families Connected</h3>
                <img
                  src={`${landingAssets}/prisoner_img1.jpg`}
                  className="img-fluid rounded-4 mb-4"
                  alt="Prison visit support"
                />
                <p>
                  JailMeet is an innovative online platform designed to simplify
                  the process of visiting incarcerated loved ones and managing
                  parole requests. Our mission is to bridge the gap between
                  inmates and their families by providing a seamless, secure, and
                  user-friendly system for scheduling prison visits.
                </p>
                <p>
                  With just a few clicks, visitors can book appointments,
                  receive real-time updates, and access essential resources while
                  ensuring compliance with correctional facility regulations.
                </p>
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
                    At JailMeet, we believe that no barrier should keep you from
                    supporting your loved ones. Our platform is designed to make
                    every step simple and stress-free.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="stats section light-background">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-emoji-smile color-blue flex-shrink-0"></i>
                  <div>
                    <span>232</span>
                    <p>Happy Clients</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-journal-richtext color-orange flex-shrink-0"></i>
                  <div>
                    <span>521</span>
                    <p>Projects</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-headset color-green flex-shrink-0"></i>
                  <div>
                    <span>1463</span>
                    <p>Hours Of Support</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex align-items-center w-100 h-100">
                  <i className="bi bi-people color-pink flex-shrink-0"></i>
                  <div>
                    <span>15</span>
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
                      src={`${landingAssets}/prisoner2.jpeg`}
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
                      src={`${landingAssets}/prisoner3.jpeg`}
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
                      src={`${landingAssets}/prisoner.jpeg`}
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

        <section id="contact" className="contact section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Contact</h2>
            <p>JailMeet</p>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-6">
                <div className="row gy-4">
                  <div className="col-lg-12">
                    <div className="info-item d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-geo-alt"></i>
                      <h3>Location</h3>
                      <p>
                        ADX Florence - 5880 State Highway 67, Florence, CO
                        81226, United States.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-telephone"></i>
                      <h3>Call Us</h3>
                      <p>+1 8848 219595</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-envelope"></i>
                      <h3>Email Us</h3>
                      <p>jailmeet@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer dark-background">
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <Link href="/" className="logo d-flex align-items-center">
                <span className="sitename">JailMeet</span>
              </Link>
              <div className="footer-contact pt-3">
                <p>United States Penitentiary, Administrative Maximum Facility,</p>
                <p>USP Florence ADMAX-United States.</p>
                <p className="mt-3">
                  <strong>Phone:</strong> <span>+1 8848 219595</span>
                </p>
                <p>
                  <strong>Email:</strong> <span>jailmeet@gmail.com</span>
                </p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="https://x.com/" aria-label="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://www.facebook.com/" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://in.linkedin.com/" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bi bi-chevron-right"></i> <a href="#hero">Home</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#about">About us</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#services">Services</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>
            <span>Copyright</span>{' '}
            <strong className="px-1 sitename">JailMeet</strong>{' '}
            <span>All Rights Reserved</span>
          </p>
        </div>
      </footer>

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
