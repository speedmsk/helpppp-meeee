import { Outlet } from "react-router-dom";
import { useAuth } from "../utilities/useAuth";

function AdminRoute() {
  const { user } = useAuth();

  return (
    <>
      {!(user.userPost === "admin") ? (
        <>You Are Not Allowed !</>
      ) : (
        <>
                  <Outlet />
        </>
      )}
    </>
  );
}
export default AdminRoute;