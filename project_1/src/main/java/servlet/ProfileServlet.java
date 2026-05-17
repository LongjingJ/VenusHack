package servlet;

import com.google.gson.JsonObject;
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
import java.sql.ResultSet;

@WebServlet("/profile")
public class ProfileServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("Login.html");
            return;
        }

        String email = (String) session.getAttribute("user");

        String loginUser = System.getenv("DB_USER");
        String loginPassword = System.getenv("DB_PASSWORD");
        String loginUrl = System.getenv("DB_URL");

        try{
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        try {
            Connection conn = DriverManager.getConnection(loginUrl, loginUser, loginPassword);

            String query = "SELECT u.first_name, u.last_name, " +
                    "s.name AS school_name, " +
                    "m.name AS major_name, " +
                    "i.name AS interested_school_name " +
                    "FROM users u " +
                    "LEFT JOIN schools s ON u.school_id = s.id " +
                    "LEFT JOIN majors m ON u.major_id = m.id " +
                    "LEFT JOIN schools i ON u.interested_school_id = i.id " +
                    "WHERE u.email = ?";

            PreparedStatement statement = conn.prepareStatement(query);

            statement.setString(1, email);
            ResultSet rs = statement.executeQuery();

            if (!rs.next()) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            JsonObject profile = new JsonObject();

            profile.addProperty("firstName", rs.getString("first_name"));
            profile.addProperty("lastName", rs.getString("last_name"));
            profile.addProperty("school", rs.getString("school_name"));
            profile.addProperty("major", rs.getString("major_name"));
            profile.addProperty("interestedSchool", rs.getString("interested_school_name"));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(profile.toString());
            rs.close();
            statement.close();
            conn.close();

        }catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
