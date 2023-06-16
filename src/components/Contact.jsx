import React from "react";
import { Container, Row } from "react-bootstrap";
import AboutCard from "./About/AboutCard";

const Contact = () => {
  return (
    <Container className="contact-section" id="contact">
      <Row style={{ justifyContent: "center" }}>
          <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
            Connect with Me
          </h1>
          <AboutCard />
      </Row>
    </Container>
  );
};

export default Contact;
