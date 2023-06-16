import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

function ProjectCards(props) {

  const renderDemoLink = () => {
    if(!props.demoLink)
      return null;
    if(props.isStatic) {
      return (
        <>
          <a
          href={props.demoLink}
          style={{ marginLeft: "10px" }}
          >
            <CgWebsite /> &nbsp;
            {"Demo"}
          </a>
        </>
      );
    }
    else {
      return (
        <>
          <Button
          variant="primary"
          href={props.demoLink}
          target="_blank"
          style={{ marginLeft: "10px" }}
          >
            <CgWebsite /> &nbsp;
            {"Demo"}
          </Button>
        </>
      );
    }
    
  }
  
  return (
    <Card className="project-card-view">
      {props.imgPath?.length > 0 && <Card.Img variant="top" src={props.imgPath} alt="image" /> }
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        {props.imgPath?.length > 0 && <Card.Text style={{ textAlign: "justify" }}>{props.description}</Card.Text>}
        {props.stacks?.length > 0 && <Card.Text style={{ textAlign: "center" }}>{props.stacks}</Card.Text>}
        {props.ghLink?.length > 0 && 
          <Button variant="primary" href={props.ghLink} target="_blank">
            <BsGithub /> &nbsp;
            {props.isBlog ? "Blog" : "GitHub"}
          </Button>
        }
        {/* If the component contains Demo link and if it's not a Blog then, it will render the below component  */}

        {renderDemoLink()}
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
