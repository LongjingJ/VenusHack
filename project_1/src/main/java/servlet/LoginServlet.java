package servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.jasypt.util.password.StrongPasswordEncryptor;

import java.io.IOException;
import java.sql.*;

@WebServlet("/Login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        String loginUser = System.getenv("DB_USER");
        String loginPassword = System.getenv("DB_PASSWORD");
        String loginUrl = System.getenv("DB_URL");

        try{
            Class.forName("com.mysql.jdbc.Driver");
        } catch(ClassNotFoundException e){
            throw new RuntimeException(e);
        }

        try{
            Connection conn = DriverManager.getConnection(loginUrl, loginUser, loginPassword);

            String query = "SELECT password FROM users WHERE email = ?";
            PreparedStatement statement = conn.prepareStatement(query);
            statement.setString(1, email);

            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                String encryptedPassword = rs.getString("password");
                StrongPasswordEncryptor encryptor = new StrongPasswordEncryptor();
                boolean passwordMatch = encryptor.checkPassword(password, encryptedPassword);

                if(passwordMatch){
                    HttpSession session = request.getSession();
                    session.setAttribute("user", email);
                    response.sendRedirect("MainPage.html");
                }else{
                    response.sendRedirect(request.getContextPath() + "/Login.html?error=true");
                }
            }
            else {
                response.sendRedirect(request.getContextPath() + "/Login.html?error=true");
            }

            rs.close();
            statement.close();
            conn.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }



    }

}
