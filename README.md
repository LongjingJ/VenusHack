Transparent

Transparent is a platform designed for California community college students who want to transfer into tech-related majors at UC campuses. The platform helps students stay organized throughout the transfer process by providing transfer progress tracking, UC recommendations, networking opportunities, and transfer-related events and resources.

Tech Stack
- Frontend
  - HTML
  - CSS
  - JavaScript
Backend
  - Java
  - Jakarta Servlets
  - Apache Tomcat
Database
  - MySQL
Development Tools
  - IntelliJ IDEA
  - Maven
  - Git & GitHub

  Features
- User authentication system
- Personalized student profiles
- UC transfer recommendation dashboard
- Transfer readiness tracking
- Important transfer deadlines
- Networking page for students and mentors
- Events and workshop page
- Community-focused transfer support platform

Requirements

- Before running the project, make sure you have the following installed:

  - Java JDK 17+
  - Apache Tomcat
  - MySQL
  - IntelliJ IDEA
  - Maven
 
  Installation & Setup
1. Clone the Repository
git clone <your-repository-link>
cd Transparent

2. Set Up MySQL

- Create a database in MySQL:
  
    For each sql file:
  
    SOURCE <path of the file>

- Update your database credentials inside the backend configuration or servlet files:

    String loginUser = "your_username";
    String loginPasswd = "your_password";
    String loginUrl = "jdbc:mysql://localhost:3306/logindb";

3. Open Project in IntelliJ IDEA
   
  - Open IntelliJ IDEA

  - Select Open Project

  - Open the Transparent project folder

  - Make sure Maven dependencies are loaded


5. Configure Tomcat'
   
  - Install Apache Tomcat

  - In IntelliJ:

  - Go to Run → Edit Configurations

  - Add a new Tomcat Server

  - Select your Tomcat installation folder

  - Deploy the project artifact (war exploded)


6. Run the Project

  - Start the Tomcat server and open:

  - http://localhost:8080/



Future Improvements

  - Mobile responsive design

  - Real-time messaging system

  - AI-powered transfer recommendations

  - Better mentor matching

  - Email notifications for deadlines

  - Transfer roadmap generation
