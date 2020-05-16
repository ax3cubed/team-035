pragma solidity ^0.6.7;

abstract contract Updateable {
    function run() public view virtual returns (bool);
    function update() public virtual;
}

abstract contract Upgradable {
    function run() public view virtual returns (bool);
    function upgrade() public virtual;
}

contract smeih is Updateable, Upgradable{
   event InvestmentSent( address Investor,uint uintamount);
   constructor() public {}
    struct BusinessData{
        address payable recipient;
        uint contributed;
        uint goal;
        uint deadline;
        bool validated;
        uint num_transactions;
        mapping(uint => Transaction) transactions;
    }

    struct Transaction {
        address payable investor;
        uint amount;
    }

    uint nextBusinessId;
    mapping(uint256 => BusinessData) businesses;

    function run()
        public
        view
        override(Updateable,Upgradable)
        returns (bool) {}

    // Start a new business.
    function start(address payable recipient, uint256 goal, uint256 deadline) public returns (uint id) {
        BusinessData storage business = businesses[nextBusinessId];
        require(
          business.validated == false, "the business is not validated"
          );

        business.recipient = recipient;
        business.goal = goal;
        business.deadline = deadline;
        nextBusinessId ++;
        id = nextBusinessId;
    }

    // Contribute to the business with id $(businessId).
    function invest(uint256 businessId) public payable {
       BusinessData storage business = businesses[businessId];
      require(
         now< business.deadline, "the deadline for funding has been reached "
          );
      require(
          business.validated == false, "the business is not validated"
          );
        business.contributed += msg.value;
        Transaction storage investment = business.transactions[business.num_transactions];
        investment.investor = msg.sender;
        investment.amount = msg.value;
        business.num_transactions++;
        emit InvestmentSent( msg.sender,msg.value);
    }

    // Check whether the funding goal of the business with id $(businessId)
    // has been reached and transfer the money.
    function checkGoalReached(uint256 businessId) public returns (bool reached)  {
        BusinessData storage business = businesses[businessId];
        if (business.deadline > 0 && business.contributed >= business.goal) {
            business.recipient.transfer(business.contributed);
            // clear storage, we have to do it explicitly for the mapping since
            // it is not possible to enumerate all set keys.
            for (uint i = 0; i < business.num_transactions; ++i)
                delete business.transactions[i]; // zero out its members
            reached = true;
        }
    }

    // Check whether the deadline of the business with id $(businessId) has
    // passed. In that case, return the contributed money and delete the
    // business.
    function checkExpired(uint businessId) public returns (bool expired) {
        expired = false;
         BusinessData storage business = businesses[businessId];
        if (business.deadline > 0 && block.timestamp > business.deadline) {
            // pay out the contributors
            for (uint i = 0; i < business.num_transactions; ++i) {
                business.transactions[i].investor.transfer(
                    business.transactions[i].amount);
                delete business.transactions[i];
            }
            expired = true;
        }
    }

    // Return the amount contributed to the business with id $(businessId) by
    // the sender of the transaction.
    function getContributedAmount(uint businessId) public view returns (uint amount) {
        amount = businesses[businessId].contributed;
    }

    function update() public override {}
    function upgrade() public override {}
}
