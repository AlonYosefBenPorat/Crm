import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getActiveTickets } from '../services/TicketServices';

interface TicketContextProps {
  tickets: any[];
  selectedTicket: any | null;
  activities: any[];
  setSelectedTicket: (ticket: any) => void;
  setActivities: (activities: any[]) => void;
  refreshData: () => Promise<void>;
}

interface TicketProviderProps {
  children: ReactNode;
}

const TicketContext = createContext<TicketContextProps | undefined>(undefined);

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const fetchTickets = async () => {
    try {
      const activeTickets = await getActiveTickets();
      setTickets(activeTickets);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    }
  };

  const refreshData = async () => {
    await fetchTickets();
    if (selectedTicket) {
      const updatedTicket = tickets.find(ticket => ticket.ticketId === selectedTicket.ticketId);
      setSelectedTicket(updatedTicket);
      setActivities(updatedTicket ? updatedTicket.userActivities : []);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, selectedTicket, activities, setSelectedTicket, setActivities, refreshData }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
};