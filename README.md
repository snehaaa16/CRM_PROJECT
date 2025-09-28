CRM Lite - Front-end Prototype
Yeh project ek lightweight Customer Relationship Management (CRM) application ka complete front-end prototype hai. Ismein user authentication se lekar role-based dashboard tak ki saari core front-end functionalities shamil hain. Yeh project ab backend integration ke liye bilkul taiyaar hai.

Core Features (Ab Tak Kya Banaya Hai)
1. Thematic UI/UX
Modern Dark Theme: Poori application mein ek consistent, professional dark theme (linear-gradient) ka istemal kiya gaya hai jo reference images se inspired hai.

Responsive Design: Saare components (Cards, Forms, Grids) responsive hain aur alag-alag screen sizes par aache se kaam karte hain.

2. Secure Login Flow (Simulated)
Secure Login Page (login-secure.html):

User se sirf Email aur Password maanga jaata hai. Role select karne ka koi unsafe option nahi hai.

Login credentials ko check karne ke liye JavaScript mein ek dummy database (users array) banaya gaya hai.

Galat details daalne par user ko ek error message dikhta hai.

Role-Based Redirection:

Successful login ke baad, system user ka role database se automatically pata karta hai.

User ko dashboard page (dashboard-dynamic.html) par redirect kiya jaata hai aur user ka role URL mein securely pass hota hai (e.g., ?role=client).

3. Dynamic Role-Based Dashboard (dashboard.html)
Yeh is application ka "dimag" hai. Dashboard user ke role ke hisaab se apne aap badal jaata hai.

Admin / Manager View:

Inhe poora access milta hai.

Saare statistics cards (Total Customers, Active Leads, etc.) dikhte hain.

+ New Lead button dikhta hai jisse woh naya data add kar sakte hain.

Client View:

Inhe ek limited aur clean view milta hai.

Sirf unke kaam ke cards (Ongoing Projects, Pending Tasks) dikhte hain.

+ New Lead button aur extra statistics cards hide ho jaate hain.

4. "Add New Lead" Functionality (UI/UX)
Pop-up Modal Form: Admin/Manager jab + New Lead par click karte hain, toh ek pop-up form (modal) khulta hai.

Data Collection: Jab user form bharkar "Save Lead" par click karta hai, toh:

JavaScript form ke saare data (Name, Email, Phone, Status) ko collect karke ek JavaScript object mein package karta hai.

Yeh data package Browser Console mein print hota hai. Isse yeh confirm hota hai ki front-end data aache se collect kar raha hai aur backend ko bhejne ke liye taiyaar hai.

Project Structure
login-secure.html: Application ka secure entry point.

dashboard-dynamic.html: Application ka main workspace jo user ke role ke hisaab se badalta hai.

Isko Kaise Test Karein
login-secure.html file ko browser mein kholein.

Admin View Test Karne Ke Liye:

Email: admin@crm.com

Password: adminpassword

Client View Test Karne Ke Liye:

Email: client@crm.com

Password: clientpassword

"Add New Lead" Form Test Karne Ke Liye:

Admin ke roop mein login karein.

Browser mein F12 dabaakar Developer Tools kholein aur Console tab par jaayein.

+ New Lead par click karein, form bharein, aur "Save Lead" par click karein.

Aapko form ka saara data console mein ek object ke roop mein dikhega.

Next Steps
Front-end ka kaam poori tarah se complete ho chuka hai. Ab agla step Backend Development shuru karna hai, jismein in functionalities ke liye real APIs aur database banaye jayenge.