import {
  HeaderNav,
  NavItem,
  NavSubItem,
  Header as HeaderDSFR,
  Logo,
  ToolItem,
  HeaderBody,
  Service,
  ToolItemGroup,
  Tool,
  SwitchTheme,
} from "@dataesr/react-dsfr";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import modeles from "@socialgouv/publicodes-demo-modeles";

export const SwitchThemeMode = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ToolItem onClick={() => setIsOpen(!isOpen)}>
        <span
          className="fr-fi-theme-fill fr-link--icon-left"
          aria-controls="fr-theme-modal"
          data-fr-opened={isOpen}
        >
          Paramètres d’affichage
        </span>
      </ToolItem>
      <SwitchTheme isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} />
    </>
  );
};

export const Header = (): JSX.Element => {
  const router = useRouter();
  return (
    <HeaderDSFR>
      {/*props.skipLinksProps && <SkipLinks {...props.skipLinksProps} />*/}
      <HeaderBody>
        <Logo
          splitCharacter={10}
          asLink={
            <Link
              href="/demo-publicodes"
              className="fr-nav__link"
              legacyBehavior={false}
            ></Link>
          }
          href="/demo-publicodes"
        >
          République Française
        </Logo>
        <Service
          link="/demo-publicodes"
          title="Fabrique numérique des ministères sociaux"
          description="démo d'algorithmes publi.codes"
        />
        <Tool>
          <ToolItemGroup>
            <ToolItem
              link="https://github.com/socialgouv"
              asLink={
                <Link
                  href="https://github.com/socialgouv/demo-publicodes"
                  className="fr-nav__link fr-link"
                >
                  GitHub
                </Link>
              }
            >
              GitHub
            </ToolItem>
            <SwitchThemeMode />
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      <HeaderNav>
        <NavItem
          current={router.asPath === "/"}
          asLink={
            <div className="fr-nav__link fr-link">
              <Link href="/">Introduction</Link>
            </div>
          }
          title="Introduction"
          link="/"
        />
        <NavItem title="Algorithmes">
          {Object.keys(modeles).map((key) => (
            <NavSubItem
              key={key}
              title={`${key}`}
              link={`/algorithmes/${key}`}
              current={router.asPath === `/algorithmes/${key}`}
              asLink={
                <Link href={`/algorithmes/${key}`} className="fr-nav__link">
                  {key}
                </Link>
              }
            />
          ))}
        </NavItem>
        <NavItem
          current={router.asPath === "/usage"}
          asLink={
            <div className="fr-nav__link fr-link">
              <Link href="/usage">Usage</Link>
            </div>
          }
          title="Usage"
          link="/usage"
        />
      </HeaderNav>
    </HeaderDSFR>
  );
};
