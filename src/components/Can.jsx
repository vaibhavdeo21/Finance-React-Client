import { useSelector } from "react-redux";
// We keep your existing ROLE_PERMISSIONS exactly as you have them
import { ROLE_PERMISSIONS } from "../rbac/userPermissions";

function Can({ requiredPermission, group, children }) {
    const user = useSelector((state) => state.userDetails);
    
    // 1. Safety check: If there's no user, they can't see anything
    if (!user) return null;

    // 2. Determine the role. 
    // We start with the global user.role as a fallback.
    let effectiveRole = user.role; 

    // 3. If a group is provided, we check the group-specific role
    if (group) {
        // Find this user in the group's members array
        const memberInfo = group.members?.find(m => m.email === user.email);
        
        // Safety check: If they are the primary creator, they are the admin
        const isPrimaryAdmin = (group.adminId?._id || group.adminId) === user._id;

        if (isPrimaryAdmin || memberInfo?.role === 'admin') {
            effectiveRole = 'admin';
        } else if (memberInfo?.role === 'manager') {
            effectiveRole = 'manager';
        } else if (memberInfo?.role === 'viewer') {
            effectiveRole = 'viewer';
        }
    }

    // 4. Look up the permissions for the determined role
    const permissions = ROLE_PERMISSIONS[effectiveRole] || {};

    // 5. Check the specific boolean right (e.g. permissions['canUpdateGroups'])
    if (permissions[requiredPermission]) {
        return children;
    }

    return null;
}

export default Can;