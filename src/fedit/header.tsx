import React, { FC, ReactNode } from 'react';
import { MouseEventHandler } from 'react';

import { useState, useRef } from 'react';

export const HamburgerMenuPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar bgColor="bg-green-700" textColor="text-white">
      <NavbarBrand href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fillRule="evenodd"
        >
          <path
            d="M0 12.5V25h25V0H0v12.5M24.5.523l.102.102v23.773l-.203.203H.617l-.094-.098-.098-.098V.617L.523.523.617.426h23.781l.102.098M5.977 5.887c-.133.074-.125-.34-.125 6.617l.129 6.637c.094.047 12.953.055 13.059.004.145-.066.137.402.137-6.633s.008-6.566-.137-6.633c-.102-.047-12.977-.039-13.062.008"
            fill="rgb(98.823529%,98.823529%,98.823529%)"
          />
          <path
            d="M.523.523L.426.617v23.789l.098.098.094.098h23.781l.203-.203V.625L24.5.523l-.102-.098H.617L.523.523M12 1.348l.074.074v3.434l-.074.07-.07.074h-6.73l-.098.102L5 5.199v6.73l-.074.07-.07.074H1.422L1.348 12l-.074-.07V1.422l.148-.148H11.93l.07.074m11.676 0l.074.074V11.93l-.074.07-.07.074h-3.434L20.098 12l-.074-.07v-6.73L19.824 5h-6.727l-.074-.074-.074-.07V1.422l.148-.148h10.508l.07.074m-4.637 4.531c.145.066.137-.402.137 6.633l-.137 6.633c-.105.051-12.965.043-13.059-.004-.137-.07-.129.301-.129-6.637 0-6.957-.008-6.543.125-6.617.086-.047 12.961-.055 13.063-.008M4.926 13.023l.074.074v6.727l.199.199h6.73l.07.074.074.074v3.434l-.074.07-.07.074H1.422l-.074-.074-.074-.07V13.098l.148-.148h3.434l.07.074"
            fill="rgb(1.568627%,1.568627%,1.568627%)"
          />
          <path
            d="M1.348 1.348l-.074.074V11.93l.074.07.074.074h3.434l.07-.074.074-.07v-6.73l.102-.098L5.199 5h6.73l.07-.074.074-.07V1.422L12 1.348l-.07-.074H1.422l-.074.074"
            fill="rgb(98.823529%,1.568627%,98.823529%)"
          />
          <path
            d="M13.023 1.348l-.074.074v3.434l.074.07.074.074h6.727l.199.199v6.73l.074.07.074.074h3.434l.07-.074.074-.07V1.422l-.074-.074-.07-.074H13.098l-.074.074"
            fill="rgb(1.568627%,98.823529%,98.823529%)"
          />
          <path
            d="M1.348 13.023l-.074.074v10.508l.074.07.074.074H11.93l.07-.074.074-.07v-3.434L12 20.098l-.07-.074h-6.73L5 19.824v-6.727l-.074-.074-.07-.074H1.422l-.074.074"
            fill="rgb(98.823529%,98.823529%,1.568627%)"
          />
        </svg>{' '}
      </NavbarBrand>
      <NavbarToggler toggle={toggle} />
      <NavbarCollapse isOpen={isOpen}>
        <NavbarNav>
          <NavbarItem>
            <NavbarLink href="#">Home</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="#">Documents</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="#">React</NavbarLink>
          </NavbarItem>
        </NavbarNav>
      </NavbarCollapse>
    </Navbar>
  );
};

const style = {
  navbar: `font-light shadow py-2 px-4`,
  brand: `inline-block pt-1.5 pb-1.5 mr-4 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400`,
  toggler: `float-right pt-2 text-3xl focus:outline-none focus:shadow`,
  collapse: `transition-height ease duration-300`,
  nav: `block pl-0 mb-0`,
  link: `block cursor-pointer py-1.5 px-4  hover:text-gray-400 font-medium`,
};

interface NavbarProps {
  children: ReactNode;
  bgColor: string;
  textColor: string;
}

const Navbar = ({ children, bgColor, textColor }: NavbarProps) => (
  <nav className={`${bgColor} ${textColor} ${style.navbar}`}>{children}</nav>
);

interface NavbarBrandProps {
  children: ReactNode;
  href: string;
}

const NavbarBrand = ({ children, href }: NavbarBrandProps) => (
  <a href={href} className={style.brand}>
    <strong>{children}</strong>
  </a>
);

interface NavbarTogglerProps {
  toggle: MouseEventHandler<HTMLButtonElement>;
}

const NavbarToggler = ({ toggle }: NavbarTogglerProps) => (
  <button
    type="button"
    aria-expanded="false"
    aria-label="Toggle navigation"
    className={style.toggler}
    onClick={toggle}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="1.25" d="M4 18h16M4 12h16M4 6h16"></path>
    </svg>
  </button>
);

interface NavbarCollapseProps {
  children: ReactNode;
  isOpen: boolean;
}

interface InlineStyle {
  height: number;
  visibility?: 'hidden' | 'visible';
  opacity?: number;
}

const NavbarCollapse = ({ children, isOpen }: NavbarCollapseProps) => {
  const ref = useRef(null);
  const inlineStyle: InlineStyle = isOpen
    ? { height: ref.current?.scrollHeight || 0 }
    : { height: 0, visibility: 'hidden', opacity: 0 };

  return (
    <div className={style.collapse} style={inlineStyle} ref={ref}>
      {children}
    </div>
  );
};

interface Children {
  children: ReactNode;
}

const NavbarNav = ({ children }: Children) => (
  <ul className={style.nav}>{children}</ul>
);

const NavbarItem = ({ children }: Children) => <li>{children}</li>;

interface NavbarLinkProps {
  children: ReactNode;
  href: string;
}

const NavbarLink = ({ children, href }: NavbarLinkProps) => (
  <a href={href} className={style.link}>
    {children}
  </a>
);

interface HeaderProps {}

export const Header: FC<HeaderProps> = ({}: HeaderProps) => {
  return <HamburgerMenuPage />;
};
