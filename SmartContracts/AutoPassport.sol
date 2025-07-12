// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RBACAccessControl.sol";

/// @title AutoPassport
/// @notice Extends RBACAccessControl for ministry-based vehicle registry with document workflows
contract AutoPassport is RBACAccessControl {
    enum DocumentType {
        Service,
        KTEO,
        Insurance,
        Accident,
        OwnershipTransfer,
        RegistrationLicense,
        Retirement,
        Other
    }

    struct Vehicle {
        string vin;
        string make;
        string model;
        string year;
        string color;
        string fuelType;
        address registeredBy;
        uint256 registeredAt;
        bool exists;
    }

    struct Document {
        string date;
        string description;
        string ipfsHashPartA;
        string ipfsHashPartB;
        bytes32 combinedHash;
        DocumentType docType;
        address submittedBy;
        uint256 submittedAt;
        bool isActive;
    }

    mapping(string => Vehicle) public vehicles;
    mapping(string => Document[]) public vehicleDocuments;
    mapping(string => address) public vehicleOwner;

    event VehicleRegistered(string vin, address indexed registeredBy);
    event OwnershipTransferred(string vin, address indexed from, address indexed to);
    event DocumentAdded(string vin, uint index, DocumentType docType, address indexed submittedBy);
    event DocumentDeactivated(string vin, uint index, address indexed deactivatedBy);

    uint8 constant ROLE_OWNER = 1;
    uint8 constant ROLE_SERVICE = 2;
    uint8 constant ROLE_INSURANCE = 3;
    uint8 constant ROLE_MINISTRY = 4;
    uint8 constant ROLE_POLICE = 5;
    uint8 constant ROLE_SCRAPCENTER = 6;
    uint8 constant ROLE_KTEO = 7;

    modifier onlyCollaborator() {
        uint8 r = uint8(getRole(msg.sender));
        require(r >= 1 && r <= 7, "Not authorized collaborator");
        _;
    }

    modifier onlyAuthorizedForType(DocumentType docType) {
        uint8 role = uint8(getRole(msg.sender));
        if (docType == DocumentType.Service) require(role == ROLE_SERVICE, "Not authorized: Service");
        else if (docType == DocumentType.KTEO) require(role == ROLE_KTEO, "Not authorized: KTEO");
        else if (docType == DocumentType.Insurance) require(role == ROLE_INSURANCE, "Not authorized: Insurance");
        else if (docType == DocumentType.Accident) require(role == ROLE_POLICE, "Not authorized: Police");
        else if (docType == DocumentType.OwnershipTransfer) require(role == ROLE_MINISTRY, "Not authorized: Ministry");
        else if (docType == DocumentType.RegistrationLicense) require(role == ROLE_MINISTRY, "Not authorized: Ministry");
        else if (docType == DocumentType.Retirement) require(role == ROLE_SCRAPCENTER, "Not authorized: ScrapCenter");
        _;
    }

    function registerVehicle(
        string memory vin,
        string memory make,
        string memory model,
        string memory year,
        string memory color,
        string memory fuelType
    ) public onlyMinistry {
        require(!vehicles[vin].exists, "Vehicle already registered");

        vehicles[vin] = Vehicle({
            vin: vin,
            make: make,
            model: model,
            year: year,
            color: color,
            fuelType: fuelType,
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            exists: true
        });

        vehicleOwner[vin] = msg.sender;

        emit VehicleRegistered(vin, msg.sender);
    }

    function transferOwnership(string memory vin, address newOwner) public {
        require(vehicles[vin].exists, "Vehicle does not exist");
        address oldOwner = vehicleOwner[vin];
        require(msg.sender == oldOwner || getRole(msg.sender) == Role.Ministry, "Not authorized to transfer");

        vehicleOwner[vin] = newOwner;
        emit OwnershipTransferred(vin, oldOwner, newOwner);
    }

    function addDocument(
        string memory vin,
        string memory date,
        string memory description,
        string memory ipfsA,
        string memory ipfsB,
        bytes32 combinedHash,
        DocumentType docType
    ) public onlyCollaborator onlyAuthorizedForType(docType) {
        require(vehicles[vin].exists, "Vehicle does not exist");

        vehicleDocuments[vin].push(Document({
            date: date,
            description: description,
            ipfsHashPartA: ipfsA,
            ipfsHashPartB: ipfsB,
            combinedHash: combinedHash,
            docType: docType,
            submittedBy: msg.sender,
            submittedAt: block.timestamp,
            isActive: true
        }));

        emit DocumentAdded(vin, vehicleDocuments[vin].length - 1, docType, msg.sender);
    }

    function deactivateDocument(string memory vin, uint index) public {
        require(index < vehicleDocuments[vin].length, "Invalid index");
        Document storage doc = vehicleDocuments[vin][index];
        Role userRole = getRole(msg.sender);

        require(doc.submittedBy == msg.sender || userRole == Role.Ministry, "Not authorized to deactivate");
        require(doc.isActive, "Already deactivated");

        doc.isActive = false;
        emit DocumentDeactivated(vin, index, msg.sender);
    }

    function getDocuments(string memory vin) public view returns (Document[] memory) {
        return vehicleDocuments[vin];
    }

    function getVehicle(string memory vin) public view returns (Vehicle memory) {
        require(vehicles[vin].exists, "Vehicle does not exist");
        return vehicles[vin];
    }

    function getRole(address user) public view override returns (Role) {
        return super.getRole(user);
    }
}
