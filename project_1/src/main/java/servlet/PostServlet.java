package servlet;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/posts")
public class PostServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        String loginUser = System.getenv("DB_USER");
        String loginPassword = System.getenv("DB_PASSWORD");
        String loginUrl = System.getenv("DB_URL");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
        try {
            Connection conn = DriverManager.getConnection(loginUrl, loginUser, loginPassword);

            String query = "SELECT p.content, p.created_at, " +
                            "u.first_name, u.last_name, " +
                            "s.name AS school_name, " +
                            "m.name AS major_name " +
                            "FROM posts p " +
                            "JOIN users u ON p.user_id = u.id " +
                            "LEFT JOIN schools s ON u.school_id = s.id " +
                            "LEFT JOIN majors m ON u.major_id = m.id " +
                            "ORDER BY p.created_at DESC";

            PreparedStatement statement = conn.prepareStatement(query);

            ResultSet rs = statement.executeQuery();

            JsonArray posts = new JsonArray();

            while (rs.next()) {

                JsonObject post = new JsonObject();

                post.addProperty("firstName", rs.getString("first_name"));
                post.addProperty("lastName", rs.getString("last_name"));
                post.addProperty("school", rs.getString("school_name"));
                post.addProperty("major", rs.getString("major_name"));
                post.addProperty("content", rs.getString("content"));
                post.addProperty("createdAt", rs.getString("created_at"));

                posts.add(post);
            }

            response.getWriter().write(posts.toString());

            rs.close();
            statement.close();
            conn.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}