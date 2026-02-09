import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "../rbac/userPermissions";

function Can({ requiredPermission, children }) {
    const user = useSelector((state) => state.userDetails);
    const userPermissions = ROLE_PERMISSIONS[user?.role] || {};

    if (userPermissions[requiredPermission]) {
        return children;
    } else {
        return null;
    }
}

export default Can;