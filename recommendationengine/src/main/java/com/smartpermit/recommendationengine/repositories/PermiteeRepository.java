package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.PermiteeDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

/**
 * Created by adwaitkaley on 11/12/16.
 */
@Repository
public class PermiteeRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<PermiteeDetails> findAllPermitees(){
        String selectAllPermitDetailsQuery = "SELECT `ID`, `LICENSE_NUM`, `LICENSE_TYPE`, `FIRST_NAME`, `LAST_NAME`, `BUS_NAME` FROM `PERMITEE_MASTER`";
        return jdbcTemplate.query(selectAllPermitDetailsQuery,new PremiteeRowMapper());
    }

    public List<String> findAllPermiteeLicences(){
        String selectAllPermiteeLicenceQuery = "SELECT LICENSE_NUM FROM PERMITEE_MASTER";
        return jdbcTemplate.queryForList(selectAllPermiteeLicenceQuery,String.class);
    }

    public PermiteeDetails create(final PermiteeDetails permiteeDetails){
        final String insertPermiteeDetailsQuery = "INSERT INTO `PERMITEE_MASTER`" +
                "(`LICENSE_NUM`, `LICENSE_TYPE`, `FIRST_NAME`, `LAST_NAME`, `BUS_NAME`) " +
                "VALUES (?,?,?,?,?)";

        KeyHolder holder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement preparedStatement = connection.prepareStatement(insertPermiteeDetailsQuery, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setString(1,permiteeDetails.getPermiteeLicenseNumber());
                preparedStatement.setString(2,permiteeDetails.getPermiteeLicenseType());
                preparedStatement.setString(3,permiteeDetails.getPermiteeFirstName());
                preparedStatement.setString(4,permiteeDetails.getPermiteeLastName());
                preparedStatement.setString(5,permiteeDetails.getPermiteeBusinessName());
                return preparedStatement;
            }
        },holder);

        String newPermiteeId = holder.getKey().toString();
        permiteeDetails.setPermiteeId(newPermiteeId);
        return permiteeDetails;

    }

    public class PremiteeRowMapper implements RowMapper<PermiteeDetails> {
        @Override
        public PermiteeDetails mapRow(ResultSet resultSet, int i) throws SQLException {
            PermiteeDetails permiteeDetails = new PermiteeDetails();
            permiteeDetails.setPermiteeId(resultSet.getString("ID"));
            permiteeDetails.setPermiteeFirstName(resultSet.getString("FIRST_NAME"));
            permiteeDetails.setPermiteeLastName(resultSet.getString("LAST_NAME"));
            permiteeDetails.setPermiteeBusinessName(resultSet.getString("BUS_NAME"));
            permiteeDetails.setPermiteeLicenseNumber(resultSet.getString("LICENSE_NUM"));
            permiteeDetails.setPermiteeLicenseType(resultSet.getString("LICENSE_TYPE"));
           return permiteeDetails;
        }
    }
}
