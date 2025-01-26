import React from "react";
import '../../css/table.scss';

const Roles: React.FC = () => {
  return (
    <div className="container">
      <p className="text-center">Documentation Page</p>
      <table className="table">
        <thead>
          <tr >
            <th>Section</th>
            <th>Role</th>
            <th>Global Admin</th>
            <th>Reader Admin</th>
            <th>Service Admin</th>
            <th>Viewer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Customer</td>
            <td>Open New Customer</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Update Customer Details</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Disable/Enable Customer</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>See All Clients</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td></td>
            <td>Delete Customer</td>
            <td>✓</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>See All Customers With Items</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td></td>
            <td>Edit Customer</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Users</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Disable Lock Time to User</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Reset User Password</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>See All Users</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Add New User</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Update User Details</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Delete User</td>
            <td>✓</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Send User Reset Password to Email</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Reset Password</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td></td>
            <td>Disable/Enable User</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Update User Job Title</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Grant User Permission to Customer</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
            <td></td>
          </tr>
          <tr>
            <td>Products</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>See Products</td>
            <td>✓</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td></td>
            <td>See Product by Id</td>
            <td>✓</td>
            <td>✓</td>
            <td></td>
            <td>✓</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Roles;