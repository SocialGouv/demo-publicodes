import {
  Footer as FooterDSFR,
  FooterBottom,
  FooterCopy,
  FooterLink,
  SwitchTheme,
} from "@dataesr/react-dsfr";
import { useState } from "react";

export const Bottom = (props: any): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FooterBottom>
      <FooterLink href="https://fabrique.social.gouv.fr">
        Fabrique numériques des ministères sociaux
      </FooterLink>
      <FooterLink onClick={() => setIsOpen(true)} href="/">
        <span aria-controls="fr-theme-modal" data-fr-opened={isOpen}>
          Paramètres d’affichage
        </span>
      </FooterLink>
      <FooterCopy>
        <p>
          Sauf mention contraire, tous les contenus de ce site sont sous{" "}
          <a
            href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
            rel="noreferrer"
            target="_blank"
          >
            licence etalab-2.0
          </a>
        </p>
      </FooterCopy>
      <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
    </FooterBottom>
  );
};

export const Footer = (): JSX.Element => (
  <FooterDSFR>
    <Bottom />
  </FooterDSFR>
);
