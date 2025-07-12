// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Role-Based Access Control (RBAC) Contract
/// @notice This contract manages user roles for decentralized vehicle-related services.

contract RBACAccessControl {
    /// @dev Enum representing possible roles in the system
    enum Role {
        None,
        Owner,
        Service,
        Insurance,
        Ministry,
        Police,
        ScrapCenter,
        KTEO
    }

    /// @notice Mapping of addresses to their assigned roles
    mapping(address => Role) public roles;

    /// @notice Internal mapping of roles to arrays of addresses with that role
    mapping(Role => address[]) private roleMembers;

    /// @notice Address that deployed the contract — can be used as emergency fallback
    address public superAdmin;

    /// @dev Initializes the contract by assigning the deployer the "Ministry" role
    constructor() {
        superAdmin = msg.sender;
        roles[msg.sender] = Role.Ministry;
        roleMembers[Role.Ministry].push(msg.sender);
    }

    /// @notice Modifier that allows access only to accounts with "Ministry" role
    modifier onlyMinistry() virtual {
        require(roles[msg.sender] == Role.Ministry, "Not authorized");
        _;
    }

    /// @notice Assigns a role to a user
    /// @param user Address of the user
    /// @param role Role to be assigned
    function setRole(address user, Role role) public onlyMinistry {
        Role oldRole = roles[user];
        roles[user] = role;

        // Remove user from previous role list
        address[] storage oldList = roleMembers[oldRole];
        for (uint i = 0; i < oldList.length; i++) {
            if (oldList[i] == user) {
                oldList[i] = oldList[oldList.length - 1];
                oldList.pop();
                break;
            }
        }

        // Add user to new role list if not already present
        if (role != Role.None) {
            address[] storage newList = roleMembers[role];
            bool exists = false;
            for (uint i = 0; i < newList.length; i++) {
                if (newList[i] == user) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                newList.push(user);
            }
        }
    }

    /// @notice Returns the assigned role of a given user
    /// @param user Address of the user
    /// @return Role enum value (uint8)
    function getRole(address user) public view virtual returns (Role) {
        return roles[user];
    }

    /// @notice Returns all users who have a specific role
    /// @param roleId Role enum index
    /// @return Array of addresses
    function getRoleMembers(uint8 roleId) public view returns (address[] memory) {
        require(roleId <= uint8(Role.KTEO), "Invalid role");
        return roleMembers[Role(roleId)];
    }

    /// @notice Checks if a user has a specific role (by name)
    /// @param user Address to check
    /// @param role Role as a string (e.g., "ministry")
    /// @return Boolean indicating whether the role matches
    function hasRole(address user, string memory role) public view returns (bool) {
        Role r = roles[user];

        if (keccak256(abi.encodePacked(role)) == keccak256("owner") && r == Role.Owner) return true;
        if (keccak256(abi.encodePacked(role)) == keccak256("service") && r == Role.Service) return true;
        if (keccak256(abi.encodePacked(role)) == keccak256("insurance") && r == Role.Insurance) return true;
        if (keccak256(abi.encodePacked(role)) == keccak256("ministry") && r == Role.Ministry) return true;
        if (keccak256(abi.encodePacked(role)) == keccak256("police") && r == Role.Police) return true;
        if (keccak256(abi.encodePacked(role)) == keccak256("scrapcenter") && r == Role.ScrapCenter) return true;
        if (keccak256(abi.encodePacked(role)) == keccak256("kteo") && r == Role.KTEO) return true;

        return false;
    }
}
