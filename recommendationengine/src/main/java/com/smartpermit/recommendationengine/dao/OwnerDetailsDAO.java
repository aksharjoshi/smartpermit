package com.smartpermit.recommendationengine.dao;

import com.smartpermit.recommendationengine.model.OwnerDetails;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by adwaitkaley on 11/10/16.
 */
public class OwnerDetailsDAO {
    private static final String DB_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_CONNECTION = "jdbc:mysql://ec2-52-53-148-138.us-west-1.compute.amazonaws.com:3306/smart_permit";
    private static final String DB_USER = "remoteu";
    private static final String DB_PASSWORD = "SmartPermit";

    private static Connection getDBConnection() {

        Connection dbConnection = null;

        try {

            Class.forName(DB_DRIVER);

        } catch (ClassNotFoundException e) {

            System.out.println(e.getMessage());

        }

        try {

            dbConnection = DriverManager.getConnection(
                    DB_CONNECTION, DB_USER,DB_PASSWORD);
            return dbConnection;

        } catch (SQLException e) {

            System.out.println(e.getMessage());

        }

        return dbConnection;

    }


    public void insertOwnerDetails(OwnerDetails ownerDetails){
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;

        String insertSQL = "INSERT INTO `OWNER_MASTER`" +
                "(`FIRST_NAME`, `LAST_NAME`, `PHONE_NUM`, `HOUSE_NUM`, `HOUSE_STREET`, `HOUSE_CITY`, `HOUSE_STATE`, `HOUSE_ZIP`)" +
                " VALUES (?,?,?,?,?,?,?,?)";

        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(insertSQL);

            preparedStatement.setString(1,ownerDetails.getOwnerFirstName());
            preparedStatement.setString(2,ownerDetails.getOwnerLastName());
            preparedStatement.setString(3,ownerDetails.getOwnerPhoneNumber());
            preparedStatement.setString(4,ownerDetails.getOwnerHouseNumber());
            preparedStatement.setString(5,ownerDetails.getOwnerHouseStreetName());
            preparedStatement.setString(6,ownerDetails.getOwnerHouseCity());
            preparedStatement.setString(7,ownerDetails.getOwnerHouseState());
            preparedStatement.setInt(8,ownerDetails.getOwnerHouseZip());


            // execute select SQL stetement
            int res = preparedStatement.executeUpdate();

            if(res == 1){
                System.out.println("Record inserted successfully for Owner : "+ownerDetails.getOwnerFirstName()+" "+ownerDetails.getOwnerLastName());
            } else {
                System.out.println("Could not insert record for Owner : "+ownerDetails.getOwnerFirstName()+" "+ownerDetails.getOwnerLastName());
            }


        } catch (SQLException e) {

            System.out.println(e.getMessage());

        } finally {

            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

            if (dbConnection != null) {
                try {
                    dbConnection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        }
    }

    public List<OwnerDetails> getAllOwnerDetails(){
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;
        List<OwnerDetails> ownerDetailsList =  new ArrayList<OwnerDetails>();

        String query = "SELECT " +
                "`ID`, `FIRST_NAME`, `LAST_NAME`, `PHONE_NUM`, `HOUSE_NUM`, `HOUSE_STREET`, `HOUSE_CITY`, `HOUSE_STATE`, `HOUSE_ZIP` " +
                "FROM `OWNER_MASTER`";
        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(query);
            ResultSet res = preparedStatement.executeQuery();
            while (res.next()){
                ownerDetailsList.add(
                        new OwnerDetails(
                                res.getString("ID"),
                                res.getString("FIRST_NAME"),
                                res.getString("LAST_NAME"),
                                res.getString("PHONE_NUM"),
                                res.getString("HOUSE_NUM"),
                                res.getString("HOUSE_STREET"),
                                res.getString("HOUSE_CITY"),
                                res.getString("HOUSE_STATE"),
                                res.getInt("HOUSE_ZIP")
                        )
                );
            }

        } catch (SQLException e) {

            System.out.println(e.getMessage());

        } finally {

            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

            if (dbConnection != null) {
                try {
                    dbConnection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        }

        return ownerDetailsList;
    }

    public ArrayList<String> getAllOwnerContactDetails() {
        ArrayList<String> contactDetails = new ArrayList<String>();
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;
        String query = "SELECT PHONE_NUM FROM OWNER_MASTER";
        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(query);
            ResultSet res = preparedStatement.executeQuery();
            while (res.next()){
                contactDetails.add(res.getString("PHONE_NUM"));
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());

        } finally {

            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

            if (dbConnection != null) {
                try {
                    dbConnection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

        return contactDetails;
    }

}
