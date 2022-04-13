const {ethers} = require("hardhat");

const main = async () => {
    const [deployer] = await ethers.getSigners() ;
 
    console.log("Deploying contract with account: ", deployer.address);

    const BallotContractFactory = await ethers.getContractFactory("Ballot");
    const ballot = await BallotContractFactory.deploy([
        // Bob
        "0x426f620000000000000000000000000000000000000000000000000000000000",
        // Alice
        "0x416c696365000000000000000000000000000000000000000000000000000000"
      ]);
    await ballot.deployed();

    console.log("Ballot address: ", ballot.address);
};

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })

// Ballot address: 0x579d1c5B9802da715D79a95e10cBef078cCd19AF (rinkeby)