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
import java.sql.ResultSet;

@WebServlet("/connect")
public class ConnectServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException{

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        String email = (String) session.getAttribute("user");
        int receiverId = Integer.parseInt(request.getParameter("receiver_id"));

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

            String getUserIdQuery = "SELECT id FROM users WHERE email = ?";
            PreparedStatement userStmt = conn.prepareStatement(getUserIdQuery);
            userStmt.setString(1, email);

            ResultSet rs = userStmt.executeQuery();
            if (!rs.next()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            int requesterId = rs.getInt("id");

            String insertQuery = "INSERT INTO connections " +
                            "(requester_id, receiver_id, status) " +
                            "VALUES (?, ?, 'pending')";

            PreparedStatement insertStmt = conn.prepareStatement(insertQuery);
            insertStmt.setInt(1, requesterId);
            insertStmt.setInt(2, receiverId);

            insertStmt.executeUpdate();

            response.getWriter().write("success");

            insertStmt.close();
            rs.close();
            userStmt.close();
            conn.close();

        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
