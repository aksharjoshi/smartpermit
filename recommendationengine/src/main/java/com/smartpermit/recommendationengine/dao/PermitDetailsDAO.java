package com.smartpermit.recommendationengine.dao;

import com.smartpermit.recommendationengine.model.PermitDetails;

import java.sql.*;
import java.util.ArrayList;

/**
 * Created by adwaitkaley on 11/10/16.
 */
public class PermitDetailsDAO {
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


    public ArrayList<PermitDetails> getAllPermitDetails() {
        ArrayList<PermitDetails> permitDetails = new ArrayList<PermitDetails>();
        PermitDetails permitDetail;
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;
        String query = "SELECT BIN_NUM,HOUSE_NUM,JOB_TYPE,PERMIT_TYPE,PERMIT_SUBTYPE,PERMIT_WORKTYPE,SEQUENCE_NUM,FILING_DATE FROM PERMIT_DETAILS";
        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(query);
            ResultSet res = preparedStatement.executeQuery();

            while (res.next()){
                permitDetail = new PermitDetails();
                permitDetail.setPermitBinNumber(res.getString("BIN_NUM"));
                permitDetail.setPermitHouseNumber(res.getString("HOUSE_NUM"));
                permitDetail.setPermitJobType(res.getString("JOB_TYPE"));
                permitDetail.setPermitType(res.getString("PERMIT_TYPE"));
                permitDetail.setPermitSubType(res.getString("PERMIT_SUBTYPE"));
                permitDetail.setPermitWorkType(res.getString("PERMIT_WORKTYPE"));
                permitDetail.setPermitSequenceNumber(res.getString("SEQUENCE_NUM"));
                String date[] = res.getString("FILING_DATE").split("-");
                permitDetail.setPermitFilingDate(date[2]+"/"+date[1]+"/"+date[0]);
                permitDetails.add(permitDetail);
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


        return permitDetails;
    }

    public void insertPermitDetails(PermitDetails permitDetail) {
        Connection dbConnection = null;
        PreparedStatement preparedStatement = null;

        String insertSQL = "INSERT INTO `PERMIT_DETAILS`" +
                "(`BIN_NUM`, `HOUSE_NUM`, `JOB_TYPE`, `PERMIT_TYPE`, `PERMIT_SUBTYPE`, `PERMIT_WORKTYPE`, `SEQUENCE_NUM`, `FILING_DATE`, `ISSUANCE_DATE`, " +
                "`EXPIRATION_DATE`, `PERMIT_STATUS`, `JOB_START_DATE`, `FILING_STATUS`, `PERMITEE_ID`, `OWNER_ID`, `HOUSE_STREET`, `HOUSE_BOROUGH`, `HOUSE_ZIP`) " +
                "VALUES (?,?,?,?,?,?,?,STR_TO_DATE(?,'%m/%d/%Y'),STR_TO_DATE(?, '%m/%d/%Y')," +
                "STR_TO_DATE(?,'%m/%d/%Y'),?,STR_TO_DATE(?,'%m/%d/%Y'),?,?,?,?,?,?)";

        try {
            dbConnection = getDBConnection();
            preparedStatement = dbConnection.prepareStatement(insertSQL);

            preparedStatement.setString(1,permitDetail.getPermitBinNumber());
            preparedStatement.setString(2,permitDetail.getPermitHouseNumber());
            preparedStatement.setString(3,permitDetail.getPermitJobType());
            preparedStatement.setString(4,permitDetail.getPermitType());
            preparedStatement.setString(5,permitDetail.getPermitSubType());
            preparedStatement.setString(6,permitDetail.getPermitWorkType());
            preparedStatement.setString(7,permitDetail.getPermitSequenceNumber());
            preparedStatement.setString(8,permitDetail.getPermitFilingDate());
            preparedStatement.setString(9,permitDetail.getPermitIssuanceDate());
            preparedStatement.setString(10,permitDetail.getPermitExpirationDate());
            preparedStatement.setString(11,permitDetail.getPermitStatus());
            preparedStatement.setString(12,permitDetail.getPermitJobStartDate());
            preparedStatement.setString(13,permitDetail.getPermitFilingStatus());
            preparedStatement.setString(14,permitDetail.getPermiteeId());
            preparedStatement.setString(15,permitDetail.getOwnerId());
            preparedStatement.setString(16,permitDetail.getPermitHouseStreetName());
            preparedStatement.setString(17,permitDetail.getPermitBorough());
            preparedStatement.setString(18,permitDetail.getPermitHouseZip());




            // execute select SQL stetement
            int res = preparedStatement.executeUpdate();

            if(res == 1){
                System.out.println("Record inserted successfully for Permit Detail : "+permitDetail.getPermitBinNumber()+" "+permitDetail.getPermitHouseNumber());
            } else {
                System.out.println("Could not insert record for Permit Detail : "+permitDetail.getPermitBinNumber()+" "+permitDetail.getPermitHouseNumber());
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
