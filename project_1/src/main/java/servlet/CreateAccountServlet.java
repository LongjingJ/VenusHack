package servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@WebServlet("/CreateAccount")
public class CreateAccountServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String firstName = request.getParameter("first_name");
        String lastName = request.getParameter("last_name");

        String role = request.getParameter("role");
        int schoolId = Integer.parseInt(request.getParameter("school_id"));
        int majorId = Integer.parseInt(request.getParameter("major_id"));
        int interestedSchoolId = Integer.parseInt(request.getParameter("interested_school_id"));

        String loginUser = System.getenv("DB_USER");
        String loginPassword = System.getenv("DB_PASSWORD");
        String loginUrl = System.getenv("DB_URL");

        try {
            Class.forName("com.mysql.jdbc.Driver");

            Connection conn = DriverManager.getConnection(loginUrl, loginUser, loginPassword);

            String query = "INSERT INTO users(first_name, last_name, email, password, role, school_id, major_id, interested_school_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement statement = conn.prepareStatement(query);

            statement.setString(1, firstName);
            statement.setString(2, lastName);
            statement.setString(3, email);
            statement.setString(4, password);
            statement.setString(5, role);
            statement.setInt(6, schoolId);
            statement.setInt(7, majorId);
            statement.setInt(8, interestedSchoolId);

            statement.executeUpdate();

            statement.close();
            conn.close();

            HttpSession session = request.getSession();
            session.setAttribute("user", email);

            response.sendRedirect("MainPage.html");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
