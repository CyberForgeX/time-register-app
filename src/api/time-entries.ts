import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TimeEntry } from "../types/TimeEntry";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Create an Axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response data for successful requests
type ApiResponse<T> = {
  success: true;
  data: T;
};

// Response data for failed requests
type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
};

// Type that represents a response from the API
type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// Function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(
      `API error: ${error.response.status} - ${error.response.statusText}`
    );
    return {
      success: false,
      error: {
        message: error.response.data.message,
        statusCode: error.response.status,
      },
    } as ApiResult<never>;
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API error: No response received from server.");
    return {
      success: false,
      error: {
        message: "No response received from server.",
        statusCode: 0,
      },
    } as ApiResult<never>;
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("API error:", error.message);
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: 0,
      },
    } as ApiResult<never>;
  }
};

// Function to fetch all time entries
export const getTimeEntries = async (): Promise<ApiResult<TimeEntry[]>> => {
  try {
    const response: AxiosResponse<TimeEntry[]> = await axiosInstance.get(
      "/time-entries"
    );
    return {
      success: true,
      data: response.data,
    } as ApiResult<TimeEntry[]>;
  } catch (error) {
    return handleApiError(error);
  }
};

// Function to add a new time entry
export const addTimeEntry = async (
  entry: TimeEntry
): Promise<ApiResult<TimeEntry>> => {
  try {
    const response: AxiosResponse<TimeEntry> = await axiosInstance.post(
      "/time-entries",
      entry
    );
    return {
      success: true,
      data: response.data,
    } as ApiResult<TimeEntry>;
  } catch (error) {
    return handleApiError(error);
  }
};

// Function to delete a time entry
export const deleteTimeEntry = async (
  id: number
): Promise<ApiResult<never>> => {
  try {
    await axiosInstance.delete(`/time-entries/${id}`);
    return {
      success: true,
    } as ApiResult<never>;
  } catch (error) {
    return handleApiError(error);
  }
};


export { getTimeEntries, addTimeEntry, deleteTimeEntry };