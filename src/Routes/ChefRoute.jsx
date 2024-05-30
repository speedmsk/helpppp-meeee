import { Outlet } from "react-router-dom";
import { useAuth } from "../utilities/useAuth";

function ChefRoute() {
  const { user } = useAuth();

  return (
    <>
      {!(user.userPost === "Chef") ? (
        <>You Are Not Allowed !</>
      ) : (
        <>
                  <Outlet />
        </>
      )}
    </>
  );
}
export default ChefRoute;