const { expect } = require("chai");

describe("LoanContract", function () {
    let loanContract, owner, borrower, lender;

    beforeEach(async function () {
        const LoanContract = await ethers.getContractFactory("LoanContract");
        loanContract = await LoanContract.deploy();
        [owner, borrower, lender] = await ethers.getSigners();
    });

    it("should allow loan request", async function () {
        await loanContract.connect(borrower).requestLoan(1000, 5, 7);
        const loan = await loanContract.loans(1);
        expect(loan.amount).to.equal(1000);
        expect(loan.interestRate).to.equal(5);
        expect(loan.borrower).to.equal(borrower.address);
    });

    it("should allow loan funding", async function () {
        await loanContract.connect(borrower).requestLoan(1000, 5, 7);
        await loanContract.connect(lender).fundLoan(1, { value: 1000 });
        const loan = await loanContract.loans(1);
        expect(loan.lender).to.equal(lender.address);
    });

    it("should allow loan repayment", async function () {
        await loanContract.connect(borrower).requestLoan(1000, 5, 7);
        await loanContract.connect(lender).fundLoan(1, { value: 1000 });
        await loanContract.connect(borrower).repayLoan(1, { value: 1050 });
        const loan = await loanContract.loans(1);
        expect(loan.repaid).to.equal(true);
    });
});
