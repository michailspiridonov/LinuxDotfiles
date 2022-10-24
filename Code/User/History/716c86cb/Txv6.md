# Api tests in cypress for skills
This tests basic functionality of the endpoints, requests with different parameters and validations and more complex scenarios in the future.
## Installation
Clone the repository and run:
```
npm install
```
## Running tests
**To open cypress GUI**
```
npm run open
```
**To run tests from CLI**
```
npm run run
```
## Test scenarios
### 1. Get all skill categories
This test will get all skill categories.
### 2. Get all skills
This test will get all skills.
### 3. User skills
##### 1. Get all user skills
This test will get all user skills (by a defined user id).
##### 2. Post user skill
This test will delete all user skills (by a defined user id), create a new user skill and check that it was created correctly.
##### 3. Delete user skill
This test will delete all user skills (by a defined user id), create a new one and then delete it.
##### 4. Update user skill
This test will delete all user skills (by a defined user id), create a new one and then update it.
### 4. Get User
This test will get a user (by a defined username).
### 5. Get all users
This test will get all users.