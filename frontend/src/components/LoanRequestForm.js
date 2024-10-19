// src/components/LoanRequestForm.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoanContractABI from '../artifacts/LoanContract.json';

const LoanRequestForm = () => {
  const [amount, setAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [duration, setDuration] = useState(0);

  const requestLoan = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const loanContract = new ethers.Contract(
        "Your_Contract_Address_Here",
        LoanContractABI.abi,
        signer
      );

      const transaction = await loanContract.requestLoan(
        ethers.utils.parseUnits(amount.toString(), "ether"),
        interestRate,
        duration
      );
      await transaction.wait();
      alert('Loan requested successfully');
    }
  };

  return (
    <div>
      <h2>Request a Loan</h2>
      <input
        type="number"
        placeholder="Loan Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (in days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={requestLoan}>Request Loan</button>
    </div>
  );
};

export default LoanRequestForm;
