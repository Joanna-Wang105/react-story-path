import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject, createProject } from '../api/api';

/**
 * This page contains the form for user to fill when add/edit the project form
 * @returns ProjectFrom component
 */
function ProjectForm() {

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const [title, setTitle] = useState('');
    const [description, setDesciprtion] = useState('');
    const [instructions, setInstruction] = useState('');
    const [initial_clue, setInitialClue] = useState('');
    const [homescreen_display, setHomescreenDisplay] = useState('Display initial clue');
    const [participant_scoring, setParticipantScoring] = useState('Not Scored');
    const [is_published, setPublish] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
    if (id) {
        const fetchProject = async () => {
            let project = await getProject(id);
            project = project[0];
            setTitle(project.title);
            setDesciprtion(project.description);
            setInstruction(project.instructions);
            setInitialClue(project.initial_clue);
            setHomescreenDisplay(project.homescreen_display);
            setParticipantScoring(project.participant_scoring);
            setPublish(project.is_published);
        };
        fetchProject();
    }
    }, [id]);

    // Handle submission by either add a new project to the Project page or update existing project
    const handleSubmit = async (e) => {     
        e.preventDefault();
        const project = { title, description, instructions, initial_clue, homescreen_display, participant_scoring, is_published };

        try {
            if (id) {
                await updateProject(id, project);
            } else {
                await createProject(project);
            } 
            setSuccess(true);
        }
        catch (error) {
            setError("Failed to save project");
        }
        };

    // Navigate back to project page once changes are saved.
    useEffect(() => {
        if (success) {
            navigate('/project');
        }
    }, [success, navigate]);

    return (
        <div>
            <h2 className="mb-4">{id ? 'Edit' : 'Add'} Project Form </h2>
            <h5 className="text-secondary">
                {id ? 'Edit' : 'Add'} your project here
            </h5>

            {/* The project form for user to fill */}
            <div className=" mt-3">
                <div className="row">
                    <div className="col-md-10">
                        <form onSubmit={handleSubmit}>

                            {/* Title */}
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <div className="form-text">The name of your project.</div>
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Descirption</label>
                                <textarea
                                    className="form-control"
                                    id="name"
                                    value={description}
                                    onChange={(e) => setDesciprtion(e.target.value)}
                                    required
                                />
                                <div className="form-text">Provide a brief description of your project. This is not displayed to
                                participants.</div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-3">
                                <label htmlFor="instructions" className="form-label">Instructions</label>
                                <textarea
                                    className="form-control"
                                    id="instruction"
                                    value={instructions}
                                    onChange={(e) => setInstruction(e.target.value)}
                                    required
                                />
                                <div className="form-text">Instructions for participants, explaining how to engage with the
                                project.</div>
                            </div>

                            {/* Clue */}
                            <div className="mb-3">
                                <label htmlFor="initial-clue" className="form-label">Initial Clue</label>
                                <textarea
                                    className="form-control"
                                    id="clue"
                                    value={initial_clue}
                                    onChange={(e) => setInitialClue(e.target.value)}
                                />
                                <div className="form-text">The first clue to start the project. This is optional.</div>
                            </div>

                            {/* Homescreen */}
                            <div className="mb-3">
                                <label htmlFor="homescreen" className="form-label">Homescreen Display</label>
                                <select className="form-select" aria-label="Default select example" id="homescreen"
                                    value={homescreen_display}
                                    onChange={(e) => setHomescreenDisplay(e.target.value)}>
                                    <option value="Display initial clue">Display initial clue</option>
                                    <option value="Display all locations">Display all locations</option>
                                    <option value="Display map">Display map</option>
                                </select>
                                <div className="form-text">Choose what to display on the homescreen of the project.</div>
                            </div>

                            {/* Scoring */}
                            <div className="mb-3">
                                <label htmlFor="scoring" className="form-label">Participant Scoring</label>
                                <select className="form-select" aria-label="Default select example" id="score"
                                    value={participant_scoring}
                                    onChange={(e) => setParticipantScoring(e.target.value)}>
                                    <option value="Not Scored">Not Scored</option>
                                    <option value="Number of Scanned QR Codes">Number of Scanned QR Codes</option>
                                    <option value="Number of Locations Entered">Number of Locations Entered</option>
                                </select>
                                <div className="form-text">Select how participants will be scored in this project.</div>
                            </div>
        
                            {/* Published */}
                            <div className="mb-3">
                                <div htmlFor="publish" className="form-check">
                                    <input className="form-check-input" type="checkbox" id="gridCheck1"
                                    checked={is_published}
                                    onChange={(e) => setPublish(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Published
                                    </label>
                                </div>
                            </div>
                            
                            {/* Button for submission */}
                            <button type="submit" className="btn btn-outline-primary">Save Project</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
  }

export default ProjectForm;