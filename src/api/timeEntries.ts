import axios, { AxiosInstance, AxiosResponse } from "axios";
import {TimeEntry} from '../types/TimeEntry';
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Create an Axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response data for successful requests
export type ApiResponse<T> = {
  success: true;
  data: T;
};

// Response data for failed requests
export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
};

// Type that represents a response from the API
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// Function to handle API errors
const handleApiError = (error: any): ApiResult<never> => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const status = response.status;
      console.error(
        `API error: ${status} - ${response.statusText}`
      );
      return {
        success: false,
        error: {
          message: response.data.message,
          statusCode: status,
        },
      };
    } else {
      console.error("API error: No response received from server.");
      return {
        success: false,
        error: {
          message: "No response received from server.",
          statusCode: 0,
        },
      };
    }
  } else {
    console.error("API error:", error.message);
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: 0,
      },
    };
  }
};

// Function to fetch all time entries
export const getTimeEntries = async (API_BASE_URL: string): Promise<ApiResult<TimeEntry[]>> => {
  try {
    const response: AxiosResponse<TimeEntry[]> = await axiosInstance.get(
      `${API_BASE_URL || "http://localhost:3000"}/time-entries`
    );
    return {
      success: true,
      data: response.data,
    };
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
    };
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
    };
  } catch (error) {
    return handleApiError(error);
  }
};
