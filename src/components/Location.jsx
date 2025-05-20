import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { deleteLocation, getLocations, getProject } from '../api/api';
import QRCode from "react-qr-code";

/**
 * This page contains all the location list that was added to the assocaited project
 * @returns Location component
 */
function Location() {
    const { project_id } = useParams();
    const [locations, setLocations] = useState([]);
    const [project, setProject] = useState(null);
    const [showQR, setShowQR] = useState(null);
    const [showAllQR, setShowAllQR] = useState(false);


    // Get all locations and associated project for that location 
    useEffect(() => {
        const fetchedLocations = async () => {
            let fetchedLocations = await getLocations();
            fetchedLocations = fetchedLocations.filter((location) => location.project_id == project_id);
            setLocations(fetchedLocations);
        }
        const fetchProjects = async () => {
            const fetchedProjects = await getProject(project_id);
            setProject(fetchedProjects[0]);
        }
        fetchedLocations();
        fetchProjects();
    }, []);

    // Remove the delete location by setting locations to those that don't have assocaited delete project id
    async function handleDelete(id) {
        if (id) {
            await deleteLocation(id);
            setLocations(deletedLocation => deletedLocation.filter(p => p.id !== id));
        }
    }

    // Handle each QR code
    const handlePrintQR = (id) => {
        setShowQR(showQR === id ? null : id); 
    };

    // Handle the case for "Print QR Code for All"
    const handlePrintAllQR = () => {
        setShowAllQR(!showAllQR); 
    };

    return (
        <div>
            <div className='row'>
                <div className='col-lg-9'>
                    <h2> {project?.title} - Locations</h2>
                </div>
                <div className='col-lg-3'>
                <button onClick={handlePrintAllQR} className='pe-2 btn btn-warning bi bi-printer-fill'> Print QR Codes for All</button>
                <Link to={`/preview/${project_id}`} className="ms-2 btn btn-success">Preview</Link>
                </div>
            </div>
            
            <h5 className="text-secondary">
                All your added locations are shown on this page. You can edit or delete
                existing projects and print the QR code. <br />
                Click the 'Add Location' button to create a new project.
            </h5>

            <div className='row'>
                <div className='col'>
                <Link to={`/newLocation/${project_id}`} className="btn btn-primary mt-3 pt-2">Add Location</Link>

                <div className='container pt-4'>
                {/* Display all the added locations */}
                {locations.map(location => (
                    <div className="card mb-3" key={location.id}>
                        <div className='d-flex justify-content-between align-items-start'> 
                            <div className="card-body">
                            
                                <div className='ms-2 me-auto pb-3'>
                                    <h5 className="card-title pt-2">{location.location_name}</h5>
                                    <p className="card-text word-height">Trigger: {location.location_trigger}</p>
                                    <p className="card-text word-height">Position: {location.location_position}</p>
                                    <p className="card-text word-height">Points: {location.score_points}</p>
                                </div>
                            </div>
                    
                            {/* Handle buttons */}
                            <div className='mt-5 pe-2'>
                                <Link to={`/editLocation/${project_id}/${location.id}`} className="btn btn-outline-secondary bi bi-pencil-fill"> Edit</Link>
                            </div>
                            <div className='mt-5 pe-2'>
                                <button onClick={() => handleDelete(location.id)} className='btn btn-outline-danger bi bi-trash'> Delete</button>
                            </div>
                            <div className='mt-5 pe-3'>
                                <button onClick={() => handlePrintQR(location.id)} className='btn btn-outline-warning bi bi-printer'> Print QR Code</button>
                            </div>
                            
                        </div>
                        <div className='d-flex justify-content-center' >

                        {/* Show the QR code - handle both print specific location QR code and print all locations QR code
                            https://www.dhiwise.com/post/how-to-generate-and-display-qr-codes-in-your-react-app */}
                        {showQR === location.id && !showAllQR && (
                                    <div className="pt-3 pb-3">
                                        <QRCode value={`Location ID: ${location.id}`} size={200}/>
                                    </div>
                        )}
                         {showAllQR && (
                                    <div className="pt-3 pb-3">
                                        <QRCode value={`Location ID: ${location.id}`} size={200} />
                                    </div>
                                )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
  }

export default Location;