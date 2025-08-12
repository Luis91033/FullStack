/** @format */

import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getUserByHandle } from "../api/DevTreeAPI";
import HandleData from "../components/HandleData";

const HandleView = () => {
  const params = useParams();
  const handle = params.handle!;
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ["handle", handle],
    retry: 1,
    refetchOnWindowFocus: false,
  });
  if (isLoading) return "Cargando...";
  if (error) return <Navigate to={"/404"} />;
  console.log(data);
  if (data) return <HandleData data={data} />;
};

export default HandleView;
