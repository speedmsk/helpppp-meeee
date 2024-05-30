import { Outlet} from "react-router-dom";

function PublicWrapper() {

  return (
    <>
      <Outlet />
    </>
  );
}

export default PublicWrapper;