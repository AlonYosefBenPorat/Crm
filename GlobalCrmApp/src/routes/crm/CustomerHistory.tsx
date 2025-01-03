import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getTicketByCustomerId } from '../../services/TicketServices';
import { formatDate } from '../../helperFunction/formatDate';


interface Ticket {
  ticketId: number;
  title: string;
  subject: string;
  description: string;
  createdAt: string;
  startTime: string;
  endTime: string;
  duration: string;
}

const CustomerHistory = ({ customerId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketByCustomerId(customerId);
        console.log("Customer ID: ", customerId);
        console.log('Fetched tickets:', response);

        const sortedTickets = response.sort((a: Ticket, b: Ticket) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const filteredTickets = sortedTickets.slice(0, 5);
        setTickets(filteredTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    if (customerId) {
      fetchTickets();
    }
  }, [customerId]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Title</TableCell>
          <TableCell>Subject</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Date</TableCell>
          
        </TableRow>
      </TableHead>
      <TableBody>
        {tickets.map(ticket => (
          <TableRow key={ticket.ticketId}>
            <TableCell>{ticket.ticketId}</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>{ticket.subject}</TableCell>
            <TableCell>{ticket.description}</TableCell>
             <TableCell>{formatDate (ticket.createdAt)}</TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerHistory;