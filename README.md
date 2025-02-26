The pages i have
 - Home 
 - Shop 
 - Not Found
 - Product
 - Cart
 - Saved List
 - Login
 - Register
 - email verification
 - Seller
    - seller registration
    - seller login
    


The pages I need


- phone verification
- forgot password
- google facebook login
- payment gateway

- User
    - contact
    - edit profile
    - edit address
    - see orders
    - see edit saved payment info 
    - add edit remove own review
    - order status and tracking
    - order info / invoice
    - cancellation and return

- Admin
    - add edit category
    - add edit product
    - add edit user
    - add edit seller
    - see sales
    - customer contact
    - grievance tickets
    - add edit remove review\
    
    - approve sellers?
    - admin login
    - order status

- Seller
    - add edit product
    - see sales
    - sell cash in
    - see respond review
    - order status
    - stock & inventory
    - cancellation and returns

Additional Features to add
    - notification mail and sms
    - Language
    - Chat
    - choice of delivery option
    - send a mail to customer on order and cancel and chat\
    - Keep count of category visits in local storage. show recomendations
    - keep last 10 search in local storage. Show recent searchs
    - Security Features TO Added
        - Input Sanitization
        - transaction Secure
        - helmet
        - morgan 
        - CSRF
        - 




Features Added

- used async thunk to handle async api calls
- added lazy loading for all pages (working??)
- added slug to make url seo friendly
- used .env in both backend and frontend.
- also added seperate config file for env varriables in vite
- used morgan logger middleware to log requests. Need to change it for production mode.
- Security Features Added
    - Authentication & Authorisation using JWT and HTTP Onlcy cookies
    - used express-rate-limit to handle bruteforce attcaks. used in login and register routes
    - Password Encryption 
    - used helmet middleware (to prevent xss, clickjacking, hide some info etc...)
    


