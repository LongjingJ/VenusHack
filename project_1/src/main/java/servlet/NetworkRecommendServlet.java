package servlet;

import com.google.gson.JsonArray;
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


@WebServlet("/network")
public class NetworkRecommendServlet extends HttpServlet {
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

        try{
            Connection conn = DriverManager.getConnection(loginUrl, loginUser, loginPassword);

            String currentUserQuery = "SELECT  id, major_id, school_id, interested_school_id FROM users WHERE email = ?;";
            PreparedStatement currentStatement = conn.prepareStatement(currentUserQuery);
            currentStatement.setString(1, email);
            ResultSet currentRs = currentStatement.executeQuery();

            if(!currentRs.next()){
                response.sendRedirect("Login.html");
                return;
            }

            int currentUserId = currentRs.getInt("id");
            int majorId = currentRs.getInt("major_id");
            int schoolId = currentRs.getInt("school_id");
            int interestedSchoolId = currentRs.getInt("interested_school_id");

            String recommendQuery = "SELECT u.id, u.first_name, u.last_name, " +
                    "s.name AS school_name, " +
                    "m.name AS major_name " +
                    "FROM users u " +
                    "LEFT JOIN schools s ON u.school_id = s.id " +
                    "LEFT JOIN majors m ON u.major_id = m.id " +
                    "WHERE u.id != ? " +
                    "AND (u.major_id = ? " +
                    "OR u.school_id = ? " +
                    "OR u.interested_school_id = ?) " +
                    "LIMIT 3";

            PreparedStatement recommendStmt = conn.prepareStatement(recommendQuery);

            recommendStmt.setInt(1, currentUserId);
            recommendStmt.setInt(2, majorId);
            recommendStmt.setInt(3, schoolId);
            recommendStmt.setInt(4, interestedSchoolId);

            ResultSet recommendRs = recommendStmt.executeQuery();

            JsonArray recommendations = new JsonArray();

            while (recommendRs.next()) {

                JsonObject user = new JsonObject();

                user.addProperty("id", recommendRs.getInt("id"));
                user.addProperty("firstName", recommendRs.getString("first_name"));
                user.addProperty("lastName", recommendRs.getString("last_name"));
                user.addProperty("school", recommendRs.getString("school_name"));
                user.addProperty("major", recommendRs.getString("major_name"));
                recommendations.add(user);
            }

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(recommendations.toString());
            recommendRs.close();
            recommendStmt.close();
            currentRs.close();
            currentStatement.close();
            conn.close();


        }catch (Exception e) {
            throw new RuntimeException(e);
        }


    }



}
