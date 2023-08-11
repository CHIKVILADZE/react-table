import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get('https://node-myql.onrender.com')
      .then((response) => {
        setUsers(response.data);
        console.log('dataaa', response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleCheckboxChange = (e, userId) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBlock = () => {
    axios
      .put('https://node-myql.onrender.com/block-users', {
        userIds: selectedUsers,
      })
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: 'blocked' }
              : user
          )
        );
        console.log('Users blocked successfully.');
      })
      .catch((error) => {
        console.error('Error blocking users:', error);
      });

    setSelectedUsers([]);
  };

  const handleUnblock = () => {
    axios
      .put('https://node-myql.onrender.com/unblock-users', {
        userIds: selectedUsers,
      })
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: 'active' }
              : user
          )
        );
        console.log('Users unblocked successfully.');
      })
      .catch((error) => {
        console.error('Error unblocking users:', error);
      });

    setSelectedUsers([]);
  };
  const handleDelete = () => {
    Promise.all(
      selectedUsers.map((userId) =>
        axios
          .delete(`https://node-myql.onrender.com/users/${userId}`)
          .then(() => {
            console.log(`User with ID ${userId} deleted successfully.`);
            return userId;
          })
          .catch((error) => {
            console.error(`Error deleting user with ID ${userId}:`, error);
            return null;
          })
      )
    )
      .then((deletedUserIds) => {
        const updatedUsers = users.filter(
          (user) => !deletedUserIds.includes(user.id)
        );
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error('Error deleting users:', error);
      });

    setSelectedUsers([]);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between ">
        <h2>Dashboard</h2>
        <div
          className="d-flex justify-content-between "
          style={{ width: '200px' }}
        >
          <Button variant="danger" onClick={handleBlock} className="mr-2">
            Block
          </Button>
          <Button variant="success" onClick={handleUnblock} className="mr-2">
            <FontAwesomeIcon icon={faLockOpen} />
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      </div>
      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedUsers.length === users.length}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login Time</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, user.id)}
                  checked={selectedUsers.includes(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.last_login}</td>
              <td>{user.registration_time}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Dashboard;
