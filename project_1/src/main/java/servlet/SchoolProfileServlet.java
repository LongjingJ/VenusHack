package servlet;

import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.*;

@WebServlet("/school-profile")
public class SchoolProfileServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        String schoolIdParam = request.getParameter("id");

        if (schoolIdParam == null || schoolIdParam.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int schoolId = Integer.parseInt(schoolIdParam);

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

            String query = "SELECT id, name, type FROM schools WHERE id = ?";

            PreparedStatement statement = conn.prepareStatement(query);
            statement.setInt(1, schoolId);

            ResultSet rs = statement.executeQuery();

            if (!rs.next()) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            JsonObject school = new JsonObject();

            school.addProperty("id", rs.getInt("id"));
            school.addProperty("name", rs.getString("name"));
            school.addProperty("type", rs.getString("type"));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(school.toString());

            rs.close();
            statement.close();
            conn.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
