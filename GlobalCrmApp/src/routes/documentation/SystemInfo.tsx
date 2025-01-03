import React from 'react';
import { FaUpload, FaEdit, FaTrash, FaTicketAlt, FaUserShield, FaUser, FaChartLine, FaBoxOpen, FaUsers } from 'react-icons/fa';
import '../../css/systemInfo.scss';

const SystemInfo = () => {
  return (
    <div className="system-info">
      <h1>CRM with Inventory Management System</h1>
      <p>Welcome to My CRM with Inventory Management System. This guide will help you understand the functionalities and how to use them effectively.</p>
         <section>
        <h2>System History</h2>
        <p>Our CRM with Inventory Management System has been developed to streamline business operations and improve efficiency. The system allows users to manage customer relationships, track inventory, and handle support tickets all in one place. Over time, we have added numerous features to enhance functionality and user experience.</p>
        <p>The system was initially launched in 2020 with basic CRM functionalities. In 2021, inventory management features were integrated, allowing users to track stock levels, manage suppliers, and generate inventory reports. In 2022, we introduced advanced analytics and reporting tools, providing users with valuable insights into their business operations.</p>
        <p>We continuously strive to improve the system based on user feedback and industry trends. Our goal is to provide a comprehensive solution that meets the evolving needs of businesses.</p>
      </section>
      <section>
        <h2>General User Operations</h2>
        <div className="operation">
          <FaUpload className="icon" />
          <div>
            <h3>Upload Data</h3>
            <p>To upload data, navigate to the 'Upload' section and select the file you wish to upload. Ensure the file format is correct. Supported formats include CSV, Excel, and JSON.</p>
          </div>
        </div>
        <div className="operation">
          <FaEdit className="icon" />
          <div>
            <h3>Edit Data</h3>
            <p>To edit existing data, go to the 'Edit' section, select the record you want to modify, and make the necessary changes. You can update customer information, inventory details, and more.</p>
          </div>
        </div>
        <div className="operation">
          <FaTrash className="icon" />
          <div>
            <h3>Delete Data</h3>
            <p>To delete data, navigate to the 'Delete' section, select the record you want to remove, and confirm the deletion. Be cautious as this action is irreversible.</p>
          </div>
        </div>
        <div className="operation">
          <FaTicketAlt className="icon" />
          <div>
            <h3>Open Ticket</h3>
            <p>If you encounter any issues, you can open a support ticket in the 'Support' section. Provide a detailed description of the issue, and our support team will assist you promptly.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Admin Operations</h2>
        <div className="operation">
          <FaUserShield className="icon" />
          <div>
            <h3>Manage Users</h3>
            <p>Admins can manage user accounts in the 'User Management' section. This includes adding new users, editing existing user details, and deleting user accounts. Ensure to assign appropriate roles and permissions.</p>
          </div>
        </div>
        <div className="operation">
          <FaUser className="icon" />
          <div>
            <h3>View User Activity</h3>
            <p>Admins can view user activity logs in the 'Activity Logs' section to monitor system usage and identify any issues. This helps in maintaining system security and efficiency.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>System Features</h2>
        <div className="operation">
          <FaChartLine className="icon" />
          <div>
            <h3>Analytics and Reporting</h3>
            <p>Our system provides advanced analytics and reporting tools. Users can generate reports on sales, inventory levels, customer interactions, and more. These insights help in making informed business decisions.</p>
          </div>
        </div>
        <div className="operation">
          <FaBoxOpen className="icon" />
          <div>
            <h3>Inventory Management</h3>
            <p>The inventory management module allows users to track stock levels, manage suppliers, and generate inventory reports. Users can set reorder levels and receive notifications when stock is low.</p>
          </div>
        </div>
        <div className="operation">
          <FaUsers className="icon" />
          <div>
            <h3>Customer Relationship Management (CRM)</h3>
            <p>Our CRM module helps users manage customer interactions, track leads, and maintain customer profiles. Users can log communications, schedule follow-ups, and analyze customer data to improve relationships.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>System Routes</h2>
        <p>Below are the main routes used in our system:</p>
        <ul>
          <li><strong>/dashboard</strong> - The main dashboard providing an overview of key metrics and recent activities.</li>
          <li><strong>/upload</strong> - The section where users can upload data files.</li>
          <li><strong>/edit</strong> - The section for editing existing records.</li>
          <li><strong>/delete</strong> - The section for deleting records.</li>
          <li><strong>/support</strong> - The support section for opening and managing support tickets.</li>
          <li><strong>/user-management</strong> - The admin section for managing user accounts.</li>
          <li><strong>/activity-logs</strong> - The admin section for viewing user activity logs.</li>
          <li><strong>/analytics</strong> - The section for generating and viewing reports and analytics.</li>
          <li><strong>/inventory</strong> - The section for managing inventory.</li>
          <li><strong>/crm</strong> - The section for managing customer relationships.</li>
        </ul>
      </section>

     
    </div>
  );
};

export default SystemInfo;