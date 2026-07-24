'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type OfficerSidebarProps = {
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
};

const bookingItems = [
  {
    href: '/officer/appointments',
    legacyHref: 'newappointment.php',
    label: 'New Appointment',
  },
  {
    href: '/officer/appointments',
    legacyHref: 'accepted.php',
    label: 'Accepted',
  },
  {
    href: '/officer/appointments',
    legacyHref: 'rejected.php',
    label: 'Rejected',
  },
  {
    href: '/officer/appointments',
    legacyHref: 'all.php',
    label: 'All',
  },
];

const paroleItems = [
  {
    href: '/officer/parole',
    legacyHref: 'requests.php',
    label: 'Parole Requests',
  },
  {
    href: '/officer/parole',
    legacyHref: 'pendingparole.php',
    label: 'Pending',
  },
  {
    href: '/officer/parole',
    legacyHref: 'acceptedparole.php',
    label: 'Accepted',
  },
  {
    href: '/officer/parole',
    legacyHref: 'rejectedparole.php',
    label: 'Rejected',
  },
];

export default function OfficerSidebar({
  sidebarOpen,
  onCloseSidebar,
}: OfficerSidebarProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(
    pathname.startsWith('/officer/appointments'),
  );
  const [paroleOpen, setParoleOpen] = useState(
    pathname.startsWith('/officer/parole'),
  );

  const isActive = (href: string) => pathname === href;
  const isSectionActive = (prefix: string) => pathname.startsWith(prefix);

  return (
    <>
      <div className={`right-sidebar${settingsOpen ? ' right-sidebar-visible' : ''}`}>
        <div className="sidebar-title">
          <h3 className="weight-600 font-16 text-blue">
            Layout Settings
            <span className="btn-block font-weight-400 font-12">
              User Interface Settings
            </span>
          </h3>
          <button
            className="close-sidebar border-0 bg-transparent"
            type="button"
            aria-label="Close layout settings"
            onClick={() => setSettingsOpen(false)}
          >
            <i className="icon-copy ion-close-round"></i>
          </button>
        </div>
        <div className="right-sidebar-body customscroll">
          <div className="right-sidebar-body-content">
            <h4 className="weight-600 font-18 pb-10">Header Background</h4>
            <div className="sidebar-btn-group pb-30 mb-10">
              <button className="btn btn-outline-primary header-white active" type="button">
                White
              </button>
              <button className="btn btn-outline-primary header-dark" type="button">
                Dark
              </button>
            </div>

            <h4 className="weight-600 font-18 pb-10">Sidebar Background</h4>
            <div className="sidebar-btn-group pb-30 mb-10">
              <button className="btn btn-outline-primary sidebar-light" type="button">
                White
              </button>
              <button className="btn btn-outline-primary sidebar-dark active" type="button">
                Dark
              </button>
            </div>

            <h4 className="weight-600 font-18 pb-10">Menu Dropdown Icon</h4>
            <div className="sidebar-radio-group pb-10 mb-10">
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  className="custom-control-input"
                  defaultChecked
                  id="sidebaricon-1"
                  name="menu-dropdown-icon"
                  type="radio"
                  value="icon-style-1"
                />
                <label className="custom-control-label" htmlFor="sidebaricon-1">
                  <i className="fa fa-angle-down"></i>
                </label>
              </div>
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  className="custom-control-input"
                  id="sidebaricon-2"
                  name="menu-dropdown-icon"
                  type="radio"
                  value="icon-style-2"
                />
                <label className="custom-control-label" htmlFor="sidebaricon-2">
                  <i className="ion-plus-round"></i>
                </label>
              </div>
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  className="custom-control-input"
                  id="sidebaricon-3"
                  name="menu-dropdown-icon"
                  type="radio"
                  value="icon-style-3"
                />
                <label className="custom-control-label" htmlFor="sidebaricon-3">
                  <i className="fa fa-angle-double-right"></i>
                </label>
              </div>
            </div>

            <h4 className="weight-600 font-18 pb-10">Menu List Icon</h4>
            <div className="sidebar-radio-group pb-30 mb-10">
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <div
                  className="custom-control custom-radio custom-control-inline"
                  key={number}
                >
                  <input
                    className="custom-control-input"
                    defaultChecked={number === 1 || number === 4}
                    id={`sidebariconlist-${number}`}
                    name="menu-list-icon"
                    type="radio"
                    value={`icon-list-style-${number}`}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`sidebariconlist-${number}`}
                  >
                    <i className={getMenuListIcon(number)}></i>
                  </label>
                </div>
              ))}
            </div>

            <div className="reset-options pt-30 text-center">
              <button className="btn btn-danger" id="reset-settings" type="button">
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`left-side-bar${sidebarOpen ? ' open' : ''}`}>
        <div className="brand-logo">
          <Link href="/officer/dashboard" data-legacy-href="index.php">
            <img
              src="/images/logos/jmlogo.png"
              alt="JailMeet logo"
              style={{ right: '100px' }}
            />
          </Link>
          <button
            className="close-sidebar border-0 bg-transparent"
            type="button"
            aria-label="Close sidebar"
            onClick={onCloseSidebar}
          >
            <i className="ion-close-round"></i>
          </button>
        </div>
        <div className="menu-block customscroll">
          <div className="sidebar-menu">
            <ul id="accordion-menu">
              <li className="dropdown">
                <Link
                  href="/officer/dashboard"
                  className={`dropdown-toggle no-arrow${
                    isActive('/officer/dashboard') ? ' active' : ''
                  }`}
                  data-legacy-href="index.php"
                >
                  <span className="micon dw dw-house-1"></span>
                  <span className="mtext">Home</span>
                </Link>
              </li>

              <li
                className={`dropdown${
                  bookingsOpen || isSectionActive('/officer/appointments')
                    ? ' show'
                    : ''
                }`}
              >
                <button
                  className="dropdown-toggle border-0 bg-transparent"
                  type="button"
                  aria-expanded={bookingsOpen}
                  onClick={() => setBookingsOpen((current) => !current)}
                >
                  <span className="micon dw dw-diagram"></span>
                  <span className="mtext"> Bookings </span>
                </button>
                <ul
                  className="submenu"
                  style={{
                    display:
                      bookingsOpen || isSectionActive('/officer/appointments')
                        ? 'block'
                        : undefined,
                  }}
                >
                  {bookingItems.map((item) => (
                    <li key={item.legacyHref}>
                      <Link
                        href={item.href}
                        data-legacy-href={item.legacyHref}
                        className={isActive(item.href) ? 'active' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <span
                  className="dropdown-toggle no-arrow"
                  data-legacy-href="prisoners.php"
                  aria-disabled="true"
                  title="Prisoner management is not implemented for officers yet"
                >
                  <span className="micon dw dw-diagram"></span>
                  <span className="mtext">Prisoners</span>
                </span>
              </li>

              <li>
                <span
                  className="dropdown-toggle no-arrow"
                  data-legacy-href="fir.php"
                  aria-disabled="true"
                  title="FIR management is not implemented yet"
                >
                  <span className="micon dw dw-diagram"></span>
                  <span className="mtext">FIR</span>
                </span>
              </li>

              <li
                className={`dropdown${
                  paroleOpen || isSectionActive('/officer/parole') ? ' show' : ''
                }`}
              >
                <button
                  className="dropdown-toggle border-0 bg-transparent"
                  type="button"
                  aria-expanded={paroleOpen}
                  onClick={() => setParoleOpen((current) => !current)}
                >
                  <span className="micon dw dw-diagram"></span>
                  <span className="mtext"> Parole </span>
                </button>
                <ul
                  className="submenu"
                  style={{
                    display:
                      paroleOpen || isSectionActive('/officer/parole')
                        ? 'block'
                        : undefined,
                  }}
                >
                  {paroleItems.map((item) => (
                    <li key={item.legacyHref}>
                      <Link
                        href={item.href}
                        data-legacy-href={item.legacyHref}
                        className={isActive(item.href) ? 'active' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <Link
                  href="/officer/change-password"
                  className={`dropdown-toggle no-arrow${
                    isActive('/officer/change-password') ? ' active' : ''
                  }`}
                  data-legacy-href="changepassword.php"
                >
                  <span className="micon dw dw-padlock1"></span>
                  <span className="mtext">Change Password</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button
        className={`mobile-menu-overlay border-0${
          sidebarOpen ? ' show' : ''
        }`}
        type="button"
        aria-label="Close officer menu overlay"
        onClick={onCloseSidebar}
      ></button>
      <button
        className="btn btn-primary d-none"
        type="button"
        onClick={() => setSettingsOpen(true)}
      >
        Layout Settings
      </button>
    </>
  );
}

function getMenuListIcon(number: number): string {
  switch (number) {
    case 1:
      return 'ion-minus-round';
    case 2:
      return 'fa fa-circle-o';
    case 3:
      return 'dw dw-check';
    case 4:
      return 'icon-copy dw dw-next-2';
    case 5:
      return 'dw dw-fast-forward-1';
    default:
      return 'dw dw-next';
  }
}
