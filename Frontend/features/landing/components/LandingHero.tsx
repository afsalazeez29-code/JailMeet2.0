import Link from 'next/link';

export default function LandingHero() {
  return (
    <section id="hero" className="hero section dark-background">
      <img src="/images/landing/prison1.jpg" alt="Prison corridor" />
      <div
        className="container d-flex flex-column align-items-center"
        style={{ transform: 'translateY(55px)', gap: '15px' }}
      >
        <h2 data-aos="fade-up" data-aos-delay="100">
          BOOK , ARRIVER , VISIT,
        </h2>
        <p data-aos="fade-up" data-aos-delay="200">
          "Book appointments easily to visit and stay connected with your loved
          ones in prison"
        </p>
        <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
          <Link href="/register" className="btn-get-started">
            <span className="btn-hover-text">
              <span className="btn-hover-text-original">Get Started</span>
              <span className="btn-hover-text-copy" aria-hidden="true">
                Get Started
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}