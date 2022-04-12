const { ethers } = require("hardhat");
const { expect } = require('chai');

describe('Testing NumberStorage', function () {
  it("Should store and retreive number", async () => {

    // Variables
    let deployer, user;
    const numberToStore = 42;
    
    // Deploying Contract
    [deployer, user] = await ethers.getSigners();
    const storage = await (await ethers.getContractFactory('NumberStorage', deployer)).deploy();
    console.log("NumberStorage deployed to:", await storage.address);

    // Storing variable
    console.log("Storing number...")
    const Txn = await storage.connect(user).storeNumber(numberToStore);
    await Txn.wait();
    console.log(`Stored number ${numberToStore}`);

    // Testing if variable was stored correctly
    expect(await storage.connect(user).retrieveNumber()).to.eq(42);
  });

});