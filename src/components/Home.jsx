import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

/**
 * The home component is the homepage, the page where the player first entering my app 
 * Contains link to the project page and some images 
 * @returns Home component
 */
function Home() {
  return (
    <>
    <div className='row pt-5 align-items-start'>
        <div className='col-md-5 pt-5'>
            <h1 className="text-start mt-md-5">Welcome to StoryPath</h1>
            <h3 className="text-start pt-3">
                A location experience platform for you to create and explore tours,
                hunts and adventures.
            </h3>
        
            <div className="text-start">
                <Link to="/project" className="btn btn-primary btn-lg mt-5">Get Started</Link>
            </div>
        </div>
    

        {/* The slider at the right hand side */}
        <div className="col-md-7 pt-5">
            <Carousel id='carouselExampleAutoplaying'>
                <Carousel.Item interval={1500}> 
                    <div className="carousel-item carousel-image bg-img-1 active"></div>
                </Carousel.Item>
                <Carousel.Item interval={1500}> 
                    <div className="carousel-item carousel-image bg-img-2 active"></div>
                </Carousel.Item>
                <Carousel.Item interval={1500}> 
                    <div className="carousel-item carousel-image bg-img-3 active"></div>
                </Carousel.Item>                        
            </Carousel>
        </div>
    </div>
    </>
  );
}

export default Home;