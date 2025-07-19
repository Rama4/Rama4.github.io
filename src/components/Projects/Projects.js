import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import data from "../../Assets/data.json";

function Projects() {
  const renderProjects = () => {
  
    return (
      <>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
        {data?.projects?.map((p,i)=>{
          return (
            <Col md={4} className="project-card">
              <ProjectCard
                imgPath={p.imgPath}
                isBlog={false}
                title={p.name}
                description={p.description}
                stacks={p.stacks}
                ghLink={p.ghLink}
                demoLink={p.demoLink}
                />
            </Col>
          );
        })}
        </Row>
      </>
    );
  }

  return (
    <Container fluid className="project-section">
      {/* <div id="project" className="projects-sections"></div> */}
      <Particle />
      <Container>
        <h1 className="project-heading" >
          Projects
        </h1>
        {renderProjects()}
      </Container>
    </Container>
  );
}

export default Projects;
