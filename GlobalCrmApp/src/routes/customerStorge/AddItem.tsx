import React, { useState } from 'react'
import '../../css/table.scss'
interface AddItemProps {
  onClose: () => void;
  custoemrId: string;
  customerName: string;
}
const AddItem: React.FC<AddItemProps> = ({ onClose, custoemrId, customerName }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  return (
    <div className='mt-15'>
      <h2>Add Item {customerName} {}</h2>
      <button onClick={onClose}>Close</button>
 
    </div>
  );
};


  export default AddItem