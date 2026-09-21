import type { AxiosInstance } from "axios";
import axios from "axios";

const baseURL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";
export const httpClient: AxiosInstance = axios.create({ baseURL });
