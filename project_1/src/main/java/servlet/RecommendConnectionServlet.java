package servlet;

import com.google.gson.Gson;
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
import java.util.ArrayList;
import java.util.HashMap;

@WebServlet("/network")
public class RecommendConnectionServlet extends HttpServlet {
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

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
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

            String recommendQuery = "SELECT u.first_name, u.last_name, " +
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

            ArrayList<HashMap<String, String>> recommendations = new ArrayList<>();

            while (recommendRs.next()){
                HashMap<String, String> user = new HashMap<>();
                user.put("firstName", recommendRs.getString("first_name"));
                user.put("lastName", recommendRs.getString("last_name"));
                user.put("school", recommendRs.getString("school_name"));
                user.put("major", recommendRs.getString("major_name"));

                recommendations.add(user);
            }

            Gson gson = new Gson();
            response.getWriter().write(gson.toJson(recommendations));

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
