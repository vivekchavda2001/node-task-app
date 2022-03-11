### Task API Developed In Express.
**Features**
1.Internationalization.
2.Swagger Documentation.
3.JSON Web Token Authentication.
4.Multer Used For Uploading Profile Pictures.
5.Send Grid Email Library Used For Sending Welcome, and Good Bye Emails.

------------



**Base URL**
https://localhost:8081

------------




### Endpoints
#### ***1.User Endpoints***
##### A. /user 
[POST Request]
It will Signup New User with Name,Email and Password.
It will Also genrate Authentication Token To Authorise.

##### B.  /user/me 
[GET Request]
It will return Details of Logged In user.

#####  C. /user/me/avatar
[POST Request]
It will let us upload a profile pic file.

##### D /user/me/avatar
[DELETE Request]
It will Delete profile pic file.


##### E. /user /login
[POST Request]
It will login User with Email and Password.
It will Also genrate Authentication Token To Authorise.

##### F. /user /logout
[POST Request]
It will logout User.

##### F. /user /logoutall
[POST Request]
It will logout User From All The Devices.

##### G. /user /me
[PATCH Request]
It will update logged in user details.
Allowed Updates are Name,Email,Password and Age.

##### H. /user /me
[DELETE Request]
It will delete user profile.


------------




#### ***1.Task Endpoints***
##### A. /task 
[POST Request]
It will add new task with  Description and status weather it is completed or Not	

##### B. /task 
[GET Request]
It will List all the task of Logged in User.	

##### C. /task/:id
[GET Request]
It will return specific task, associated with task ID.	

##### D. /task/:id
[PATCH Request]
It will update specific task, associated with task ID.	

##### D. /task/:id
[DELETE Request]
It will delete specific task, associated with task ID.	

------------

