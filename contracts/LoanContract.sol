// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanContract {
    struct Loan {
        uint amount;
        uint interestRate;
        uint dueDate;
        address lender;
        address borrower;
        bool repaid;
    }

    mapping(uint => Loan) public loans;
    uint public loanCount;

    event LoanCreated(uint loanId, address lender, address borrower, uint amount);
    event LoanRepaid(uint loanId, address borrower, uint amount);

    function requestLoan(uint amount, uint interestRate, uint durationInDays) external returns (uint) {
        loanCount++;
        loans[loanCount] = Loan({
            amount: amount,
            interestRate: interestRate,
            dueDate: block.timestamp + (durationInDays * 1 days),
            lender: address(0),
            borrower: msg.sender,
            repaid: false
        });

        return loanCount;
    }

    function fundLoan(uint loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.lender == address(0), "Loan already funded");
        require(loan.amount == msg.value, "Incorrect funding amount");

        loan.lender = msg.sender;
        emit LoanCreated(loanId, msg.sender, loan.borrower, loan.amount);
    }

    function repayLoan(uint loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Only borrower can repay");
        require(loan.lender != address(0), "Loan not funded");
        require(block.timestamp <= loan.dueDate, "Loan overdue");
        require(msg.value == loan.amount + (loan.amount * loan.interestRate / 100), "Incorrect repayment amount");

        loan.repaid = true;
        payable(loan.lender).transfer(msg.value);
        emit LoanRepaid(loanId, msg.sender, msg.value);
    }

    function getLoanDetails(uint loanId) external view returns (Loan memory) {
        return loans[loanId];
    }
}
