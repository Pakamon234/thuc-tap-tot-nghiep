package QLDV.userService.util;
import QLDV.userService.util.PasswordUtil;

public class HashTest {
    public static void main(String[] args) {
        String hash = PasswordUtil.hashPassword("123456");
        System.out.println(hash);
    }
}