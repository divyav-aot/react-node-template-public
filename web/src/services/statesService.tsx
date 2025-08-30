import axios, { AxiosError } from "axios";
import { apiRequest, apiSuccess, apiFailure } from "../store/apiSlice";
import { State } from "../types/state";
import { AppDispatch } from "../store";

const API_URL = import.meta.env.VITE_PYTHON_API_BASE_URL + "/api/v1";

export const saveState =
  (stateData: State) => async (dispatch: AppDispatch) => {
    const key = "saveState";
    dispatch(apiRequest(key));
    try {
      const response = await axios.post(API_URL + "/states/", stateData);
      dispatch(apiSuccess({ key, data: response.data }));
      return response.data;
    } catch (error: unknown) {
      dispatch(apiFailure({ key, error: (error as AxiosError).message }));
      throw error;
    }
  };

export const fetchStates = () => async (dispatch: AppDispatch) => {
  const key = "fetchStates";
  dispatch(apiRequest(key));
  try {
    console.log("API_URL:", API_URL);
    const response = await axios.get(API_URL + "/states/");
    dispatch(apiSuccess({ key, data: response.data }));
  } catch (error: unknown) {
    dispatch(apiFailure({ key, error: (error as AxiosError).message }));
  }
};

const stateService = {
  saveState,
  fetchStates,
};

export default stateService;
