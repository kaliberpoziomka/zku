// run with: $ npm run ballot

const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Testing of Ballot Contract", async () => {

    beforeEach(async () => {
        // Candidates names
        this.namesToVote = ["Bob", "Alice"];
        for (let i=0; i < this.namesToVote.length; i++) {
            this.namesToVote[i] = `${ethers.utils.formatBytes32String(this.namesToVote[i])}`
        }
        // Signer and voters
        [deployer, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
        this.voters = [addr1, addr2, addr3, addr4, addr5];

        // Deploying contract
        const Ballot = await ethers.getContractFactory("Ballot", deployer);
        this.ballot = await Ballot.deploy(this.namesToVote);

        // Granting each voter right to vote
        for (let i = 0; i < this.voters.length; i++) {
            await (await this.ballot.giveRightToVote(this.voters[i].address)).wait();
        }
    });

    it("[BASE CASE]: Should be possible to vote and find winner", async () => {
        // Voting for Bob
        await (await this.ballot.connect(this.voters[0]).vote(0)).wait();
        await (await this.ballot.connect(this.voters[1]).vote(0)).wait();
        
        // Voting for Alice
        await (await this.ballot.connect(this.voters[2]).vote(1)).wait();

        // Find winner
        await expect(
            await this.ballot.winnerName()
        ).to.eq(this.namesToVote[0]);
    });

    it("[TEST]: Should not be possible to vote second time by the same voter", async () => {
        // Voting for Bob
        await (await this.ballot.connect(this.voters[0]).vote(0)).wait();
        await (await this.ballot.connect(this.voters[1]).vote(0)).wait();
        
        // Voting for Alice
        await (await this.ballot.connect(this.voters[2]).vote(1)).wait();

        // Check if it is possible to vote second time
        await expect(
            // REMEMBER TO NOT USE AWAIT INSIDE EXPECT IF TESTING FOR FAILUE - IT WOULDN'T WORK
            this.ballot.connect(this.voters[2]).vote(1)
        ).be.revertedWith('Already voted.');

    });

    it("[TEST]: Should not be possible to vote after 5 minutes from creation of ballot", async () => {
        // Voting for Bob
        await (await this.ballot.connect(this.voters[0]).vote(0)).wait();
        await (await this.ballot.connect(this.voters[1]).vote(0)).wait();
        
        // Voting for Alice
        await (await this.ballot.connect(this.voters[2]).vote(1)).wait();

        // Move in time by 6 minutes
        await ethers.provider.send("evm_increaseTime", [6 * 60]);

        // Check if it is poddible to vote after time passed
        await expect(
            this.ballot.connect(this.voters[3]).vote(1)
        ).to.be.revertedWith('Time passed!');
    });

    it("[EXPLOIT]: Should be possible to vote by delegation after 5 minutes from creation of ballot", async () => {
        // This is actually exploiting vulnerability of proposed solution in Background Assignment.
        // Because we use modifier only for vote() method, we can still vote using delegation() after the time passed

        // Voting for Bob
        await (await this.ballot.connect(this.voters[0]).vote(0)).wait();
        await (await this.ballot.connect(this.voters[1]).vote(0)).wait();
        
        // Voting for Alice
        await (await this.ballot.connect(this.voters[2]).vote(1)).wait();

        // Move in time by 6 minutes
        await ethers.provider.send("evm_increaseTime", [6 * 60]);

        // EXPLOIT

        // Delegation votes to third voter, which voted for Allice
        await (await this.ballot.connect(this.voters[3]).delegate(this.voters[2].address)).wait();
        await (await this.ballot.connect(this.voters[4]).delegate(this.voters[2].address)).wait();

        // Check if Alice is winner, not Bob
        await expect(
            await this.ballot.winnerName()
        ).to.eq(this.namesToVote[1]);
    });
});