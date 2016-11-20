package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.PermitDetails;
import com.smartpermit.recommendationengine.utils.DateFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.HashMap;
import java.util.List;

/**
 * Created by adwaitkaley on 11/12/16.
 */
@Repository
public class PermitDetailsRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<PermitDetails> findAllPermits(){
        return jdbcTemplate.query("SELECT BIN_NUM,HOUSE_NUM,JOB_TYPE,PERMIT_TYPE,PERMIT_SUBTYPE,PERMIT_WORKTYPE,SEQUENCE_NUM,FILING_DATE,PERMIT_ID,OWNER_ID,PERMITEE_ID FROM PERMIT_DETAILS",new PermitDetailsRowMapper());
    }

    public PermitDetails create(final PermitDetails permitDetails){
        final  String insertPermitDetailSql = "INSERT INTO `PERMIT_DETAILS`" +
                "(`BIN_NUM`, `HOUSE_NUM`, `JOB_TYPE`, `PERMIT_TYPE`, `PERMIT_SUBTYPE`, `PERMIT_WORKTYPE`, `SEQUENCE_NUM`, `FILING_DATE`, `ISSUANCE_DATE`, " +
                "`EXPIRATION_DATE`, `PERMIT_STATUS`, `JOB_START_DATE`, `FILING_STATUS`, `PERMITEE_ID`, `OWNER_ID`, `HOUSE_STREET`, `HOUSE_BOROUGH`, `HOUSE_ZIP`,`PERMIT_ID`) " +
                "VALUES (?,?,?,?,?,?,?,STR_TO_DATE(?,'%m/%d/%Y'),STR_TO_DATE(?, '%m/%d/%Y')," +
                "STR_TO_DATE(?,'%m/%d/%Y'),?,STR_TO_DATE(?,'%m/%d/%Y'),?,?,?,?,?,?,?)";
        KeyHolder holder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement preparedStatement = connection.prepareStatement(insertPermitDetailSql, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setString(1,permitDetails.getPermitBinNumber());
                preparedStatement.setString(2,permitDetails.getPermitHouseNumber());
                preparedStatement.setString(3,permitDetails.getPermitJobType());
                preparedStatement.setString(4,permitDetails.getPermitType());
                preparedStatement.setString(5,permitDetails.getPermitSubType());
                preparedStatement.setString(6,permitDetails.getPermitWorkType());
                preparedStatement.setString(7,permitDetails.getPermitSequenceNumber());
                preparedStatement.setString(8,permitDetails.getPermitFilingDate());
                preparedStatement.setString(9,permitDetails.getPermitIssuanceDate());
                preparedStatement.setString(10,permitDetails.getPermitExpirationDate());
                preparedStatement.setString(11,permitDetails.getPermitStatus());
                preparedStatement.setString(12,permitDetails.getPermitJobStartDate());
                preparedStatement.setString(13,permitDetails.getPermitFilingStatus());
                preparedStatement.setString(14,permitDetails.getPermiteeId());
                preparedStatement.setString(15,permitDetails.getOwnerId());
                preparedStatement.setString(16,permitDetails.getPermitHouseStreetName());
                preparedStatement.setString(17,permitDetails.getPermitBorough());
                preparedStatement.setString(18,permitDetails.getPermitHouseZip());
                preparedStatement.setString(19,permitDetails.getPermitId());
                return preparedStatement;
            }
        },holder);

        String newPermitId = holder.getKey().toString();
        permitDetails.setPermitDetailsId(newPermitId);
        return permitDetails;
    }

    public HashMap<String, List<String>> findAllOwnersAndPermits() {
        List<String> ownerList = findAllOwners();
        HashMap<String, List<String>> ownerPermitMap = new HashMap<>();
        for (String owner : ownerList) {
            List<String> permitList = findPermitsForOwner(owner);
            if (permitList != null) {
                ownerPermitMap.put(owner, permitList);
            }
        }
        return ownerPermitMap;
    }

    public List<String> findAllOwners() {
        String selectByPermitId = "SELECT DISTINCT OWNER_ID " +
                " FROM PERMIT_DETAILS " +
                " ORDER BY OWNER_ID";

        List<String> ownerList = jdbcTemplate.queryForList(selectByPermitId,String.class);

        return ownerList;
    }

    public List<String> findPermitsForOwner(String owner) {
        String selectPermitIdList = "SELECT PERMIT_ID " +
                "FROM PERMIT_DETAILS " +
                "WHERE OWNER_ID = ? " +
                "ORDER BY PERMIT_ID";
        List<String> permitList = jdbcTemplate.queryForList(selectPermitIdList, new Object[]{owner}, String.class);
        return permitList;
    }


    public class PermitDetailsRowMapper implements RowMapper<PermitDetails> {
        @Override
        public PermitDetails mapRow(ResultSet resultSet, int i) throws SQLException {
            PermitDetails permitDetails = new PermitDetails();
            DateFormatter dateFormatter = new DateFormatter();
            permitDetails.setPermitBinNumber(resultSet.getString("BIN_NUM"));
            permitDetails.setPermitHouseNumber(resultSet.getString("HOUSE_NUM"));
            permitDetails.setPermitJobType(resultSet.getString("JOB_TYPE"));
            permitDetails.setPermitType(resultSet.getString("PERMIT_TYPE"));
            permitDetails.setPermitSubType(resultSet.getString("PERMIT_SUBTYPE"));
            permitDetails.setPermitWorkType(resultSet.getString("PERMIT_WORKTYPE"));
            permitDetails.setPermitSequenceNumber(resultSet.getString("SEQUENCE_NUM"));
            permitDetails.setPermitFilingDate(dateFormatter.formatHyphenSeperateddate( resultSet.getString("FILING_DATE")));
            permitDetails.setPermitId(resultSet.getString("PERMIT_ID"));
            permitDetails.setOwnerId(resultSet.getString("OWNER_ID"));
            permitDetails.setPermiteeId(resultSet.getString("PERMITEE_ID"));
            return permitDetails;
        }
    }
}
