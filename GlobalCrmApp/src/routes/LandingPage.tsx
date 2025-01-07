import { Typography } from '@mui/material';
import '../css/landingPage.scss';
import { azureConfig } from '../utils/config';
import { FaRegCopyright } from 'react-icons/fa';

const { accountName, containerName, blobName, sasToken } = azureConfig;
const backgroundImg = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

const LandingPage = () => {
  return (
    <div
      className="landing-page"
      style={{ backgroundImage: `url(${backgroundImg})` }} 
    >
      <div className="text-center">
        <h1 className="heading">Welcome to My IT CRM & Inventory Web App</h1>
        <p className="subheading">
          "The System That Will Boost Your Business Productivity"
          <br />
          Our comprehensive platform for inventory management, employee oversight, and task tracking is designed to elevate your business operations. With this system, you can:
          <br />
          <br />
          - View all your clients in one centralized location.
          <br />
          - Efficiently manage inventory and receive proactive alerts for licenses nearing expiration.
          <br />
          - Monitor task progress across all your clients to ensure nothing falls through the cracks.
          <br />
          <br />
          Tailored specifically for IT integration companies, whether managing a large or small client base, this system empowers your team to streamline workflows, improve task management, and maximize operational efficiency.
        </p>
      </div>

      <div className="background-svg"></div>
      <footer className="footer">
        <Typography variant="body2" align="center">
          <FaRegCopyright /> All rights reserved Alon Ben Porat
        </Typography>
      </footer>
    </div>
  );
};

export default LandingPage;