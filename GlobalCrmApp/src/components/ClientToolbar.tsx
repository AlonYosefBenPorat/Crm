import React, { useEffect, useState } from 'react';
import '../css/Toolbar.scss';
import { BsRouter, BsServer } from 'react-icons/bs';
import { PiComputerTowerBold, PiShareNetworkThin } from 'react-icons/pi';
import { FaFolderTree, FaUsersLine } from 'react-icons/fa6';
import Employee from '../routes/customerStorge/Employee';
import Server from '../routes/customerStorge/Server';
import NetworkDevice from '../routes/customerStorge/NetworkDevice';
import Backup from '../routes/customerStorge/Backup';
import Asset from '../routes/customerStorge/Asset';
import Gatway from '../routes/customerStorge/Gatway';
import { FiSearch } from 'react-icons/fi';
import { MdBackup } from 'react-icons/md';
import { CgMinimizeAlt } from 'react-icons/cg';
import { MdOutlinePlaylistRemove, MdOutlineEditNote, MdOutlineCloudUpload, MdOutlineDeleteSweep } from 'react-icons/md';
import { RiMenuAddLine } from 'react-icons/ri';
import { GiReturnArrow } from 'react-icons/gi';
import CustomerChart from './CustomerChart';

interface ClientToolBarProps {
  customerId: string;
  customerName: string;
  customerLogoSrc: string; 
  customerLogoAlt: string; 
}

const ClientToolBar: React.FC<ClientToolBarProps> = ({ customerId: initialCustomerId, customerName: initialCustomerName, customerLogoSrc: initialCustomerLogoSrc, customerLogoAlt: initialCustomerLogoAlt }) => {
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerLogoSrc, setCustomerLogoSrc] = useState(initialCustomerLogoSrc);
  const [customerLogoAlt, setCustomerLogoAlt] = useState(initialCustomerLogoAlt);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isServerOpen, setIsServerOpen] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isNetworkDeviceOpen, setIsNetworkDeviceOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]); // Adjust the type as needed

  useEffect(() => {
    const selectedCustomerId = localStorage.getItem('selectedCardCustomerId');
    const selectedCustomerName = localStorage.getItem('selectedCardCustomerName');
    const selectedCustomerLogoSrc = localStorage.getItem('selectedCardCustomerLogoSrc');
    const selectedCustomerLogoAlt = localStorage.getItem('selectedCardCustomerLogoAlt');
    if (selectedCustomerId && selectedCustomerName && selectedCustomerLogoSrc && selectedCustomerLogoAlt) {
      setCustomerId(selectedCustomerId);
      setCustomerName(selectedCustomerName);
      setCustomerLogoSrc(selectedCustomerLogoSrc);
      setCustomerLogoAlt(selectedCustomerLogoAlt);
    }
  }, []);

  const openEmployee = () => {
    setIsEmployeeOpen(!isEmployeeOpen);
    setIsServerOpen(false);
    setIsGatewayOpen(false);
    setIsNetworkDeviceOpen(false);
    setIsBackupOpen(false);
    setIsAssetOpen(false);
  };

  const openServer = () => {
    setIsServerOpen(!isServerOpen);
    setIsEmployeeOpen(false);
    setIsGatewayOpen(false);
    setIsNetworkDeviceOpen(false);
    setIsBackupOpen(false);
    setIsAssetOpen(false);
  };

  const openGateway = () => {
    setIsGatewayOpen(!isGatewayOpen);
    setIsEmployeeOpen(false);
    setIsServerOpen(false);
    setIsNetworkDeviceOpen(false);
    setIsBackupOpen(false);
    setIsAssetOpen(false);
  };

  const openNetworkDevice = () => {
    setIsNetworkDeviceOpen(!isNetworkDeviceOpen);
    setIsEmployeeOpen(false);
    setIsServerOpen(false);
    setIsGatewayOpen(false);
    setIsBackupOpen(false);
    setIsAssetOpen(false);
  };

  const openBackup = () => {
    setIsBackupOpen(!isBackupOpen);
    setIsEmployeeOpen(false);
    setIsServerOpen(false);
    setIsGatewayOpen(false);
    setIsNetworkDeviceOpen(false);
    setIsAssetOpen(false);
  };

  const openAsset = () => {
    setIsAssetOpen(!isAssetOpen);
    setIsEmployeeOpen(false);
    setIsServerOpen(false);
    setIsGatewayOpen(false);
    setIsNetworkDeviceOpen(false);
    setIsBackupOpen(false);
  };

  const onClose = () => {
    setIsEmployeeOpen(false);
    setIsServerOpen(false);
    setIsGatewayOpen(false);
    setIsNetworkDeviceOpen(false);
    setIsBackupOpen(false);
    setIsAssetOpen(false);
  };

  const isAnyComponentOpen = () => {
    return isEmployeeOpen || isServerOpen || isGatewayOpen || isNetworkDeviceOpen || isBackupOpen || isAssetOpen;
  };

  return (
    <div className="toolbar mt-15">
      <div className="toolbar-container">
        <ul className="toolbar-list">
          <li><PiComputerTowerBold className="icon-button" title="Server" onClick={openServer} /></li>
          <li><MdBackup className="icon-button" title="Backup" onClick={openBackup} /></li>
          <li><BsRouter className="icon-button" title="Gateway" onClick={openGateway} /></li>
          <li><PiShareNetworkThin className="icon-button" title="NetworkDevice" onClick={openNetworkDevice} /></li>
          <li><FaUsersLine className="icon-button" title="Employee" onClick={openEmployee} /></li>
          <li><FaFolderTree className="icon-button" title="Asset" onClick={openAsset} /></li>
        </ul>
        <h1 className="header-title">
          <span className="header-gradient">{customerName}</span>
        </h1>
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <FiSearch className="search-icon" />
        </div>
        <div>
          <img src={customerLogoSrc} alt={customerLogoAlt} className="customer-logo" />
        </div>
      </div>

      {!isAnyComponentOpen() && <CustomerChart />}
      {isEmployeeOpen && <Employee customerId={customerId} customerName={customerName} />}
      {isServerOpen && <Server customerId={customerId} customerName={customerName} />}
      {isGatewayOpen && <Gatway onClose={openGateway} customerId={customerId} customerName={customerName} />}
      {isNetworkDeviceOpen && <NetworkDevice onClose={openNetworkDevice} customerId={customerId} customerName={customerName} />}
      {isBackupOpen && <Backup onClose={openBackup} customerId={customerId} customerName={customerName} />}
      {isAssetOpen && <Asset onClose={openAsset} customerId={customerId} customerName={customerName} />}
    </div>
  );
};

export default ClientToolBar;