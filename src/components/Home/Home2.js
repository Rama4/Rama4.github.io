import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import data from "../../Assets/data.json";

const Home2 = () =>{

  const renderAvatar = () => {
    return (
      <Col md={4} className="myAvtar">
        <Tilt>
          <img src="https://avatars.githubusercontent.com/u/19623200?s=400&u=5a2da11969fbc07f927096515727862504868627&v=4" className="img-fluid myphoto" alt="avatar" />
        </Tilt>
      </Col>
    );
  }

  const renderBio = () => {
    return (
        <Col md={8} className="home-about-description">
          <h1 style={{ fontSize: "2.6em" }}>
            <span className="purple"> ABOUT </span> ME
          </h1>

          {data.profile?.bio?.map(b =>
            <p className="home-about-body">{b}</p>
          )}
        </Col>
      
    );
  }


  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          {renderAvatar()}
          {renderBio()}
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href={data.profile?.social?.github}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href={data.profile?.social?.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href={data.profile?.social?.email}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <SiGmail />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
