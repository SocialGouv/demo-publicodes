import {
  HeaderNav,
  NavItem,
  NavSubItem,
  Header as HeaderDSFR,
  Logo,
  ToolItem,
  HeaderBody,
  Service,
  HeaderOperator,
  ToolItemGroup,
  Tool,
  MegaNavItem,
  MegaNavSubItem,
  // Link,
  SwitchTheme,
  SkiplinkItem,
  Skiplinks,
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

// export const SkipLinks = (props: SkipLinksProps): JSX.Element => {
//   return (
//     <Skiplinks>
//       {props.items.map((item, index) => (
//         <SkiplinkItem key={`${index}-${item.title}`} href={item.href}>
//           {item.title}
//         </SkiplinkItem>
//       ))}
//     </Skiplinks>
//   );
// };

// export const MegaNav = (props): JSX.Element => (
//   <MegaNavItem
//     title={props.title}
//     description={props.description}
//     closeButtonLabel={props.closeButtonLabel}
//     linkLabel={props.linkName}
//     link={props.linkHref}
//   >
//     {props.items.map((item, index) => (
//       <MegaNavSubItem
//         key={`${index}-${item.title}`}
//         title={item.title}
//         link={item.href}
//       >
//         {item.links.map((link, index) => (
//           <Link
//             key={`${index}-${link.title}`}
//             title={link.title}
//             href={link.href}
//           >
//             {link.name}
//           </Link>
//         ))}
//       </MegaNavSubItem>
//     ))}
//   </MegaNavItem>
// );

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
              href="/"
              className="fr-nav__link"
              legacyBehavior={false}
            ></Link>
          }
          href="/"
        >
          République Française
        </Logo>
        <Service
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
      </HeaderNav>
    </HeaderDSFR>
  );
};