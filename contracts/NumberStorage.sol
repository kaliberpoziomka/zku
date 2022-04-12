// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// @author kaliberpoziomka
/// @title Number Storage
/// @dev Stores and retrieves a number
contract NumberStorage {

    uint256 number;

    /// @notice Enter the number to store
    /// @dev Stores the value in the state variable `number`
    /// @param _number The number to store
    function storeNumber(uint256 _number) external {
        number = _number;
    }

    /// @notice Retreive number stored
    /// @dev Retrieves the value of the state variable `number`
    /// @return uint stored value of the state variable `number`
    function retrieveNumber() external view returns (uint256) {
        return number;
    }
}