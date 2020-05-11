pragma solidity ^0.4.18;

contract smeih {
    struct BusinessData{
        address recipient;
        uint contributed;
        uint goal;
        uint deadline;
        bool validated;
        uint num_transactions;
        mapping(uint => Transaction) transactions;
    }

    struct Transaction {
        address investor;
        uint amount;
    }

    uint nextBusinessId;
    mapping(uint256 => BusinessData) businesses;

    // Start a new business.
    function start(address recipient, uint256 goal, uint256 deadline) returns (uint id) {
        var business = businesses[nextCampaignId];
        business.recipient = recipient;
        business.goal = goal;
        business.deadline = deadline;
        nextCampaignId ++;
        id = nextCampaignId;
    }

    // Contribute to the business with id $(businessId).
    function invest(uint256 businessId) {
        var business = businesses[businessId];
        if (business.deadline == 0) // check for non-existing business
            return;
        business.contributed += msg.value;
        var investment = business.transactions[business.num_transactions];
        investment.investor = msg.sender;
        investment.amount = msg.value;
        business.num_transactions++;
    }

    // Check whether the funding goal of the business with id $(businessId)
    // has been reached and transfer the money.
    function checkGoalReached(uint256 businessId) returns (bool reached) {
        var business = businesses[businessId];
        if (business.deadline > 0 && business.contributed >= business.goal) {
            business.recipient.send(business.contributed);
            // clear storage, we have to do it explicitly for the mapping since
            // it is not possible to enumerate all set keys.
            for (uint i = 0; i < business.num_transactions; ++i)
                delete business.transactions[i]; // zero out its members
            delete business;
            reached = true;
        }
    }

    // Check whether the deadline of the business with id $(businessId) has
    // passed. In that case, return the contributed money and delete the
    // business.
    function checkExpired(uint businessId) returns (bool expired) {
        expired = false;
        var business = businesses[businessId];
        if (business.deadline > 0 && block.timestamp > business.deadline) {
            // pay out the contributors
            for (uint i = 0; i < business.num_transactions; ++i) {
                business.transactions[i].investor.send(
                    business.transactions[i].amount);
                delete business.transactions[i];
            }
            delete business;
            expired = true;
        }
    }

    // Return the amount contributed to the business with id $(businessId) by
    // the sender of the transaction.
    function getContributedAmount(uint businessId) returns (uint amount) {
        amount = businesses[businessId].contributed;
    }
}
