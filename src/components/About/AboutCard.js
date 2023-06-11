import React from "react";
import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { BsLinkedin } from "react-icons/bs";
import { GrMail } from "react-icons/gr";
import { FaGithubSquare } from "react-icons/fa";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <Row className="contact_icons" style={{ justifyContent: "center" }} xs={1} md={2}>
          <Col>
            <BsLinkedin />
            <br />
            <a
              href="https://www.linkedin.com/in/rama-narasimhan/"
              target="_blank"
              rel="noreferrer"
              className="contact_info"
            >
              rama-narasimhan
            </a>
          </Col>
          <Col>
            <FaGithubSquare />
            <br />
            <a
              href="https://github.com/Rama4"
              target="_blank"
              rel="noreferrer"
              className="contact_info"
            >
              Rama4
            </a>
          </Col>
        </Row>
        <Row className="contact_icons" style={{ justifyContent: "center", padding : "50px"}} xs={1} md={2}>
          <Col>
            <GrMail />
            <br />
            <a
              href="mailto:m.rama.narasimhan@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="contact_info"
            >
              m.rama.narasimhan@gmail.com
            </a>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
