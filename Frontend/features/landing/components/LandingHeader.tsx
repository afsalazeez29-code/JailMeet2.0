import Link from 'next/link';

type LandingHeaderProps = {
  isLoginDropdownOpen: boolean;
  isScrolled: boolean;
  onLoginDropdownToggle: () => void;
  onMobileNavToggle: () => void;
  onVisitorEntry: () => void;
};

export default function LandingHeader({
  isLoginDropdownOpen,
  isScrolled,
  onLoginDropdownToggle,
  onMobileNavToggle,
  onVisitorEntry,
}: LandingHeaderProps) {
  return (
    <header
      id="header"
      className={`header d-flex align-items-center fixed-top${
        isScrolled ? ' header-scrolled' : ''
      }`}
    >
      <div className="container-xl position-relative d-flex align-items-center">
        <Link href="/" className="logo landing-brand-logo d-flex align-items-center me-auto">
          <img
            src="/images/logos/jmlogo.png"
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
                className="login-nav-button border-0"
                type="button"
                aria-expanded={isLoginDropdownOpen}
                onClick={onLoginDropdownToggle}
              >
                <span className="btn-hover-text">
                  <span className="btn-hover-text-original">LOGIN</span>
                  <span className="btn-hover-text-copy" aria-hidden="true">
                    LOGIN
                  </span>
                </span>{' '}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </button>
              <ul className={isLoginDropdownOpen ? 'dropdown-active' : ''}>
                <li>
                  <Link
                    href="/register?role=visitor"
                    onClick={(event) => {
                      event.preventDefault();
                      onVisitorEntry();
                    }}
                  >
                    Visitor Login/Register
                  </Link>
                </li>
                <li>
                  <Link href="/login?role=officer">Officers</Link>
                </li>
                <li>
                  <Link href="/login?role=prisoner">Prisoners</Link>
                </li>
                <li>
                  <Link href="/login?role=admin">Admin</Link>
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
            onClick={onMobileNavToggle}
          ></button>
        </nav>
      </div>
    </header>
  );
}
