//import { Footer, Header } from "@components";

import { Container } from "@dataesr/react-dsfr";
//import { FooterProps } from "../footer/type";
//import { HeaderProps } from "../header/type";

import { Header } from "./Header";

import { Footer } from "./Footer";
// import { Body } from "./body";
// import { Bottom } from "./bottom";
// import { Partners } from "./partner";
// import { Top } from "./top";
//import { FooterProps } from "./type";

import {
  FooterBody,
  Logo,
  FooterBodyItem,
  Link,
  FooterOperator,
} from "@dataesr/react-dsfr";
import { NextPage } from "next";
//import { FooterBodySectionProps } from "./type";

// type Props = {
//   children: React.ReactNode;
//   headerProps: HeaderProps;
//   footerProps: FooterProps;
// };

const Index = (props: any): JSX.Element => {
  return (
    <>
      <Header />
      <Container>{props.children}</Container>
      <Footer />
    </>
  );
};

export default Index;
