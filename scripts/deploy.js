async function main() {
    const LoanContract = await ethers.getContractFactory("LoanContract");
    const loanContract = await LoanContract.deploy();
    await loanContract.deployed();

    console.log("LoanContract deployed to:", loanContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
