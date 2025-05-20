import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../api/api';

/**
 * This page contains all the project list 
 * @returns Project component
 */
function Project() {
    const [projects, setProjects] = useState([]);


    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects);
        }
        fetchProjects();
    }, []);

    // Remove the delete project by setting projects to those that don't have assocaited delete project id
    async function handleDelete(id) {
        if (id) {
            await deleteProject(id);
            setProjects(deletedProject => deletedProject.filter(p => p.id !== id));
        }
    }

    return (
        <div>
            <h2>Projects</h2>
            <h5 className="text-secondary">
                All your added projects are shown on this page. You can edit or delete
                existing projects and view their locations. <br />
                Click the 'Add Projects' button to create a new project.
            </h5>

            <div className='row'>
                <div className='col'>
                <Link to="/newProject" className="btn btn-primary mt-3 pt-2">Add Projects</Link>
                </div>
            </div>

            <div className='container pt-4'>
            {/* Display all the added projects */}
            {projects.map(project => (
            
            <div className="card mb-3" key={project.id}>
                <div className='d-flex justify-content-between align-items-start'> 
                    <div className="card-body">
                        {/* https://stackoverflow.com/questions/78887828/conditional-rendering-based-on-a-boolean-value-in-react-js */}

                        {project.is_published && (
                                <button className="rounded-0 btn-space btn btn-success btn-sm">Published</button>
                        )}
                        
                        <div className='ms-2 me-auto'>
                            <h5 className="card-title pt-2">{project.title}</h5>
                            
                            <p className="card-text">
                            {project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}
                            </p>
                        </div>
                    </div>

                    {/* Handle buttons */}
                    <div className='mt-4 pe-2'>
                        <Link to={`/editProject/${project.id}`} className="btn btn-outline-secondary bi bi-pencil-fill"> Edit</Link>
                    </div>
                    <div className='mt-4 pe-2'>
                        <Link to={`/location/${project.id}`} className="btn btn-outline-info bi bi-geo-alt"> View Locations</Link>
                    </div>
                    <div className='mt-4 pe-3'>
                        <button onClick={() => handleDelete(project.id)} className='btn btn-outline-danger bi bi-trash'> Delete</button>
                    </div>
              </div>
            </div>
          ))}
            </div>
        </div>
    );
  }

export default Project;