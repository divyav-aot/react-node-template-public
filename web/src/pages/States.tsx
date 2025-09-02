import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { saveState, fetchStates } from "../services/statesService";
import { State } from "../types/state";
import "./users.css";

const States = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: states,
    loading,
    error,
  } = useSelector((state: RootState) => {
    return state.api["fetchStates"] || {};
  }, shallowEqual);

  const [formData, setFormData] = useState<State>({
    id: 0,
    name: "",
    description: "",
    is_active: true,
    sort_order: 0,
    created_at: "",
    updated_at: null,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(saveState(formData));
      setMessage("State saved successfully!");
      dispatch(fetchStates());
    } catch (error: any) {
      setMessage(
        error?.message
          ? `Error saving state: ${error.message}`
          : "Error saving state."
      );
    }
  };

  return (
    <div className="users-container">
      <h1 className="users-title">States</h1>
      <form className="users-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">State Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="is_active">is_active:</label>
          <input
            id="is_active"
            type="boolean"
            name="is_active"
            value={formData.is_active ? "true" : "false"}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="sort_order">sort_order:</label>
          <input
            id="sort_order"
            type="number"
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="created_at">created_at:</label>
          <input
            id="created_at"
            type="date"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save State</button>
      </form>
      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && states && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>is_active</th>
              <th>sort_order</th>
              <th>created_at</th>
            </tr>
          </thead>
          <tbody>
            {states?.map((state: State, index: number) => (
              <tr key={state.id || index}>
                <td>{state.id}</td>
                <td>{state.name}</td>
                <td>{state.description}</td>
                <td>{state.is_active}</td>
                <td>{state.sort_order}</td>
                <td>{state.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default States;
