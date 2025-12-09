import { useContext } from "react";
import CustomersContext from "../contexts/CustomersContext";

export function useCustomers() {
  return useContext(CustomersContext);
}