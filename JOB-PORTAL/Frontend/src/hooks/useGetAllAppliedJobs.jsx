import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const token = useSelector((store) => store.auth.token);
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        console.log("API Response:", res.data);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppliedJobs();
  }, [dispatch, token]);
  return null;
};

export default useGetAppliedJobs;
