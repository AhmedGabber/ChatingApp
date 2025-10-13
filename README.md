# 💬 ChattingApp

This is a real-time chat application built with **.NET 8 (Web API)** and **Angular 20**.  
The project supports live messaging using **SignalR**, and it uses **SQL Server** for data storage.  
The architecture follows **Clean Architecture principles**, with clear separation between the backend API and the frontend client.

---


- **Backend (API)** → Built with ASP.NET Core 8, Entity Framework Core, and SQL Server.  
- **Frontend (client)** → Built with Angular 20, Tailwind CSS, and SignalR for real-time updates.  

---

## Requirements
Before running the project, make sure you have the following installed:


### 1️⃣ .NET 8 SDK
The backend API is built with **.NET 8**.

- Download from the official Microsoft page:  
  👉 [Download .NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- After installation, verify:
  ```bash
  dotnet --version
  ```
  Should display a version starting with 8.0





### 2️⃣ SQL Server (LocalDB)

The API uses Microsoft SQL Server for its database.

Install one of the following:
SQL Server LocalDB →https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver17

After installation, verify LocalDB by running:

```bash
sqllocaldb info
```
You should see an instance like MSSQLLocalDB.





---


The default connection string in API/appsettings.Development.json points to LocalDB:

"ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ChatingApp;Trusted_Connection=True;TrustServerCertificate=True;"
  }


---





### 3️⃣ Node.js & Angular CLI

The frontend client requires Node.js and Angular CLI.

Install Node.js (includes npm):
👉 Download Node.js: https://nodejs.org/en/download

Then install Angular CLI globally:
```bash
npm install -g @angular/cli
```



---------------------------------------------------------------


To run the project 
Step 1: Clone the Repository 
```Terminal
git clone https://github.com/AhmedGabber/ChatingApp.git
cd ChatingApp
```

Step 2: Setup the Backend (.NET API)
```Terminal (Run each line separately in the terminal)
cd API
dotnet restore
dotnet ef database update
dotnet run
```


Step 3: Setup the Frontend (Angular) 
```Terminal (Run each line separately in the terminal)
cd ../client
npm install
ng serve
```

Step 4: Open (http://localhost:4200) on any browser


If you encounter any issues running the project, you can check this Google Drive folder for videos demonstrating the app’s functionality: (https://drive.google.com/drive/folders/1w1V8SL3pmP9-rlnf8WyGRDiQ1rXUVN7c?usp=sharing)

