import { Outlet } from "react-router-dom";
import { useAuth } from "../utilities/useAuth";

function DeveloperRoute() {
  const { user } = useAuth();

  return (
    <>
      {/* {!(user.userPost === "Developer") ? (
        <>You Are Not Allowed !</>
      ) : (
        <> */}
                  <Outlet />
        {/* </>
      )} */}
    </>
  );
}
export default DeveloperRoute;