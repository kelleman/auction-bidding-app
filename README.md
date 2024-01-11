# auction-bidding-app

- To run this application, navigate int src folder:
 -npm install: to install all dependencies
 - npm start: to start the server

Local Base url: http://localhost:5000/api/v1
Remote Base url: 

 - APPLICATION ENDPOINTS

Authentication Endpoints

-Register
Endpoint: POST /register
Description: Register a new user.

Example:
url: http:localhost:5000/api/v1/register
{
  "name": "Jone Doe"
  "email": "johndoe@gmail.com",
  "password": "securepassword"
}

-Login
Endpoint: POST /login
Description: Log in an existing user.

Example:
url:http://localhost:5000/api/v1/login
{
  "email": "johndoe@gmail.com",
  "password": "securepassword"
}


-Room Endpoints

Create a Room
Endpoint: POST /create-room
Description: Create a new auction room for the rest of users to join

Example:
url:http://localhost:5000/api/v1/create-room
{
    "roomName": "Johns's Auction Room",
    "maxParticipants": "20"
}

 Get room details
Endpoint: GET /room-details/:roomId
Description: Get details of a specific room.

Example:
url: http://localhost:5000/api/v1/room-details/659bf87634aba32b9f1ac


Join a Room
Endpoint: POST /join-room
Description: Join an existing room.
Example:
url: http://localhost:5000/api/v1/join-room
{
  "roomId": "659bf87634aba32b9f1ac"
  "userId": "64486566566566475"
}

- Bidding Endpoints

Start Bidding Process
Endpoint: POST /start-bidding-process
Description: Initiate a new bidding process so thers can join the bidding.
Example:
url: http://localhost:5000/api/v1/start-bidding-process
{
    "roomId": "659bf87634aba32b9f1ac",
    "initiator": "659b3edb464984cd4af16",
    "productDescription": "Office AC ",
    "hours": "5"
}

Submit Bid

Endpoint: POST /submit-bid
Description: Submit a bid for an ongoing bidding process.

Example:
url:http://localhost:5000/api/v1/submit-bid
{
    "biddingProcessId": "659c2e49f6302d3eaa0de",
    "userId": "659b3edb464984cd4af16",
    "bidAmount": 1000
}

Update Bid
Endpoint: PUT /update-bid
Description: Update a previously submitted bid.

Example:
url:http://localhost:5000/api/v1/update-bid
{
    "biddingProcessId": "659c2e49f6302d3eaa0de",
    "userId": "659b3edb464984cd4af1648c",
    "newBidAmount": 70000
}

Close Bidding Process
Endpoint: POST /close-bidding
Description: Close an ongoing bidding process.

Example:
url:http://localhost:5000/api/v1/close-bidding
{
    "biddingProcessId": "659c2e49f6302d3eaa0de"
}


- Invoice
Generate Invoice
Description: the invoice generated automatically after the process is closed and sent to the highest bidder, also it saved into the database.


- Initiate Payment
Endpoint: POST /initiate-payment
Description: Initiate the payment process for a generated invoice.
Request Body:
Include the invoiceId or other relevant details.
Example:
url: http://localhost:5000/api/v1/initiate-payment
    {
    "userId": "659b3edb464984cd4af164",
    "biddingProcessId": "659c2e49f6302d3eaa0de"
    }

- Verify Payment
Endpoint: GET /verify/:reference
Description: Verify the status of a payment.
Request Parameters:
reference (string): Payment reference.
Example:
http://localhost:5000/verify/abcdef123456


USING THE API

Registration and Authentication:
- Register a new user using the /register endpoint.
- Log in with the registered user using the /login endpoint.

Room Interaction:
- Create a room using the /create-room endpoint.
- Join the created room or another existing room using the /join-room endpoint.
- Get details of a room using the /room-details/:roomId endpoint.

Bidding Process:
- Initiate a new bidding process using the /start-bidding-process endpoint.
- Submit bids using the /submit-bid endpoint.
- Update a bid using the /update-bid endpoint
- Close an ongoing bidding process using the endpoint /close-bidding

Payment Process:
- Initiate a payment process using the endpoint /initiate-payment
- Verify a payment using the endpoint /verify/:reference


Incomplete Modules
Because of time factor,the following modules were not completed:

- Routes protection using jwt was not completed
-payment initialization