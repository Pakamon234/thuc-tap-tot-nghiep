package QLDV.userService.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    private PasswordUtil() {
        // Prevent instantiation
    }
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Băm mật khẩu
    public static String hashPassword(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã băm
    public static boolean matches(String rawPassword, String hashedPassword) {
        return encoder.matches(rawPassword, hashedPassword);
    }
}