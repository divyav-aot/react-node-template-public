import axios, { AxiosError } from "axios";
import { apiRequest, apiSuccess, apiFailure } from "../store/apiSlice";
import { User } from "../types/user";
import { AppDispatch } from "../store";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const saveUser = (userData: User) => async (dispatch: AppDispatch) => {
  const key = "saveUser";
  dispatch(apiRequest(key));
  try {
    const response = await axios.post(API_URL + "/user/", userData);
    dispatch(apiSuccess({ key, data: response.data }));
    return response.data;
  } catch (error: unknown) {
    dispatch(apiFailure({ key, error: (error as AxiosError).message }));
    throw error;
  }
};

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  const key = "fetchUsers";
  dispatch(apiRequest(key));
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/users/"
    );
    dispatch(apiSuccess({ key, data: response.data }));
  } catch (error: unknown) {
    dispatch(apiFailure({ key, error: (error as AxiosError).message }));
  }
};

const userService = {
  saveUser,
  fetchUsers,
};

export default userService;
