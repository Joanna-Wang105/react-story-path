import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLocations, getProject } from '../api/api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';


/**
 * This page contains all the information to allow user to test their location-based project
 * @returns Preview component
 */
function Preview() {
    const { project_id } = useParams();
    const [project, setProject] = useState(null);
    const [location, setLocation] = useState([]);
    const [points, setTotalPoints] = useState(0);
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [currentPoint, setCurrentPoint] = useState(0)
    const [visitedLoc, setVisitedLoc] = useState([])
    const [numVisited, setNumVisited] = useState(0)
    const [marker, setMarker] = useState([])

    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProject(project_id);
            setProject(fetchedProjects[0]);
        }
        const fetchedLocations = async () => {
            let fetchedLocations = await getLocations();
            fetchedLocations = fetchedLocations.filter((location) => location.project_id == project_id);
            setLocation(fetchedLocations);
        }
        fetchProjects();
        fetchedLocations();
    }, []);

    // Sum all the points to display total points
    useEffect(() => {
        if (location.length > 0 && project.participant_scoring !== 'Not Scored') {
            const sum = location.reduce((acc, loc) => acc + (loc.score_points), 0);
            setTotalPoints(sum);
        }
    }, [location]);

    // Track whether the place has been visited and add associated points and increment number of location visited if
    // that location has not been visited yet
    useEffect(() => {
        if (selectedLoc && !visitedLoc.includes(selectedLoc.id) ) {
            if (project.participant_scoring !== 'Not Scored') {
                setCurrentPoint(currentPoint + selectedLoc.score_points)
            }
            setNumVisited(numVisited + 1)
            setVisitedLoc([...visitedLoc, selectedLoc.id])
        }
    }, [selectedLoc])

    // Display the map if 'Display Map' is selected in homescreen_display
    /* For knowing how to remove '()' https://stackoverflow.com/questions/10844194/remove-parenthesis-from-string-in-javascript */
    useEffect(() => {
        if (location.length > 0 && project.homescreen_display === 'Display map') {
            const marker = location.map(loc => {
                let pos = loc.location_position
                let allPos = pos.replace(/[()]/g, '').split(',');
                return allPos.map(Number)
            })
            setMarker(marker)
        }
    }, [location]);

    // Change the content when drop down menu is clicked
    /* I used ChatGPT to figure out how to track the drop down menu so I can change the content when it's not in the homescreen */
    const handleDropdownChange = (e) => {
        const index = e.target.value - 1;
        setSelectedLoc(location[index] || null);
    }

    // The content of the card depending on whether it is in homescreen or in other locations 
    const renderContext = () => {
        if (selectedLoc ) {
            return (
                <div>
                    <h3 className="card-title title-color text-center">
                        <strong>{selectedLoc.location_name}</strong>
                    </h3>

                    {/* I learned how to remove html tag from here: https://forums.meteor.com/t/how-do-i-display-the-content-of-quill-without-the-html-markup/31936 */}
                    <div className="card-text lh-2" dangerouslySetInnerHTML={{ __html: selectedLoc.location_content }} />
                    {selectedLoc.clue && (
                        <div>
                            <h5 className="card-title" style={{color: "var(--bs-primary-text-emphasis)"}}>Clue for next location</h5>
                            <p className="card-text lh-2">
                                {selectedLoc.clue}
                            </p>
                        </div>
                    )}
                </div>
            )
        }
                            
        {/* Display the content of the homescreen based on the option selected in homescreen display
            I learned how to do if statements in the shorthand way in here https://stackoverflow.com/questions/37312122/how-to-do-a-nested-if-else-statement-in-reactjs-jsx */}
        return project?.homescreen_display === 'Display initial clue' && project?.initial_clue !== '' ? (
            <div>
                <h5 className="card-title">Instructions</h5>
                <p className="card-text lh-2">
                    {project?.instructions}
                </p>
                <h5 className="card-title">Initial Clue</h5>
                <p className="card-text lh-2">
                    {project.initial_clue}
                </p>
            </div>
        ) : project?.homescreen_display === 'Display all locations' ? (
            <div>
                <h5 className="card-title">Instructions</h5>
                <p className="card-text lh-2">
                    {project?.instructions}
                </p>
                <h5 className="card-title">All Locations</h5>
                <p className="card-text lh-2">
                    {location.map(place => (
                        <ul key={place.id} className='lh-1'>{place.location_name}</ul>
                    ))}
                </p>
            </div>
        ) : project?.homescreen_display === 'Display map' ? ( 
            <div className='mt-1'>
                <MapContainer center={[-27.4977, 153.0129]} zoom={13}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {marker.map(pos => (
                        <Marker position={pos}>
                        </Marker>
                    ))}
                </MapContainer>
            </div> 
        ) : <div>
                <h5 className="card-title">Instructions</h5>
                <p className="card-text lh-2">
                    {project?.instructions}
                </p>
            </div>;
    }

    return (
        <div>
            <h2>{project?.title} - Preview</h2>
            <h5 className="text-secondary">
            This page allows you to test and simulate the experience of going to locations or scanning QR codes within the app based on the locations you added in this project.
            </h5>

            {/* Drop down menu */}
            <div className='pt-3'>
                <label className="form-label">Change Locations to Test Scoring</label>
                <select className="form-select" aria-label="Default select example" onChange={handleDropdownChange}>
                    <option selected>Homescreen</option>
                    {location.map((place, index) => (<option key={place.id} value={index + 1}>{place.location_name}</option>))}
                </select>
            </div>

            {/* Content display when option in the drop down menu is selected */}
            <div className='container pt-4'>
                <div className='d-flex justify-content-center'>
                    <div className='pb-4 card w-50' style={{borderBottom: "4px outset var(--bs-primary-border-subtle)"}}>
                        <h4 className="card-header text-center" style={{backgroundColor: "var(--bs-primary-bg-subtle)"}}>
                            {project?.title}
                        </h4>
                        <div className='card-body'>
                            {renderContext()}
                        </div>

                        <div className="d-flex justify-content-around">
                            {/* Display and track points */}
                            <div className="card text-bg-preview" style={{width: "40%"}}>
                                <div className="card-body">
                                    <h5 className="card-title text-center">Points</h5>
                                    <p className="card-text text-center">{currentPoint}/{points}</p>
                                </div>
                            </div>

                            {/* Display and track locations */}
                            <div className="card text-bg-preview" style={{width: "45%"}}>
                                <div className="card-body">
                                <h5 className="card-title text-center">Locations Visited</h5>
                                <p className="card-text text-center">{numVisited}/{location.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
  

export default Preview;