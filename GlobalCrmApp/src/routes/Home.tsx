import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getActiveTickets } from '../services/TicketServices';
import { getUserPermissions } from '../services/userPermissionService';
import '../css/home.scss';

const Home: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [storedLastName, setStoredLastName] = useState<string | null>(null);
  const [openTickets, setOpenTickets] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString());
  const [permissions, setPermissions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFirstName = localStorage.getItem('UserFirstName');
    const storedLastName = localStorage.getItem('UserLastName');
    const userId = localStorage.getItem('userid');
    if (storedFirstName && storedLastName) {
      setFirstName(storedFirstName);
      setStoredLastName(storedLastName);
    }

    const fetchOpenTickets = async () => {
      const tickets = await getActiveTickets();
      setOpenTickets(tickets.length);
    };

    fetchOpenTickets();

    const fetchPermissions = async () => {
      if (userId) {
        const userPermissions = await getUserPermissions(userId);
        setPermissions(userPermissions);
      }
    };

    fetchPermissions();

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());

      const hours = now.getHours();
      if (hours >= 6 && hours < 12) {
        setGreeting('Good Morning');
      } else if (hours >= 12 && hours < 17) {
        setGreeting('Good Afternoon');
      } else if (hours >= 17 && hours < 20) {
        setGreeting('Good Evening');
      } else {
        setGreeting('Good Night');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='home-container'>
     
      <Typography variant="h5" gutterBottom>
        {greeting} {firstName} {storedLastName}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Today's Date:{currentDate}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="card">
            <CardContent className="card-content">
              <Typography className="card-title" variant="h6" gutterBottom>
                Open Tickets
              </Typography>
              <Typography className="card-text" variant="body1">
                {openTickets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="card">
            <CardContent className="card-content">
              <Typography className="card-title" variant="h6" gutterBottom>
                Current Time
              </Typography>
              <Typography className="card-text" variant="body1">
                {currentTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
  
      </Grid>
      <Button variant="contained" color="primary" className="button" onClick={() => navigate('/ticketCrm')}>
        Go to Ticket CRM
      </Button>
       <footer className="footer">
        <Typography variant="body2" align="center">
          All rights reserved Alon Ben Porat
        </Typography>
      </footer>
    </div>
  );
};

export default Home;