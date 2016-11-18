package com.smartpermit.recommendationengine.dao;

import com.smartpermit.recommendationengine.model.PermiteeDetails;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by adwaitkaley on 11/10/16.
 */
public class PermiteeDetailsDAO {
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

    public ArrayList<String> getAllPermiteeLicences() {
        ArrayList<String> permitLicenceNumbers = new ArrayList<String>();
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;
        String query = "SELECT LICENSE_NUM FROM PERMITEE_MASTER";
        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(query);
            ResultSet res = preparedStatement.executeQuery();

            while (res.next()){
                permitLicenceNumbers.add(res.getString("LICENSE_NUM"));
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

        return permitLicenceNumbers;

    }

    public String getPermiteeId(String permiteeLicenseNumber) {
        String permiteeId = null;
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;
        String query = "SELECT ID FROM PERMITEE_MASTER WHERE LICENSE_NUM = ? LIMIT 0,1";


        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(query);
            preparedStatement.setInt(1, Integer.parseInt(permiteeLicenseNumber));
            ResultSet res = preparedStatement.executeQuery();

            while (res.next()){
                permiteeId = res.getString("ID");
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
        return permiteeId;
    }

    public List<PermiteeDetails> getAllPermiteeDetails(){
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;
        List<PermiteeDetails> permiteeDetailsList =  new ArrayList<PermiteeDetails>();

        String query = "SELECT `ID`, `LICENSE_NUM`, `LICENSE_TYPE`, `FIRST_NAME`, `LAST_NAME`, `BUS_NAME` FROM `PERMITEE_MASTER`";
        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(query);
            ResultSet res = preparedStatement.executeQuery();
            while (res.next()){
                permiteeDetailsList.add(
                        new PermiteeDetails(
                                res.getString("ID"),
                                res.getString("FIRST_NAME"),
                                res.getString("LAST_NAME"),
                                res.getString("BUS_NAME"),
                                res.getString("LICENSE_NUM"),
                                res.getString("LICENSE_TYPE")
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

        return permiteeDetailsList;
    }

    public void insertPermiteeDetails(PermiteeDetails permiteeDetails) {

        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;

        String insertSQL = "INSERT INTO `PERMITEE_MASTER`" +
                "(`LICENSE_NUM`, `LICENSE_TYPE`, `FIRST_NAME`, `LAST_NAME`, `BUS_NAME`) " +
                "VALUES (?,?,?,?,?)";

        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(insertSQL);

            preparedStatement.setString(1,permiteeDetails.getPermiteeLicenseNumber());
            preparedStatement.setString(2,permiteeDetails.getPermiteeLicenseType());
            preparedStatement.setString(3,permiteeDetails.getPermiteeFirstName());
            preparedStatement.setString(4,permiteeDetails.getPermiteeLastName());
            preparedStatement.setString(5,permiteeDetails.getPermiteeBusinessName());


            // execute select SQL stetement
            int res = preparedStatement.executeUpdate();

            if(res == 1){
                System.out.println("Record inserted successfully for Permitee : "+permiteeDetails.getPermiteeFirstName()+" "+permiteeDetails.getPermiteeLastName());
            } else {
                System.out.println("Could not insert record for Permitee : "+permiteeDetails.getPermiteeFirstName()+" "+permiteeDetails.getPermiteeLastName());
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

}
