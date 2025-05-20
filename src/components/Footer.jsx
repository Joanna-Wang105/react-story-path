import React from 'react';

/**
 * The footer component that include some text 
 * @returns Footer component
 */
const Footer = () => (
  
    <footer className='mt-auto'>
      <div className="text-end mt-4">
        <div
          className="row align-items-end p-2 pull-right"
          style={{backgroundColor: "#373d70c4"}}
        >
          <div className="col-md-11 fs-5 text-light">About Us</div>
          <div className="col fs-5 ml-3 text-light">Contact</div>
        </div>
      </div>
    </footer>
  );

export default Footer;