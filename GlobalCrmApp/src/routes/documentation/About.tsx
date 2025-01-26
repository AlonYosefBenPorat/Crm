import React, { useState } from 'react'
import '../../css/about.scss'
import { GrClose } from 'react-icons/gr';

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleCardClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const generalFeaturesContent = (
    <div className="about-page">
      <h2>General Features</h2>
      <article>
       <h5>Modular Architecture:</h5>
        <ol>
          <li>Client-side: React-based development emphasizing reusable components and global state management.</li>
          <li>Server-side: ASP.NET Core with clear separation of controllers and repositories for logical segregation and maintainable, modular code.</li>
          <li>Database: SQL Server integrated with Azure Blob Storage for secure storage and management of images.</li>
        </ol>
        <h5>Authorization Management and Access Levels:</h5>
        <ol>
          <li>Advanced permission system combining predefined roles and individual permission levels (read/write/delete).</li>
          <li>Real-time adaptation of system interfaces and content based on user permissions.</li>
          <h6><b>Security mechanisms, including:</b></h6>
            <ol>
              <li>Complex passwords.</li>
              <li>Account locking after multiple failed login attempts.</li>
              <li>Generation of a unique token for secure password reset.</li>
            </ol>
          
        </ol>
        <h5>Integrations and Accessibility: </h5>
        <ol>
          <li>Adapts user experience based on device type (mobile/desktop).</li>
          <li>Supports Dark/Light modes using ARIA labels and enhanced accessibility through matching icons.</li>
          <li>Utilizes JWT (JSON Web Tokens) for secure user authentication and encrypted data transfer.</li>
        </ol>
      <h5>Logging and Documentation: </h5>
        <ol>
          <li>Dynamic logging of user actions within the system.</li>
          <li>Logs presented through interactive graphs and tables.</li>
          <li>Full tracking of login attempts, including successful and failed ones.</li>
        </ol>
      </article>
   </div>
  );

  const keyProjectHighlightsContent = (
    <div className="about-page">
      <h2>Key Project Highlights</h2>
      <article>
       <h5>Smart Login System:</h5>
        <ol>
          <li>Dynamic adaptation of interfaces and pages based on user access level.</li>
          <li>User details displayed in the top navigation menu.</li>
          <li>Session management through browser local storage, with automatic data clearance upon logout.</li>
        </ol>
       <h5>Notifications and User Feedback Mechanisms:</h5>
        <ol>
          <li>CRUD operation (Create, Read, Update, Delete) notifications providing clear feedback on success or failure.</li>
          <li>System messages about changes and errors via SMTP server.</li>
        </ol>
       <h5>Advanced Form Management:</h5>
        <ol>
          <li>Adding, deleting, and editing data in forms with advanced server-side validation.</li>
          <li>Mandatory fields clearly marked, with client-side prompts.</li>
        </ol>
       <h5>Code Organization and Separation:</h5>
        <ol>
          <li>The project is divided into folders by topics and controllers to maintain code readability, accessibility, and ease of maintenance.</li>
          <li>Initial data seeding for the database allows dynamic population during system startup.</li>
        </ol>
        <h5>Data Security and Access:</h5>
        <ol>
          <li>Database access is restricted to a specific URL (e.g., http://localhost:5173) via CORS.</li>
          <li>Encrypted tokens containing essential user details (role, first name, last name, profile picture) enable intelligent system use and data security.</li>
        </ol>
       <h5> Interactive Data Display:</h5> 
        <ol>
          <li>Data is displayed in tables with pagination (10 items per page) and options to navigate between pages or view all data in a single view for user convenience.</li>
        </ol>
      </article>
    </div>
  );

  const systemOverviewContent = (
    <div className="about-page">
      <h2>System Overview and Usage Instructions</h2>
      <article>
        <h5> Initial Login:</h5>
        <ul>
          <li>Global Admin User:</li>
          <ul>
            <li>Username: root@example.com</li>
            <li>Password: RootPassword123!</li>
          </ul>
       <h5> Roles Page:</h5>
        <ul>
          <li>This page documents and details system permissions.</li>
          <li>It indicates the permissions required to perform various actions and is displayed to users with administrative-level access only.</li>
        </ul>
        </ul>
      </article>
    </div>
  );

  const customerInterfaceContent = (
   <div className="about-page">
      <h2>Customer Interface</h2>
      <article>
        <h5>Customer Interface Overview:</h5>
        <h6>The customer interface is central to the system, allowing users to view, search, and perform actions on customers according to their allocated permissions.</h6>
       <h5> Structure and Key Features:</h5>
        <ol>
          <li>Customers are displayed visually through cards containing basic information, such as the customer's name, status (active/inactive), and alerts about license or warranty expiration.</li>
          <li>The card details show as table view </li>
        </ol>
            <h5>Main Graph on the Homepage:</h5>
            <ol>
              <li>The graph shows the amount of data (e.g., number of servers, assets, or communication devices) associated with the customer.</li>
              <li>Important notifications are displayed next to the graph, such as:
                <ol>
                  <li>A list of items that have expired.</li>
                  <li>Items nearing expiration.</li>
                </ol>
              </li>
            </ol>
         
            <h5>Custom Navigation Bar:</h5>
              <h6><b>Provides direct access to the following information:</b></h6>
                <ol>
                  <li><b>Servers Table:</b> Details of servers, including name, type, status, and purchase date.</li>
                  <li><b>Backup Systems Table:</b> Information on backup systems and their contract validity.</li>
                  <li><b>GATEWAY Table:</b> Technical details and status of network gateways.</li>
                  <li><b>Communication Devices Table:</b> List of routers, switches, and other devices.</li>
                  <li><b> Assets Table:</b> Includes software, licenses, and peripheral equipment.</li>
                  <li><b>Employees Table:</b> An updated list of employees associated with the customer, along with personal details.</li>
                </ol>
              <h6><b>Available Actions:</b></h6>
                <ol>
                  <li>Actions can be performed by selecting a row in the table and clicking the desired action in the table’s toolbar.</li>
                  <li>Customer details can also be edited directly from their main card.</li>
                </ol>
              
              <h5>Dynamic Notifications:</h5>
                <ol>
                  <li>For every successful or failed action, a dialog appears to notify the user of the action’s status.</li>
                </ol>
            
              <h5>Switching Between Tables and Pages:</h5>
                <ol>
                  <li>Tables can be collapsed, or the user can return to the homepage by clicking a dedicated button.</li>
                </ol>
      </article>
    </div>
  );

  const coreSystemFunctionalitiesContent = (
    <div className="about-page">
      <h2>Core System Functionalities</h2>
      <article>
       <h5>User Management and Personalization:</h5>
          <ol>
            <li>User details such as name and profile picture can be edited by clicking the user icon, but email and username are fixed.</li>
            <li>Profile pictures are securely stored in Azure Blob Storage.</li>
            <li>Add, edit, delete users, reset passwords, and temporarily or permanently block accounts based on permissions.</li>
            <li>Automatic account lock after five failed login attempts, with manual unlock available in the locked accounts interface.</li>
            <li>Clear feedback on operation success or failure.</li>
          </ol>
        <h5>Client Management and Business Data:</h5>
        <ol>
          <li>New clients can be added with details filled in and the option to upload a logo to Azure Blob.</li>
          <li>Editing a client is done by selecting from the table, with mandatory fields highlighted and server-side validation.</li>
          <li>Inactive clients are hidden from regular user views but remain in the database with the option to reactivate.</li>
          </ol>
        <h5>Client Interface:</h5>
          <ol>
            <li>Displays an interactive list of all clients in card or table views.</li>
            <li>Search options by various criteria with client details including:</li>
            <li>Graphs showing data volume and current warranty/license status.</li>
            <li>Detailed lists of servers, backups, routers, communication devices, assets, and employees.</li>
            <li>Permissions allow adding, editing, or deleting data.</li>
          </ol>
        <h5>Task Management:</h5>
          <ol>
            <li>Add, edit, delete, and close tasks or sub-tasks.</li>
            <li>Filter tasks by client, responsible user, or status (open/closed).</li>
            <li>Task description and details accessible with a double-click.</li>
            <li>Built-in stopwatch for tracking ticket resolution time.</li>
            </ol>
        <h5>Dynamic Client Permissions System:</h5>
        <ol>
          <li>Designed for managers or service managers only.</li>
          <li>Assigning permissions to users as required, with clear success/failure indicators.</li>
          <li>Updating permissions with automated email notifications to users.</li>
          <li>Searching for users and removing all assigned permissions.</li>
          </ol>
      </article>
    </div>
  );

  const customerPermissionsManagementContent = (
    <div className="about-page">
      <h2>Customer Permissions Management System</h2>
      <article>
        <h6><b>Central Interface for System and Service Managers:</b></h6>
        <h6>This system enables flexible and focused management of user permissions at the customer level.</h6>
        <h5>Key Features:</h5>
          <h6><b>User Selection and Permissions Management:</b></h6>
            <ol>
              <li>The selected user is displayed in from input with a detailed breakdown of their current permissions.</li>
              <li>Checking a box next to a specific permission immediately assigns it to the user.</li>
              <li>In case of a failure (e.g., technical issue or permissions conflict), a clear notification is displayed.</li>
              <li>Permission Updates and Automatic Email Notifications</li>
              <li>A summary of newly assigned permissions can be sent to the user by clicking an envelope icon.</li>
              <li>The email is automatically sent to the address stored in the database.</li>
            </ol>
          <h5>Core Actions: </h5>
            <ol>
              <li>Send All Permissions-  Allows managers to send the user a complete summary of their assigned permissions.</li>
              <li>Remove Permissions - Clicking a dedicated button removes all permissions for a user.</li>
              <li>Search Users - advanced search field at the top of the page enables finding users based on various criteria.</li>
            </ol>
      </article>
    </div>
  );

  const securityAndDataManagementContent = (
    <div className="about-page">
      <h2>Security and Sensitive Data Management</h2>
      <article>
        <h5>Sensitive Data Handling:</h5>
        <ol>
          <li>All security data and sensitive configurations (e.g., DB, SMTP) are managed within the appsettings.json file.</li>
          <li>Secure database connections are restricted to pre-defined URLs via CORS (Cross-Origin Resource Sharing).</li>
          <li>An encrypted token contains user details, including role, first and last name, profile picture, and date of birth, enabling personalized interface adjustments.</li>
        </ol>
        <h5>Key Highlights:</h5>
        <ol>
          <li>User-Friendly Design - Interfaces are designed with an emphasis on intuitive and interactive user experiences, ensuring smooth navigation between pages and different modules.</li>
          <li>Data Security - Full data security is maintained with advanced validation implemented on both the server and client sides for critical operations.</li>
          <li>The system supports comprehensive tracking of permissions, access logs, and user actions, providing managers with full transparency and control.</li> 
        </ol>
      </article>
    </div>
  );

  const backendASPNETCoreContent = (
  <div className="about-page">
    <h2>Server Side – ASP.NET Core</h2>
    <article>
      <h5>Code Structure and Design:</h5>
      <ol>
        <li>Code build modularity with layered structure</li>
        <li>The code is separated into controllers according to entities, ensuring ease of maintenance and future scalability.</li>
        <li>There is a clear separation of layers between models and controllers, which ensures a clean design following the MVC (Model-View-Controller) principles.</li>
        </ol>
          <h5>Key Layers and Utilities:</h5>
          <ol>
            <li>DAL (Data Access Layer): Handles direct interaction with the database.</li>
            <li>Repository: Manages business logic and handles reading/writing to the database.</li>
            <li>Mapping: Facilitates the mapping between different objects in the system, making it easier to work with DTOs (Data Transfer Objects) and additional layers.</li>
          </ol>
        <h5>Configuration and Settings Management:</h5>
          <ol>
            <li>Configuration data is stored in a JSON file, which provides flexibility and ease of management for system settings.</li>
          </ol>
        <h5>Authentication Mechanism:</h5>
          <ol>
            <li>JWT Token Usage:</li>
            <li>The token is required as part of the route in each request.</li>
            <li>Authorization is handled based on a general permission level or custom permissions according to specific models.</li>
          </ol>
      
        <h5>Managing Table Relationships:</h5>
          <ol>
            <li>The relationships between tables are defined in WebAppContext.cs, using EF Core (Entity Framework Core).</li>
            <li>The types of relationships (inheritance, entity relationships) are documented in comments above each entity, making it easier for reviewers or developers to understand.</li>
          </ol>
    </article>
  </div>
);

  const frontendReactWithTypeScript = (
  <div className="about-page">
    <h2>Client Side – React with TypeScript</h2>
    <article>
      <h5>User Experience (UX/UI):</h5>
      <ol>
        <li>Intuitive Structure and Code Organization:</li>
        <li>The code is organized into folders by entities and permissions, which simplifies maintenance and scalability.</li>
        <li>Clear and modular navigation between interface components.</li>
          </ol>
        <h5>Key Features:</h5>
        <ol>        
          <li><b>Search and Filter:</b> interface includes search and filter fields, allowing users to focus on relevant information.</li>
          <li><b>Accessibility Considerations:</b> Every icon includes a title attribute for enhanced accessibility.</li>
          <li><b>Graphs and Data Analysis:</b> Graphs are used to present data and perform analysis in a clear and interactive manner.</li>
          <li><b>Dark/Light Mode:</b> Full support for dark/light mode across all interfaces and forms.</li>
        </ol>
          <h5>CRM System Interface:</h5>
              <ol>
                <li>Dynamic build and User-Friendly Structure</li>
                  <li>Intuitive navigation bars.</li>
                  <li>Available actions: add, edit, modify data, and view, including double-click functionality to open more details.</li>
                 <h6><b>Data Relationships:</b></h6>
                    <li> Opening a task for a client allows adding contacts from that client’s employee list only.</li>
                    <li>The ability to add tags to tasks, enabling more efficient searches and establishing relationships between tickets.</li>
                  </ol>
                
                <h5>Custom Navigation Management:</h5>
                  <ol>
                    <li>Pages not found (404) navigate to a dedicated page.</li>
                    <li>Pages without authorization (401) navigate to a page notifying the user of lack of access.</li>
                </ol>    
    </article>
  </div>
  );
  
 const integrationBetweenServerSideandClientSide = (
  <div className="about-page">
    <h2>Integration Between Server Side and Client Side</h2>
    <article>
      <h5>Information Security:</h5>
      <ol>
        <li>Every action requires a JWT Token, ensuring advanced security and user authentication.</li>
      </ol>
     <h5> Support for Graphs and Reports:</h5>
      <ol>
        <li>Data is sent from the server to the client in a structured format (JSON) and displayed in interactive graphs.</li>
      </ol>
      <h5>Accessibility and Operational Simplicity:</h5>
      <ol>
        <li>The system is designed to be accessible to users, adhering to UX/UI principles and maintaining a clear separation of roles.</li>
      </ol>
    </article>
  </div>
);
 const extraContent = (
  <div className="about-page">
    <h2>Bonuses – Development Project</h2>
    <article>
     <h5> Design and Structure:</h5>
        <h6><b>CSS File Organization:</b></h6>
          <ol>
            <li>Organized by topics and pages</li>
            <li>Each CSS file is dedicated to a specific topic (e.g., tables) or a particular page, ensuring easy maintenance and clear readability.</li>
            <li>Consistent design of tables and navigation bars across pages and application depths to enhance user experience.</li>
          </ol>
       
        <h5>Icons and Dialogs:</h5>
          <ol>
            <li>React Icons are used to display intuitive and uniform icons across the interface.</li>
            <li>SweetAlert (Swal) is employed for beautiful and interactive dialogs for various actions, such as confirmations or error messages.</li>
          </ol>
        <h5>Graphs and Reports:</h5>
          <ol>
            <li>React Chart is used to display clear and interactive graphs for data analysis.</li>
          </ol>
        <h5>Advanced Design:</h5>
          <ol>
            <li>Integration of Tailwind CSS for structured and customizable designs.</li>
            <li>Additional designs are built using SCSS, focusing on finding and adapting web design solutions.</li>
          </ol>
      
        <h5>External Resource Management:</h5>
          <ol>
            <li>The application background, logo, and title image are stored in Azure Blob Storage.</li>
            <li>For testing and presentation, access to these files is open to all IPs. In a real project, access would be restricted to the application server only.</li>
          </ol>
        
        <h5>Advanced Functionality – Client Side:</h5>
      <ol>
        <li><b>Use of UseContext:</b> Manages user connections, ticket handling, and activates Dark/Light Mode in a centralized and intuitive manner.</li>
        <li><b>Login System:</b> User login is performed via server requests (API), utilizing a secure authorization mechanism.</li>
        <li><b>Image Storage:</b> All media files (e.g., images) are securely and optimally stored in Azure Blob Storage.</li>
      </ol>
     <h5> Advanced Functionality – Server Side:</h5>
        <h6><b>Background Processes (Background Threads):</b></h6>
          <ol>
            <li>Log Management</li>
            <li>Automatically sends logs of user logins and logouts to pre-defined email addresses.</li>
            <li>Deletes logs after one year to maintain a small and efficient database.</li>
            <li>Implemented in LogCleanupService and LogEmailBackgroundService under the Services folder.</li>
          </ol>
        <h6><b>SMTP Notifications:</b></h6>
          <ol>
            <li>Automatically sends email notifications using Gmail’s SMTP server.</li>
            <li>This mechanism is used for sending critical updates, such as system alerts or task updates.</li>
          </ol>
       <h6><b> Additional Features Enhancing User Experience:</b></h6>
      <ol>
        <b>Dark/Light Mode Support: </b>
        <li> User-friendly design with support for both dark and light modes, applied across all parts of the system.</li>
        <b>Error Management and Custom Navigation: </b>
        <li> Automatic navigation to a 404 page in the case of a page not found.</li>
        <li> Automatic navigation to a 401 page in the case of unauthorized access attempts.</li>
          </ol>
    </article>
  </div>
  );
  
 const summryAddedValueOfTheProject = (
  <div className="about-page">
    <h2>Added Value of the Project</h2>
    <article>
     <h5> Maintenance and Easy Code/Design Management:</h5>
      <ol>
        <li>Utilization of smart solutions for code organization.</li>
         <li>Clear separation of code layers and entities.</li>
         <li>Easy maintenance and scalability.</li>
       </ol>  
      <h5>Performance and Efficiency Improvement:</h5>
      <ol>
        <li>Log management and background processes ensure sustained system performance over time.</li>
      </ol>
      <h5>Usability and Convenience:</h5>
      <ol>
        <li>Intuitive design, interactive graphs, and accessibility features provide a rich user experience.</li>
      </ol>
     <h5> Information Security:</h5>
      <ol>
        <li>The integration of JWT and access restrictions guarantees a secure working environment.</li>
      </ol>
      <h6><b>Final Project Summary – Alon Ben Porat: </b></h6>
       <ul>
       <li className='text-center'><b>In this project, which involved  months of planning, design, and execution, a unique CRM system was built for IT companies managing end customers. The system consists of seven diverse interfaces, enabling multi-layered management of users, clients, end devices, and tasks.</b></li>
       </ul>      
    </article>
  </div>
);

return (
    <div className="about-page">
      <div className="container mt-16">
        <div className="header">
          <b>Final Project: CRM Application for IT Companies</b><br />
          By: Alon Ben Porat
        </div>
        <div className="introduction">
          <h2><b>Introduction to the Application</b></h2>
          <article>
            The system is built with 7 diverse interfaces for a CRM application designed for IT companies managing multiple end customers.
            It supports layered functionality for each interface and seamless integration between modules.
            The application enables management of users, customers, end equipment, and a task management system.
          </article>
        </div>
        <div className="grid-container">
          <div className="sidebar">
            <h4>Contents</h4>
            <ul>
              <li onClick={() => handleCardClick(generalFeaturesContent)}>1. General Features</li>
              <li onClick={() => handleCardClick(keyProjectHighlightsContent)}>2. Key Project Highlights</li>
              <li onClick={() => handleCardClick(systemOverviewContent)}>3. System Overview and Usage Instructions</li>
              <li onClick={() => handleCardClick(customerInterfaceContent)}>4. Customer Interface</li>
              <li onClick={() => handleCardClick(coreSystemFunctionalitiesContent)}>5. Core System Functionalities</li>
              <li onClick={() => handleCardClick(customerPermissionsManagementContent)}>6. Customer Permissions Management System</li>
              <li onClick={() => handleCardClick(securityAndDataManagementContent)}>7. Security and Sensitive Data Management</li>
              <li onClick={() => handleCardClick(backendASPNETCoreContent)}>8. Backend - ASP.NET Core</li>
              <li onClick={() => handleCardClick(frontendReactWithTypeScript)}>9. Frontend - React with TypeScript</li>
              <li onClick={() => handleCardClick(integrationBetweenServerSideandClientSide)}>10. Integration Between Server-Side and Client-Side</li>
              <li onClick={() => handleCardClick(extraContent)}>11. Extras</li>
              <li onClick={() => handleCardClick(summryAddedValueOfTheProject)}>12. Summary Added Value Of The Project</li>
            </ul>
          </div>
          <div className="content">
            <div className="card" onClick={() => handleCardClick(generalFeaturesContent)}>
              <h3>General Features</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(keyProjectHighlightsContent)}>
              <h3>Key Project Highlights</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(systemOverviewContent)}>
              <h3>System Overview and Usage Instructions</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(customerInterfaceContent)}>
              <h3>Customer Interface</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(coreSystemFunctionalitiesContent)}>
              <h3>Core System Functionalities</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(customerPermissionsManagementContent)}>
              <h3>Customer Permissions Management System</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(securityAndDataManagementContent)}>
              <h3>Security and Sensitive Data Management</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(backendASPNETCoreContent)}>
              <h3>Backend - ASP.NET Core</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(frontendReactWithTypeScript)}>
              <h3>Frontend - React with TypeScript</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(integrationBetweenServerSideandClientSide)}>
              <h3>Integration Between Server-Side and Client-Side</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(extraContent)}>
              <h3>Extras</h3>
              <p className='underline'>Click to read more...</p>
            </div>
            <div className="card" onClick={() => handleCardClick(summryAddedValueOfTheProject)}>
              <h3>Summary Added Value Of The Project</h3>
              <p className='underline'>Click to read more...</p>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <>
            <div className="modal-overlay" onClick={handleCloseModal}></div>
            <div className="modal">
              {modalContent}
              <GrClose onClick={handleCloseModal} className="close-button" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default About;