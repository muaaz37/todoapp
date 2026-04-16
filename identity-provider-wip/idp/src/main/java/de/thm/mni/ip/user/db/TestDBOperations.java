package de.thm.mni.ip.user.db;

import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.EnvironmentVariableReader;
import io.vertx.core.Vertx;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.jdbcclient.JDBCConnectOptions;
import io.vertx.jdbcclient.JDBCPool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.Pool;

import java.util.UUID;

public class TestDBOperations {

    private static final String URL= EnvironmentVariableReader.get("DB_JDBC_STRING", "jdbc:postgresql://localhost:8999/idp");
    private static final String USERNAME= EnvironmentVariableReader.get("DB_USER", "username");
    private static final String PASSWORD= EnvironmentVariableReader.get("DB_PASSWORD", "password");



    public static void main(String[] args) {
        Vertx vertx = Vertx.vertx();
        Pool dbPool = createPool(vertx);

        var sqlUserDb = new UserSQLDB(dbPool);
        testGetAll(sqlUserDb);
        UUID userId = UUID.randomUUID();
        User user = new User(userId, "ali123@gmail.com", "test123", "ali", "ahmed");
        Future<UUID> id = testCreate(sqlUserDb,user);

    }

    private static Pool createPool(Vertx vertx) {
        var connectOptions = new JDBCConnectOptions()
                .setJdbcUrl(URL)
                .setUser(USERNAME)
                .setPassword(PASSWORD);

        var poolOptions = new PoolOptions().setMaxSize(5);

        return JDBCPool.pool(vertx, connectOptions, poolOptions);
    }

    private static Future<Void> testGetAll(UserSQLDB userDb) {
        System.out.println("testGetAll");
        return userDb.getAll()
                .map(list -> {
                    System.out.println("Benutzer gefunden: " + list.size()+" \n");
                    list.forEach(user -> System.out.println("  " + user.getEmail() + ": " + user.getFirstName() +" "+ user.getLastName()));
                    return null;
                });
    }

    private static Future<UUID> testCreate(UserSQLDB userDb, User user) {
        System.out.println("testCreate:");

        return userDb.create(user)
                .map(v -> {
                    System.out.println("Created: " + user.getEmail()+", "+user.getFirstName()+", "+user.getLastName()+" : "+user.getId());
                    return user.getId();
                });
    }

    private static Future<UUID> testUpdate(UserSQLDB userDb, User user) {
        System.out.println("testUpdate:");
        return userDb.update(user)
                .map(v -> {
                    System.out.println("Updated: " + user.getEmail()+", "+user.getFirstName()+", "+user.getLastName()+" : "+user.getId());
                    return user.getId();
                });
    }

    private static Future<Void> testDelete(UserSQLDB userDb, UUID id) {
        System.out.println("testDelete:");
        return userDb.delete(id)
                .map(v -> {
                    System.out.println("Deleted: " + id);
                    return null;
                });
    }
}
