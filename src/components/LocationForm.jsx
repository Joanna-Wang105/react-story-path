import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocation, updateLocation, createLocation } from '../api/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * This page contains the form for user to fill when add/edit the location
 * @returns LocationForm component
 */
function LocationForm() {

    const [success, setSuccess] = useState(false)
    const [get_error, setError] = useState('')
    const [position_error, setPositionError] = useState(''); 
    const [no_content, setNoContent] = useState(false);

    const [location_name, setName] = useState('');
    const [location_trigger, setTrigger] = useState('Location Entry');
    const [location_position, setPosition] = useState('');
    const [score_points, setScorePoints] = useState(0);
    const [clue, setClue] = useState('');
    const [location_content, setLocationContent] = useState('');
    const {project_id, id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
    if (id) {
        const fetchLocation = async () => {
            let location = await getLocation(id);
            location = location[0];
            setName(location.location_name);
            setTrigger(location.location_trigger);
            setPosition(location.location_position);
            setScorePoints(location.score_points);
            setClue(location.clue);
            setLocationContent(location.location_content);
        };
        fetchLocation();
    }
    }, [id]);


    // Handle submission by either add a new location to the Location page or update existing location
    const handleSubmit = async (e) => {     
        e.preventDefault();

        // Check if the content is provided
        if (location_content.trim() === '' || !location_content) {
            setNoContent(true);
            return;
        } else {
            setNoContent(false);
        }

        const location = { project_id, location_name, location_trigger, location_position, score_points, clue, location_content };        
        try {
            if (id) {
                await updateLocation(id, location);
            } else {
                await createLocation(location);
            } 
            setSuccess(true);
        }
        catch (error) {
            setError("Failed to save project");
            console.error('Error saving project:', get_error);        
        }
    };

    // Navigate back to location page once changes are saved.
    useEffect(() => {
        if (success) {
            navigate(`/location/${project_id}`);
        }
    }, [success, navigate]);

   
    // Add options for the WYSIWYG editor 
    // https://quilljs.com/docs/modules/toolbar
    const toolbarOptions = [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }], 
        [{ 'script': 'sub'}, { 'script': 'super' }],  
        [{ 'align': [] }],   
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],  
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']                                         
      ];
    const module = {
        toolbar: toolbarOptions
    }

    // Handle position format, should only contains numbers 
    const validatePosition = (value) => {
        const regex = /^\(\d+\.\d+, \s*\d+\.\d+\)$/;
        return regex.test(value);
    };
    
    const handlePositionChange = (e) => {
        const value = e.target.value;
        setPosition(value);
        if (validatePosition(value)) {
            setPositionError(null);
        } else {
            setPositionError('Please enter the position in the format (lat, long), e.g., (27.4975, 153.013276)');
            console.error('Invalid position format:', value, position_error);
        }
    };

    return (
        <div>
            <h2 className="mb-4">{id ? 'Edit' : 'Add'} Location</h2>
            <h5 className="text-secondary">
                {id ? 'Edit' : 'Add'} your location here
            </h5>

            {/* The location form for user to fill */}
            <div className=" mt-3">
                <div className="row">
                    <div className="col">
                        <form onSubmit={handleSubmit}>

                            {/* Name */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Location Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={location_name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <div className="form-text">The name of this location.</div>
                            </div>

                            {/* Trigger */}
                            <div className="mb-3">
                                <label htmlFor="trigger" className="form-label">Location Trigger</label>
                                <select className="form-select" aria-label="Default select example" id="trigger"
                                    value={location_trigger}
                                    onChange={(e) => setTrigger(e.target.value)} required>
                                    <option value="Location Entry">Location Entry</option>
                                    <option value="QR Code Scans">QR Code Scans</option>
                                    <option value="Both Location Entry and QR Code Scan">Both Location Entry and QR Code Scan</option>
                                </select>
                                <div className="form-text">Select how this location will be triggered (by location, QR code, or both).</div>
                            </div>

                            {/* Position */}
                            <div className="mb-3">
                                <label htmlFor="position" className="form-label">Location Position (lat, long)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="position"
                                    value={location_position}
                                    // onChange={(e) => setPosition(e.target.value)}
                                    onChange={handlePositionChange}
                                    required
                                />
                                <div className="form-text">Enter the latitude and longitude for this location.</div>
                            </div>

                            {/* Points */}
                            <div className="mb-3">
                                <label htmlFor="score-clue" className="form-label">Points for Reaching Location</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="points"
                                    value={score_points}
                                    onChange={(e) => setScorePoints(Number(e.target.value))}
                                    required
                                />
                                <div className="form-text">Specify the nummber of points participants earn by reaching this location.</div>
                            </div>

                            {/* Clue */}
                            <div className="mb-3">
                                <label htmlFor="clue" className="form-label">Clue</label>
                                <textarea
                                    className="form-control"
                                    id="clue"
                                    value={clue}
                                    onChange={(e) => setClue(e.target.value)}
                                />
                                <div className="form-text">Enter the clue that leads to the next location.</div>
                            </div>

                            {/* Content */}
                            <div className="mb-3">
                                <label htmlFor="location-content" className="form-label">Location Content</label>
                                <ReactQuill modules={module} theme="snow" value={location_content} onChange={setLocationContent} />                                
                                <div className="form-text">Provide additional content that will be displayed when participants reach this location.</div>
                                {no_content && <div className="text-danger mt-3 bi bi-exclamation-circle "> Content is required</div>}
                            </div>
                            
                            {/* Button for submission */}
                            <button type="submit" className="btn btn-outline-primary">Save Location</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
  }

export default LocationForm;