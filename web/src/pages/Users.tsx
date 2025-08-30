import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { saveUser, fetchUsers } from "../services/userService";
import { User } from "../types/user";
import "./users.css";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: users,
    loading,
    error,
  } = useSelector((state: RootState) => {
    return state.api["fetchUsers"] || {};
  }, shallowEqual);

  const [formData, setFormData] = useState<User>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(saveUser(formData));
      setMessage("User saved successfully!");
      dispatch(fetchUsers());
    } catch (_error) {
      setMessage("Error saving user.");
    }
  };

  console.log("Users data:", users);
  return (
    <div className="users-container">
      <h1 className="users-title">Users</h1>
      <form className="users-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="middleName">Middle Name:</label>
          <input
            id="middleName"
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save User</button>
      </form>
      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && users && (
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {users?.users?.map((user: User, index: number) => (
              <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.middleName || "-"}</td>
                <td>{user.lastName}</td>
                <td>{user.dateOfBirth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
